import { useContext, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PublicForm() {
  const [image, setImage] = useState<string | null>(null); // 단일 메인 이미지
  const [sampleImages, setSampleImages] = useState<string[]>([]); // 여러 샘플 이미지 저장
  const [prompt, setPrompt] = useState<string>(""); // 프롬프트
  const [parameterInput, setParameterInput] = useState<string>(""); // 파라미터 입력 값
  const [parameters, setParameters] = useState<string[]>([]); // 파라미터 배열
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // 현재 날짜와 시간을 "YYYY. MM. DD. HH:mm:ss" 형식으로 포맷팅
  const formatDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}. ${month}. ${day}. ${hours}:${minutes}:${seconds}`;
  };

  // 제출 함수
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return; // 로딩 중인 경우 중복 제출 방지
    if (!validateForm()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, "publics"), {
        image, // 메인 이미지 저장
        sampleImages, // 샘플 이미지 배열 저장
        prompt,
        parameters: parameters.join(", "), // 배열을 문자열로 저장
        createAt: formatDate(),
        email: user?.email,
      });

      toast.success("게시글을 생성했습니다.");
      navigate("/");
    } catch (e: any) {
      console.log(e);
      toast.error(e?.code);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!image) {
      toast.error("메인 이미지를 복사-붙여넣기 해주세요.");
      return false;
    }
    if (sampleImages.length === 0) {
      toast.error("최소 하나의 샘플 이미지를 추가해주세요.");
      return false;
    }
    if (prompt.trim().length < 2) {
      toast.error("프롬프트는 최소 2자 이상이어야 합니다.");
      return false;
    }
    if (parameters.length === 0) {
      toast.error("최소 하나의 파라미터를 추가해주세요.");
      return false;
    }
    return true;
  };

  // 메인 이미지 붙여넣기
  const onImagePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image")) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setImage(event.target?.result as string); // Base64로 변환된 데이터 저장
            toast.success("메인 이미지가 성공적으로 추가되었습니다.");
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  // 샘플 이미지 붙여넣기
  const onSampleImagePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const items = e.clipboardData.items;
    let imageAdded = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image")) {
        const file = items[i].getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setSampleImages((prev) => [
              ...prev,
              event.target?.result as string,
            ]);
            if (!imageAdded) {
              toast.success("샘플 이미지가 성공적으로 추가되었습니다.");
              imageAdded = true;
            }
          };
          reader.readAsDataURL(file);
        }
      }
    }
    if (!imageAdded) {
      toast.error("붙여넣은 내용에 이미지가 없습니다.");
    }
  };

  const onRemoveSampleImage = (index: number) => {
    setSampleImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onAddParameter = () => {
    if (parameterInput.trim() === "") {
      toast.error("빈 파라미터를 추가할 수 없습니다.");
      return;
    }
    setParameters((prev) => [...prev, parameterInput.trim()]);
    setParameterInput("");
  };

  const onRemoveParameter = (index: number) => {
    setParameters((prev) => prev.filter((_, i) => i !== index));
  };

  // 파라미터 입력 중 엔터 키 처리
  const handleParameterKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault(); // 폼 제출 방지
      onAddParameter(); // 파라미터 추가
    }
  };

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="form__block">
        <label htmlFor="image">메인 이미지</label>
        <div
          id="image"
          onPaste={onImagePaste}
          className="image-paste-area"
          style={{
            border: "1px dashed #ddd",
            padding: "10px",
            minHeight: "150px",
            textAlign: "center",
            backgroundColor: "#f9f9f9",
          }}
        >
          {image ? (
            <img
              src={image}
              alt="메인 이미지"
              style={{ maxWidth: "100%", maxHeight: "150px" }}
            />
          ) : (
            "메인 이미지를 복사하여 여기에 붙여넣으세요."
          )}
        </div>
      </div>
    
      <div className="form__block">
        <label htmlFor="prompt">프롬프트</label>
        <textarea
          name="prompt"
          id="prompt"
          required
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        />
      </div>
      <div className="form__block">
        <label htmlFor="parameters">파라미터</label>
        <div className="parameter-input">
          <input
            type="text"
            placeholder="파라미터 추가 (예: full body)"
            value={parameterInput}
            onChange={(e) => setParameterInput(e.target.value)}
            onKeyDown={handleParameterKeyDown} //엔터 키 추가
          />
          <button type="button" onClick={onAddParameter}>
            추가
          </button>
        </div>
        <div className="parameter-list">
          {parameters.map((param, index) => (
            <div key={index} className="parameter-item">
              <span>{param}</span>
              <button type="button" onClick={() => onRemoveParameter(index)}>
                삭제
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="form__block">
        <label htmlFor="sampleImages">샘플 이미지</label>
        <div
          id="sampleImages"
          onPaste={onSampleImagePaste}
          className="image-paste-area"
          style={{
            border: "1px dashed #ddd",
            padding: "10px",
            minHeight: "150px",
            textAlign: "center",
            backgroundColor: "#f9f9f9",
          }}
        >
          <p>샘플 이미지를 복사하여 여기에 붙여넣으세요.</p>
          <div className="image-list">
            {sampleImages.map((img, index) => (
              <div
                key={index}
                className="image-item"
                style={{ position: "relative" }}
              >
                <img
                  src={img}
                  alt={`샘플 이미지 ${index}`}
                  style={{
                    maxWidth: "100px",
                    maxHeight: "100px",
                    borderRadius: "8px",
                    margin: "5px",
                  }}
                />
                <button
                  type="button"
                  onClick={() => onRemoveSampleImage(index)}
                  style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    background: "red",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                  }}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="form__block">
        <input type="submit" value="제출" className="form__btn--submit" />
      </div>
    </form>
  );
}

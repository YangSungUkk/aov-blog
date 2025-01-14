import { useContext, useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PostProps } from "./PrivateList";

export default function PrivateEdit() {
  const params = useParams();
  const [post, setPost] = useState<PostProps | null>(null);
  const [image, setImage] = useState<string | null>(null); // 단일 메인 이미지
  const [sampleImages, setSampleImages] = useState<string[]>([]); // 여러 샘플 이미지 저장
  const [prompt, setPrompt] = useState<string>(""); // 프롬프트
  const [parameterInput, setParameterInput] = useState<string>(""); // 파라미터 입력 값
  const [parameters, setParameters] = useState<string[]>([]); // 파라미터 배열
  const [category, setCategory] = useState<string>("Illustration"); // 기본 카테고리
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const categories = [
    "Illustration",
    "art photography",
    "fashion model",
    "product photo",
  ]; // 카테고리 목록

  // URL에서 카테고리 파라미터 읽기
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory) setCategory(urlCategory);
  }, [searchParams]);

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
    if (loading) return;
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (post && post.id) {
        const postRef = doc(db, "privates", post?.id);
        await updateDoc(postRef, {
          image,
          sampleImages,
          prompt,
          parameters: parameters.join(", "),
          category, // 선택된 카테고리 저장
          updateAt: formatDate(),
        });
        toast.success("게시글을 수정했습니다.");
        navigate(-1);
      }
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
            setImage(event.target?.result as string);
            toast.success("메인 이미지가 성공적으로 추가되었습니다.");
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  // 샘플 이미지 붙여넣기
  const onSampleImagePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
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

  const handleParameterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddParameter();
    }
  };

  //Post 값 불러오기
  const getPost = async (id: string) => {
    if (id) {
      const docRef = doc(db, "privates", id);
      const docSnap = await getDoc(docRef);

      setPost({ id: docSnap.id, ...(docSnap.data() as PostProps) });
    }
  };
  useEffect(() => {
    if (params?.id) getPost(params?.id);
  }, [params?.id]);

  useEffect(() => {
    if (post) {
      // 이미지 값 설정
      setImage(post?.image || null);

      // 샘플 이미지 배열 값 설정
      setSampleImages(post?.sampleImages || []);

      // 프롬프트 값 설정
      setPrompt(post?.prompt || "");

      // 파라미터 값 설정
      if (typeof post.parameters === "string") {
        setParameters(post.parameters.split(", ").map((param) => param.trim()));
      } else {
        setParameters(post.parameters || []);
      }

      // 카테고리 값 설정
      setCategory(post?.category || "Illustration");
    }
  }, [post]);

  return (
    <form onSubmit={onSubmit} className="form">
      <div className="form__block">
        <label htmlFor="category">카테고리</label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* 메인 이미지 */}
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

      {/* 샘플 이미지 */}
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

      {/* 프롬프트 */}
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

      {/* 파라미터 */}
      <div className="form__block">
        <label htmlFor="parameters">파라미터</label>
        <div className="parameter-input">
          <input
            type="text"
            placeholder="파라미터 추가 (예: full body)"
            value={parameterInput}
            onChange={(e) => setParameterInput(e.target.value)}
            onKeyDown={handleParameterKeyDown}
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
        <input type="submit" value="제출" className="form__btn--submit" />
      </div>
    </form>
  );
}

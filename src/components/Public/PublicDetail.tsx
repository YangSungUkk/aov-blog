import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";

interface PostProps {
  image: string; // 메인 이미지
  sampleImages: string[]; // 여러 샘플 이미지
  prompt: string;
  parameters: string | string[]; // 파라미터 (문자열 또는 배열)
  email: string;
  createAt: string;
}

export default function PublicDetail() {
  const { id } = useParams<{ id: string }>(); // URL의 ID 파라미터
  const [post, setPost] = useState<PostProps | null>(null);

  // Firestore에서 데이터 가져오기
  const fetchPost = async () => {
    if (!id) return;
    const docRef = doc(db, "publics", id); // Firestore 문서 참조
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as PostProps;

      // parameters가 문자열인 경우 배열로 변환
      if (typeof data.parameters === "string") {
        data.parameters = data.parameters.split(", ").map((param) => param.trim());
      }

      setPost(data);
    } else {
      console.log("해당 문서를 찾을 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("프롬프트가 클립보드에 복사되었습니다."); // 복사 성공 메시지
    });
  };

  if (!post) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="detail-container">
      {/* 메인 이미지 */}
      <div className="detail-image">
        <h2>메인 이미지</h2>
        <img
          src={post.image}
          alt="메인 이미지"
          style={{ maxWidth: "100%", borderRadius: "8px", marginBottom: "20px" }}
        />
      </div>

     

      {/* 정보 섹션 */}
      <div className="detail-info">
        <h1>프롬프트</h1>
        <p
          style={{ cursor: "pointer", backgroundColor: "#f9f9f9", padding: "10px", borderRadius: "5px" }}
          onClick={() => copyToClipboard(post.prompt)}
        >
          {post.prompt}
        </p>
        <h2>파라미터</h2>
        <ul>
          {Array.isArray(post.parameters) && // parameters가 배열인지 확인
            post.parameters.map((param: string, index: number) => (
              <li key={index}>{param}</li>
            ))}
        </ul>
         {/* 샘플 이미지들 */}
      <div className="detail-sample-images">
        <h2>샘플 이미지</h2>
        <div className="sample-image-grid" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {post.sampleImages.map((sampleImage, index) => (
            <img
              key={index}
              src={sampleImage}
              alt={`샘플 이미지 ${index + 1}`}
              style={{
                maxWidth: "150px",
                maxHeight: "150px",
                borderRadius: "8px",
                objectFit: "cover",
              }}
            />
          ))}
        </div>
      </div>               
        <p>
          <strong>작성일:</strong> {post.createAt}
        </p>
      </div>
    </div>
  );
}

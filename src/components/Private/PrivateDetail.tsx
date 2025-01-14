import { Link, useNavigate, useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { db } from "firebaseApp";
import AuthContext from "context/AuthContext";
import { toast } from "react-toastify";


interface PostProps {
  image: string; // 메인 이미지
  sampleImages: string[]; // 여러 샘플 이미지
  prompt: string;
  parameters: string | string[]; // 파라미터 (문자열 또는 배열)
  category: string;
  email: string;
  createAt: string;
  updateAt: string;
}

export default function PrivateDetail() {
  const { id } = useParams<{ id: string }>(); // URL의 ID 파라미터
  const [post, setPost] = useState<PostProps | null>(null);
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Firestore에서 데이터 가져오기
  const fetchPost = async () => {
    if (!id) return;
    const docRef = doc(db, "privates", id); // Firestore 문서 참조
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as PostProps;

      // parameters가 문자열인 경우 배열로 변환
      if (typeof data.parameters === "string") {
        data.parameters = data.parameters
          .split(", ")
          .map((param) => param.trim());
      }

      setPost(data);
    } else {
      console.log("해당 문서를 찾을 수 없습니다.");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

    // 삭제 함수
    const handleDelete = async () => {
      if (!id) return;
    
      const confirmDelete = window.confirm("이 게시글을 삭제하시겠습니까?");
      if (!confirmDelete) return;
    
      try {
        const docRef = doc(db, "privates", id);
        await deleteDoc(docRef);
        toast.success("게시글이 삭제되었습니다.");
    
        // Firestore에서 가져온 게시글의 카테고리를 사용
        const currentCategory = post?.category || searchParams.get("category") || "Illustration";
    
        navigate(`/private?category=${currentCategory}`); // 해당 카테고리로 이동
      } catch (error) {
        console.error(error);
        toast.error("게시글 삭제 중 오류가 발생했습니다.");
      }
    };

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
          style={{
            maxWidth: "100%",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        />
      </div>

      {/* 정보 섹션 */}
      <div className="detail-info">
        <h1>프롬프트</h1>
        <p
          style={{
            cursor: "pointer",
            backgroundColor: "#f9f9f9",
            padding: "10px",
            borderRadius: "5px",
          }}
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
          <div
            className="sample-image-grid"
            style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
          >
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
          <br></br>
          <strong>작성자:</strong> {post.email}
        </p>
      </div>
      {user?.email === post.email && (
        <div className="post__utils-box">
          <button className="post__delete" onClick={handleDelete}>
            삭제
          </button>
          <Link to={`/private/edit/${id}`} className="post__edit">
            수정
          </Link>
        </div>
      )}
    </div>
  );
}

import AuthContext from "context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface PostProps {
  id?: string;
  image: string; // 메인 이미지
  sampleImages: string[]; // 여러 샘플 이미지
  prompt: string;
  parameters: string | string[]; // 파라미터 (문자열 또는 배열)
  category: string;
  email: string;
  createAt: string;
  updateAt: string;
}

interface PrivateListProps {
  cardStyle?: boolean; // 카드 형식 여부
  selectedCategory: string; // 선택된 카테고리
}

export default function PrivateList({
  cardStyle = false,
  selectedCategory,
}: PrivateListProps) {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);

  const getPosts = async () => {
    const datas = await getDocs(collection(db, "privates"));
    const postsArray: PostProps[] = [];
    datas.forEach((doc) => {
      const dataObj = { ...doc.data(), id: doc.id } as PostProps;
      postsArray.push(dataObj);
    });

    // 선택한 카테고리로 필터링 및 createAt 최근 순으로 정렬
    const sortedPosts = postsArray
      .filter((post) => post.category === selectedCategory)
      .sort(
        (a, b) =>
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
      );

    setPosts(sortedPosts);
  };

  useEffect(() => {
    getPosts();
  }, [selectedCategory]); // 카테고리 변경 시 데이터 다시 가져오기

  if (!posts.length) {
    return <div className="post__no-post">게시글이 없습니다.</div>;
  }

  return (
    <div className={cardStyle ? "grid" : "post__list"}>
      {posts.map((post) => (
        <div key={post.id} className={cardStyle ? "card" : "post__box"}>
          <Link to={`/private/${post.id}`}>
            {cardStyle && post.image && (
              <div className="image-container">
                <img
                  src={post.image}
                  alt="게시물 이미지"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              </div>
            )}
          </Link>
          {/* {user?.email === post.email && (
            <div className="post__utils-box">
              <div className="post__delete">삭제</div>
              <Link to={`/private/edit/${post.id}`} className="post__edit">
                수정
              </Link>
            </div>
          )} */}
        </div>
      ))}
    </div>
  );
}

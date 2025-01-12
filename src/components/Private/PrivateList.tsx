import AuthContext from "context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "firebaseApp";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface PostProps {
  id?: string;
  image: string;
  email: string;
  prompt: string;
  parameters: string;
  createAt: string;
}

interface PrivateListProps {
  cardStyle?: boolean; // 카드 형식 여부
}

export default function PrivateList({ cardStyle = false }: PrivateListProps) {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);

  const getPosts = async () => {
    const datas = await getDocs(collection(db, "privates"));
    const postsArray: PostProps[] = [];
    datas.forEach((doc) => {
      const dataObj = { ...doc.data(), id: doc.id } as PostProps;
      postsArray.push(dataObj);
    });
    setPosts(postsArray);
  };

  useEffect(() => {
    getPosts();
  }, []);

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
          {user?.email === post.email && !cardStyle && (
            <div className="post__utils-box">
              <div className="post__delete">삭제</div>
              <Link to={`/private/edit/${post.id}`} className="post__edit">
                수정
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

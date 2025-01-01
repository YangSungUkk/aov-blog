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

interface PublicListProps {
  cardStyle?: boolean; // 카드 형식 여부
}

export default function PublicList({ cardStyle = false }: PublicListProps) {
  const [posts, setPosts] = useState<PostProps[]>([]);
  const { user } = useContext(AuthContext);

  const getPosts = async () => {
    const datas = await getDocs(collection(db, "publics"));
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
          <Link to={`/public/${post.id}`}>
            {cardStyle && post.image && (
              <div className="image-container">
                <img
                  src={post.image}
                  alt="게시물 이미지"
                  style={{ maxWidth: "100%", borderRadius: "8px" }}
                />
              </div>
            )}
            {/* <div className="post__content">
              <h3>{post.prompt}</h3>
              <p>
                <strong>Parameters:</strong> {post.parameters}
              </p>
              <p>
                <small>
                  <strong>작성자:</strong> {post.email}
                </small>
              </p>
              <p>
                <small>
                  <strong>작성일:</strong> {post.createAt}
                </small>
              </p>
            </div> */}
          </Link>
          {user?.email === post.email && !cardStyle && (
            <div className="post__utils-box">
              <div className="post__delete">삭제</div>
              <Link to={`/public/edit/${post.id}`} className="post__edit">
                수정
              </Link>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

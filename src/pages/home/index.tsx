import Footer from "components/Footer";
import Header from "components/Header";
import PublicList from "components/Public/PublicList";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "firebaseApp";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const auth = getAuth(app);
  const [user, setUser] = useState<any>(null); // 사용자 상태를 관리

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // 로그인된 사용자 정보 설정
      } else {
        setUser(null); // 로그아웃 상태로 설정
      }
    });

    // 컴포넌트 언마운트 시 구독 해제
    return () => unsubscribe();
  }, [auth]);
  return (
    <div className="container">
      <Header />
      <main className="main-content">
        <h1>Public Page</h1>
        {user ? <Link to={"/public/new"}>글쓰기</Link> : <div></div>}
        <PublicList cardStyle={true} />
      </main>
      <Footer />
    </div>
  );
}

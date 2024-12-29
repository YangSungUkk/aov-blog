import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "firebaseApp";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

export default function Header() {
  const auth = getAuth(app);
  const [user, setUser] = useState<any>(null); // 사용자 상태를 관리

  const onSignOut = async () => {
    try {
      const auth = getAuth(app);
      await signOut(auth);
      toast.success("로그아웃 되었습니다.");
    } catch (error: any) {
      console.log(error);
      toast.error(error?.code);
    }
  };

  // Firebase 인증 상태 감지
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
    <>
      <header className="header">
        <div className="logo">
          <Link to={"/"}>AOV</Link>
        </div>
        <nav>
          <ul className="nav-list">
            {user ? (
              //로그인
              <>
                <li>
                  <Link to={"/public"}>Public</Link>
                </li>
                <li>
                  <Link to={"/private"}>Private</Link>
                </li>
                <li>
                  <div
                    role="presentation"
                    className="logout"
                    onClick={onSignOut}
                    style={{ cursor: "pointer" }}
                  >
                    Logout
                  </div>
                </li>
              </>
            ) : (
              // 미 로그인
              <>
                <li>
                  <Link to={"/public"}>Public</Link>
                </li>
                <li className="login">
                  <Link to={"/login"}>Login</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>
    </>
  );
}

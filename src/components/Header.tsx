import { Link } from "react-router-dom";
import { useState } from "react";
import Login from "./Login"; // Login 컴포넌트를 import

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  return (
    <>
      <header className="header">
        <div className="logo">
          <Link to={"/"}>AOV</Link>
        </div>
        <nav>
          <ul className="nav-list">
            {/* <li>
              <Link to={"/public"}>Public</Link>
            </li> */}
            <li>
              <Link to={"/private"}>Private</Link>
            </li>
            <li>
              {/* "Login" 링크 대신 팝업 열기 버튼 */}
              <button className="login-open-button" onClick={openLogin}>
                Login
              </button>
            </li>
          </ul>
        </nav>
      </header>
      {/* 로그인 팝업 렌더링 */}
      {isLoginOpen && <Login onClose={closeLogin} />}
    </>
  );
}
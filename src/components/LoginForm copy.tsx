import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "firebaseApp";
import { useState } from "react";
import {toast} from "react-toastify";

interface LoginProps {
  onClose: () => void; // 팝업 닫기 핸들러
}

export default function Login({ onClose }: LoginProps) {
  const [error, setError] = useState<string>(""); // 에러 메시지 상태
  const [email, setEmail] = useState<string>(""); // 이메일 상태
  const [password, setPassword] = useState<string>(""); // 비밀번호 상태

  const onSubmit = async (e: any) => {
    e.preventDefault(); //해당 폼 미 제출
    try {
        const auth = getAuth(app);//파이어베이스에서 인증 불러오기
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        toast.success("로그인 성공");       
    } catch (error: any) {
        toast.error(error?.code);
        console.log(error);
    }
};

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;

    if (name === "email") {
      setEmail(value);

      const validRegex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

      if (!value?.match(validRegex)) {
        setError("이메일 형식이 올바르지 않습니다.");
      } else {
        setError("");
      }
    }
    if (name === "password") {
      setPassword(value);

      if (value?.length < 8) {
        setError("비밀번호는 8자리 이상 입력해주세요");
      } else {
        setError("");
      }
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        {/* 닫기 버튼 */}
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>로그인</h2>
        <form onSubmit={onSubmit}>
          {/* 이메일 입력 */}
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="이메일"
              value={email}
              onChange={onChange}
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호"
              value={password}
              onChange={onChange}
              required
            />
          </div>

          {/* 에러 메시지 */}
          {error && error?.length > 0 && (
            <div className="form__block">
              <div className="form__error">{error}</div>
            </div>
          )}

          {/* 체크박스 (로그인 상태 유지) */}
          <div className="form-group">
            <label>
              <input type="checkbox" /> 로그인 상태 유지
            </label>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            className="login-button"
            disabled={error?.length > 0}
          >
            로그인
          </button>
        </form>

        {/* 추가 링크 */}
        <div className="login-footer">
          <a href="#register">회원가입</a> |{" "}
          <a href="#find">아이디·비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
}

import React from "react";

interface LoginProps {
  onClose: () => void; // 팝업 닫기 핸들러
}

export default function Login({ onClose }: LoginProps) {
  return (
    <div className="login-overlay">
      <div className="login-modal">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>로그인</h2>
        <form>
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input type="email" id="email" placeholder="이메일" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호"
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input type="checkbox" /> 로그인 상태 유지
            </label>
          </div>
          <button type="submit" className="login-button">
            로그인
          </button>
        </form>
        {/* <div className="login-footer">
          <a href="#register">회원가입</a> | <a href="#find">아이디·비밀번호 찾기</a>
        </div> */}
      </div>
    </div>
  );
}

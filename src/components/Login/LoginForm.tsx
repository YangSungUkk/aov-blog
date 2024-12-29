import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { app } from "firebaseApp";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import styles from "./Form.module.css"; // CSS 모듈 import

export default function LoginForm() {
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);

      toast.success("로그인에 성공했습니다.");
      navigate("/");
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
    <form onSubmit={onSubmit} className={styles.form}>
      <h1 className={styles.form__title}>로그인</h1>
      <div className={styles.form__block}>
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          name="email"
          id="email"
          required
          onChange={onChange}
          value={email}
          className={styles.form__input}
        />
      </div>
      <div className={styles.form__block}>
        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          name="password"
          id="password"
          required
          onChange={onChange}
          value={password}
          className={styles.form__input}
        />
      </div>
      {error && error.length > 0 && (
        <div className={styles.form__block}>
          <div className={styles.form__error}>{error}</div>
        </div>
      )}
      <div className={styles.form__block}>
        계정이 없으신가요?
        <Link to="/signup" className={styles.form__link}>
          회원가입하기
        </Link>
      </div>
      <div className={styles.form__block}>
        <input
          type="submit"
          value="로그인"
          className={styles.form__btn}
          disabled={error?.length > 0}
        />
      </div>
    </form>
  );
}

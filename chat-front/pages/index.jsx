import { useRouter } from "next/router";
import { useState } from "react";
import axios from "../utils/axiosInstance";

export default function Login() {
  const [phoneNumber1, setPhoneNumber1] = useState("");
  const [phoneNumber2, setPhoneNumber2] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Nest.js의 로그인 엔드포인트에 요청

      const response = await axios.post("/users/login", {
        phoneNumber: phoneNumber1,
      });
      if (response.data) {
        // 로그인 성공 시 채팅 페이지로 이동
        router.push(`/chat?phoneNumber=${phoneNumber1}`);
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleSignUp = async () => {
    try {
      // Nest.js의 회원가입 엔드포인트에 요청
      console.log(phoneNumber2);

      await axios.post("/users", { name, phoneNumber: phoneNumber2 });
      alert("회원가입 성공! 로그인 해주세요.");
    } catch (error) {
      console.error("Sign up failed:", error);
    }
  };

  return (
    <div>
      <h1>로그인</h1>
      <input
        type="text"
        placeholder="핸드폰 번호"
        value={phoneNumber1}
        onChange={(e) => setPhoneNumber1(e.target.value)}
      />
      <button onClick={handleLogin}>로그인</button>

      <h2>회원가입</h2>
      <input
        type="text"
        placeholder="이름"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="핸드폰 번호"
        value={phoneNumber2}
        onChange={(e) => setPhoneNumber2(e.target.value)}
      />
      <button onClick={handleSignUp}>회원가입</button>
    </div>
  );
}

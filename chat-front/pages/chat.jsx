import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "../utils/axiosInstance";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userName, setUserName] = useState("");

  const socketRef = useRef(null); // WebSocket 연결을 관리하기 위해 useRef 사용
  const router = useRouter();
  const { phoneNumber } = router.query;

  useEffect(() => {
    // WebSocket 연결 설정
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:4000", {
        transports: ["websocket"], // 명시적으로 WebSocket만 사용
      });

      // WebSocket 연결 이벤트 설정
      socketRef.current.on("connect", () => {
        console.log("Connected to WebSocket server");
      });

      // 메시지 수신 이벤트 설정
      socketRef.current.on("message", (newMessage) => {
        console.log("Received message from server:", newMessage); // 디버깅 로그
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      // WebSocket 연결 해제 이벤트 설정
      socketRef.current.on("disconnect", () => {
        console.log("Disconnected from WebSocket server");
      });
    }

    // 전화번호로 사용자 이름 가져오기
    const fetchUserName = async () => {
      try {
        if (phoneNumber) {
          const response = await axios.get(`/users/${phoneNumber}`);
          setUserName(response.data.name);
        }
      } catch (error) {
        console.error("Failed to fetch user name:", error);
      }
    };

    fetchUserName();

    // 초기 메시지 가져오기
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/messages");
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();

    // 컴포넌트가 언마운트될 때 WebSocket 연결 해제
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null; // 연결 해제 후 null로 설정
      }
    };
  }, [phoneNumber]);

  const sendMessage = () => {
    if (message.trim() && socketRef.current) {
      // WebSocket을 통해 메시지를 전송
      socketRef.current.emit("message", { content: message, sender: userName });

      // 메시지 입력란 초기화
      setMessage("");
    }
  };

  return (
    <div>
      <h1>채팅</h1>
      <div>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.sender === userName ? "right" : "left",
              margin: "10px",
            }}
          >
            <strong>{msg.sender}: </strong>
            {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        placeholder="메시지 입력"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
}

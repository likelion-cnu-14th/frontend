"use client";

import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        "https://study-community-backend.vercel.app/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : "회원가입에 실패했습니다.";
        setErrorMessage(message);
        console.error("회원가입 실패:", data);
        return;
      }

      console.log("회원가입 성공:", data);
      alert("회원가입 성공");
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      const message = "네트워크 오류가 발생했습니다.";
      setErrorMessage(message);
      console.error("회원가입 요청 에러:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "380px",
          padding: "24px",
          border: "1px solid #d4d4d4",
          borderRadius: "12px",
          backgroundColor: "#fff",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "18px", fontSize: "24px" }}>
          회원가입
        </h1>

        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #cfcfcf",
            borderRadius: "8px",
            marginBottom: "10px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #cfcfcf",
            borderRadius: "8px",
            marginBottom: "10px",
            boxSizing: "border-box",
          }}
        />

        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #cfcfcf",
            borderRadius: "8px",
            marginBottom: "12px",
            boxSizing: "border-box",
          }}
        />

        {errorMessage ? (
          <p style={{ margin: "0 0 12px", color: "#444", fontSize: "14px" }}>
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            padding: "10px",
            border: "none",
            borderRadius: "8px",
            backgroundColor: "#111",
            color: "#fff",
            cursor: isSubmitting ? "not-allowed" : "pointer",
            opacity: isSubmitting ? 0.7 : 1,
          }}
        >
          {isSubmitting ? "가입 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
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
        "https://study-community-backend.vercel.app/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
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
            : "로그인에 실패했습니다.";
        setErrorMessage(message);
        console.error("로그인 실패:", data);
        return;
      }

      const token =
        typeof data?.access_token === "string" ? data.access_token : null;

      if (!token) {
        setErrorMessage("토큰 정보가 없습니다.");
        console.error("토큰 누락:", data);
        return;
      }

      localStorage.setItem("access_token", token);
      alert("로그인 성공");
      console.log("로그인 성공:", data);
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (error) {
      const message = "네트워크 오류가 발생했습니다.";
      setErrorMessage(message);
      console.error("로그인 요청 에러:", error);
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
          로그인
        </h1>

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
          {isSubmitting ? "로그인 중..." : "로그인"}
        </button>

        <p style={{ margin: "12px 0 0", fontSize: "14px", color: "#555", textAlign: "center" }}>
          계정이 없나요?{" "}
          <Link
            href="/register"
            style={{ color: "#111", fontWeight: 600, textDecoration: "none" }}
          >
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
}

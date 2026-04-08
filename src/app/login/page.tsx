"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const result = await login({
        email: email.trim(),
        password,
      });

      setAuth(result.access_token, result.user);
      alert("로그인 성공");
      console.log("로그인 성공:", result);
      setEmail("");
      setPassword("");
      router.push("/community");
    } catch (error) {
      setErrorMessage("이메일 또는 비밀번호가 올바르지 않습니다");
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
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            style={{ color: "#111", fontWeight: 600, textDecoration: "none" }}
          >
            회원가입
          </Link>
        </p>
      </form>
    </div>
  );
}

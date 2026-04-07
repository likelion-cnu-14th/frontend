import Link from "next/link";

export default function Home() {
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
      <div style={{ textAlign: "center" }}>
        <h1 style={{ marginBottom: "12px" }}>커뮤니티 게시판</h1>
        <p style={{ marginBottom: "20px", color: "#666" }}>
          글을 확인하고 자유롭게 소통해보세요.
        </p>
        <Link
          href="/community"
          style={{
            display: "inline-block",
            padding: "10px 16px",
            borderRadius: "8px",
            backgroundColor: "#1976d2",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          커뮤니티로 이동
        </Link>
      </div>
    </div>
  );
}

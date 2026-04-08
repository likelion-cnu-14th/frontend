import Link from "next/link";

export default function Home() {
  return (
    <div>
      <header className="app-header">
        <div className="app-header-inner">
          <p className="brand-title">Five-set Community</p>
        </div>
      </header>
      <div className="app-shell" style={{ minHeight: "calc(100vh - 72px)", display: "grid", placeItems: "center" }}>
        <div className="surface-card" style={{ padding: "36px", width: "100%", maxWidth: "560px", textAlign: "center" }}>
          <h1 style={{ marginTop: 0, marginBottom: "10px", fontSize: "32px" }}>커뮤니티 게시판</h1>
          <p style={{ marginBottom: "22px", color: "#666" }}>글을 확인하고 자유롭게 소통해보세요.</p>
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginBottom: "12px" }}>
            <Link
              href="/community"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: "10px",
                backgroundColor: "#111",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              커뮤니티로 이동
            </Link>
            <Link
              href="/login"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: "10px",
                backgroundColor: "#111",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              로그인
            </Link>
            <Link
              href="/register"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: "10px",
                backgroundColor: "#fff",
                color: "#222",
                border: "1px solid #cfcfcf",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              회원가입
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

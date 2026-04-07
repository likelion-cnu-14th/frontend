export default function HomePage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>환영합니다! 👋</h1>
      <p>커뮤니티에서 다양한 이야기를 나눠보세요.</p>
      <a
        href="/community"
        style={{
          display: "inline-block",
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #e5e5e5",
          cursor: "pointer",
          background: "white",
          textDecoration: "none",
          color: "black",
        }}
      >
        커뮤니티 바로가기 →
      </a>
    </div>
  );
}
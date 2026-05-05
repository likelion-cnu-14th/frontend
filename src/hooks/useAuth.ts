export function useAuth() {
  // 모의 인증 훅: 실제로는 로그인 상태를 관리하는 로직이 들어갑니다.
  // 과제 진행을 위해 현재는 항상 로그인된 상태로 가정합니다.
  return {
    isLoggedIn: true,
    user: { id: "user1", username: "홍길동" }
  };
}

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

/**
 * Bearer 접두사/따옴표가 포함된 문자열에서 JWT만 추출합니다.
 */
const normalizeBearerToken = (raw) => {
  if (raw === null || raw === undefined) return "";
  let s = String(raw).trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s.replace(/^Bearer\s+/i, "").trim();
};

/**
 * 로그인/회원가입 등 응답에서 공통 패턴(access_token | accessToken | token)으로 토큰을 찾습니다.
 */
const extractAccessToken = (data) => {
  if (!data || typeof data !== "object") return null;

  const tryPick = (obj) => {
    const cand =
      typeof obj.access_token === "string"
        ? obj.access_token
        : typeof obj.accessToken === "string"
          ? obj.accessToken
          : typeof obj.token === "string"
            ? obj.token
            : null;
    const normalized = normalizeBearerToken(cand);
    return normalized.length ? normalized : null;
  };

  let found = tryPick(data);
  if (found) return found;

  if (data.data && typeof data.data === "object") {
    found = tryPick(data.data);
    if (found) return found;
  }

  return null;
};

// 요청 인터셉터: 브라우저 저장소의 access token을 자동 첨부
api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("access_token");
      const token = normalizeBearerToken(raw);
      if (token.length > 0) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 게시글 목록 조회
export const fetchPosts = async () => {
  const res = await api.get("/posts");
  return res.data;
};

// 회원가입
export const register = async (data) => {
  const res = await api.post("/auth/register", data);
  const token = extractAccessToken(res.data);
  return {
    ...res.data,
    ...(token ? { access_token: token } : {}),
  };
};

// 로그인
export const login = async (data) => {
  const res = await api.post("/auth/login", data);
  const token = extractAccessToken(res.data);
  return {
    ...res.data,
    ...(token ? { access_token: token } : {}),
  };
};

// 내 정보 조회
export const getMe = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

// 게시글 상세 조회
export const fetchPost = async (id) => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
};

// 게시글 작성 (author는 서버에서 토큰 기반으로 처리)
export const createPost = async ({ title, content, section }) => {
  const res = await api.post("/posts", { title, content, section });
  return res.data;
};

// 게시글 삭제
export const deletePost = async (id) => {
  const res = await api.delete(`/posts/${id}`);
  return res.data;
};

// 좋아요 토글
export const toggleLike = async (id) => {
  const res = await api.patch(`/posts/${id}/like`);
  return res.data;
};

// 댓글 작성 (author는 서버에서 토큰 기반으로 처리)
export const createComment = async (postId, { content }) => {
  const res = await api.post(`/posts/${postId}/comments`, { content });
  return res.data;
};

// 댓글 삭제
export const deleteComment = async (commentId) => {
  const res = await api.delete(`/comments/${commentId}`);
  return res.data;
};

// === 스터디룸 API ===

// 스터디룸 목록 조회
export const fetchRooms = async () => {
  const res = await api.get("/rooms");
  return res.data;
};

// 스터디룸 상세 조회
export const fetchRoom = async (roomId) => {
  const res = await api.get(`/rooms/${roomId}`);
  return res.data;
};

// 스터디룸 예약 현황 조회 (특정 날짜)
export const fetchRoomReservations = async (roomId, date) => {
  const res = await api.get(`/rooms/${roomId}/reservations?date=${date}`);
  return res.data;
};

// === 예약 API ===

// 예약 생성
export const createReservation = async (data) => {
  const res = await api.post("/reservations", data);
  return res.data;
};

// 내 예약 목록 조회
export const fetchMyReservations = async () => {
  const res = await api.get("/reservations/me");
  return res.data;
};

// 예약 취소
export const cancelReservation = async (reservationId) => {
  await api.delete(`/reservations/${reservationId}`);
};

export default api;
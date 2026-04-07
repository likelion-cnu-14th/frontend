"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPost } from "@/lib/api"; // 우체국에서 글쓰기 함수 가져오기

export default function WritePage() {
    const router = useRouter();
    
    // 사용자가 입력할 데이터 상태 관리
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [author, setAuthor] = useState(""); // 작성자 추가!
    
    const [submitting, setSubmitting] = useState(false); // 전송 중인지 확인하는 로딩 상태

    // 폼 제출 버튼을 눌렀을 때 실행될 함수
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // 새로고침 방지

        // 1. 입력 검증 (하나라도 비어있으면 빠꾸!)
        if (!title.trim() || !content.trim() || !author.trim()) {
            alert("작성자, 제목, 내용을 모두 입력해주세요.");
            return;
        }

        setSubmitting(true); // "작성 중..." 상태로 변경 (버튼 여러번 눌리는 것 방지)
        
        try {
            // 2. 서버로 데이터 보내기!
            await createPost({ title, content, author });
            
            // 3. 성공하면 목록 페이지로 슝~ 이동
            router.push("/community");
        } catch (err) {
            alert("게시글 작성에 실패했습니다. 다시 시도해주세요.");
            setSubmitting(false); // 실패하면 다시 버튼 누를 수 있게 원상복구
        }
    };

    return (
        <main className="max-w-2xl mx-auto p-4">
            <div className="mb-6">
                <Link href="/community" className="text-gray-500 hover:text-gray-800 transition-colors">
                    &larr; 목록으로
                </Link>
            </div>
            
            <h1 className="text-2xl font-bold mb-6">새 글 작성</h1>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* 작성자 입력 칸 */}
                <div>
                    <label className="block mb-1 font-semibold">작성자</label>
                    <input
                        type="text"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                        placeholder="이름을 입력하세요"
                    />
                </div>

                {/* 제목 입력 칸 */}
                <div>
                    <label className="block mb-1 font-semibold">제목</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:border-blue-500"
                        placeholder="제목을 입력하세요"
                    />
                </div>

                {/* 내용 입력 칸 */}
                <div>
                    <label className="block mb-1 font-semibold">내용</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded h-40 focus:outline-none focus:border-blue-500"
                        placeholder="내용을 입력하세요"
                    />
                </div>

                {/* 제출 버튼 */}
                <button
                    type="submit"
                    disabled={submitting}
                    className={`w-full p-3 rounded text-white font-bold transition-colors ${
                        submitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                    }`}
                >
                    {submitting ? "작성 중..." : "작성하기"}
                </button>
            </form>
        </main>
    );
}


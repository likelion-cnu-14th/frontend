"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPosts } from "@/lib/api"; // 우리가 만든 우체국에서 함수 가져오기!
import { Post } from "@/types/post";
import PostCard from "@/components/PostCard";

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [error, setError] = useState<string | null>(null);

    // 화면이 켜질 때(mount) 딱 한 번만 서버에 데이터 요청하기
    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchPosts(); // 서버에 요청!
                setPosts(data); // 받아온 데이터를 상태에 저장
            } catch (err) {
                setError("게시글을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false); // 성공하든 실패하든 로딩 끝!
            }
        };
        loadPosts();
    }, []);

    // 1. 로딩 중일 때 보여줄 화면
    if (loading) return <div className="p-10 text-center text-gray-500">서버에서 글을 불러오는 중입니다...</div>;
    
    // 2. 에러 났을 때 보여줄 화면
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    // 3. 데이터가 잘 왔을 때 보여줄 진짜 화면
    return (
        <main className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">커뮤니티 게시판</h1>
                <Link href="/community/write" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors">
                    글 작성
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-lg">
                    아직 게시글이 없습니다. 첫 게시글을 작성해보세요!
                </div>
            ) : (
                <div className="grid gap-4">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            )}
        </main>
    );
}
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPosts } from "@/lib/api"; 
import { Post } from "@/types/post";
import PostCard from "@/components/PostCard";

export default function CommunityPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const data = await fetchPosts();
                setPosts(data);
            } catch (err) {
                setError("게시글을 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        };
        loadPosts();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">로딩 중...</div>;
    if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

    return (
        <main className="max-w-4xl mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">커뮤니티 게시판</h1>
                <Link href="/community/write" className="bg-blue-500 text-white px-4 py-2 rounded">글 작성</Link>
            </div>
            <div className="grid gap-4">
                {posts.map((post) => (<PostCard key={post.id} post={post} />))}
            </div>
        </main>
    );
}
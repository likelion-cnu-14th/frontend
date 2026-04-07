import Link from "next/link";
import { Post } from "@/types/post";

interface PostCardProps {
    post: Post;
}

export default function PostCard({ post }: PostCardProps) {
    return (
        <Link href={`/community/${post.id}`}>
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer">
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                
                <div className="text-gray-500 text-sm mb-4">
                    <span className="mr-3">{post.author}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center space-x-1">
                        <span>❤️</span>
                        <span>{post.likes}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                        <span>💬</span>
                        {/* 서버에서 주는 댓글 수 표시 */}
                        <span>{post.commentCount || post.comments?.length || 0}</span>
                    </span>
                </div>
            </div>
        </Link>
    );
}

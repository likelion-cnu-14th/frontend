import Link from "next/link";
import { Post } from "@/types/post";

export default function PostCard({ post }: { post: Post }) {
    return (
        <Link href={`/community/${post.id}`}>
            <div className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                <h2 className="text-xl font-bold mb-2">{post.title}</h2>
                <div className="text-gray-500 text-sm mb-4">
                    <span className="mr-3">{post.author}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.commentCount || 0}</span>
                </div>
            </div>
        </Link>
    );
}

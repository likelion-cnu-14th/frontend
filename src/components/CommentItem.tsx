import { Comment } from "@/types/post";

interface CommentItemProps {
    comment: Comment;
    onDelete: () => void; // 부모 컴포넌트에서 삭제 함수를 받아옵니다
}

export default function CommentItem({ comment, onDelete }: CommentItemProps) {
    return (
        <div className="bg-white p-4 rounded shadow-sm border flex justify-between items-start">
            <div>
                <div className="flex items-center space-x-2 mb-2">
                    <span className="font-bold">{comment.author}</span>
                    <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                </div>
                <p className="text-gray-800">{comment.content}</p>
            </div>
            {/* 삭제 버튼 추가! */}
            <button 
                onClick={onDelete}
                className="text-red-400 hover:text-red-600 text-xs px-2 py-1"
            >
                삭제
            </button>
        </div>
    );
}


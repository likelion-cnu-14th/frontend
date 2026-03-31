type Comment = {
    id: string;
    author: string;
    content: string;
    createdAt: string;
  };
  
  export default function CommentItem({ comment }: { comment: Comment }) {
    return (
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        <p>작성자: {comment.author}</p>
        <p>{comment.content}</p>
        <p>작성일: {comment.createdAt}</p>
      </div>
    );
  }
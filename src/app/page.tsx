import Link from "next/link";

export default function HomePage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <h1 className="text-4xl font-bold mb-4">스터디 커뮤니티 🎉</h1>
            <p className="text-gray-600 mb-8 text-center leading-relaxed">
                프론트엔드와 백엔드가 완벽하게 연결된 커뮤니티입니다.<br/>
                자유롭게 글을 작성하고 이야기를 나눠보세요!
            </p>
            <Link 
                href="/community" 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-md"
            >
                커뮤니티 입장하기
            </Link>
        </main>
    );
}
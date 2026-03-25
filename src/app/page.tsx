import Image from "next/image";

export default function Home() {
  return (
    <div>
      <h2>Welcome</h2>
      <p>Hello, WEB!!</p>
      <Image src="/cat.jpg" alt="cat" width={300} height={200} />
    </div>
  );
}
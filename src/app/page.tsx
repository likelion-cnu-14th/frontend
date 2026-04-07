import Link from "next/link";
import {
  MessageCircle,
  Users,
  BookOpen,
  TrendingUp,
  ArrowRight,
  PenLine,
  Lightbulb,
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "자유로운 소통",
    description: "질문, 토론, 정보 공유까지 자유롭게 글을 작성하고 댓글로 소통하세요.",
  },
  {
    icon: Users,
    title: "함께하는 학습",
    description: "혼자보다 함께할 때 더 빠르게 성장합니다. 스터디 메이트를 찾아보세요.",
  },
  {
    icon: Lightbulb,
    title: "지식 나눔",
    description: "내가 배운 것을 공유하고, 다른 사람의 경험에서 인사이트를 얻으세요.",
  },
];

const steps = [
  { number: "1", title: "커뮤니티 입장", description: "별도 가입 없이 바로 참여" },
  { number: "2", title: "글 작성", description: "궁금한 점이나 배운 것을 공유" },
  { number: "3", title: "소통 & 성장", description: "댓글로 토론하며 함께 성장" },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-16 py-4">
      {/* Hero */}
      <section className="flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight">
          스터디 커뮤니티
        </h1>
        <p className="mb-8 max-w-md text-lg text-muted-foreground">
          함께 배우고, 나누고, 성장하는 공간.
          <br />
          지금 바로 참여해보세요.
        </p>
        <div className="flex gap-3">
          <Link
            href="/community"
            className="flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            커뮤니티 입장
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/community/write"
            className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            <PenLine className="h-4 w-4" />
            글 작성하기
          </Link>
          <Link
            href="/study-room"
            className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            스터디룸 예약
          </Link>
        </div>
      </section>

      {/* Features */}
      <section>
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          왜 스터디 커뮤니티인가요?
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-xl border border-border p-5 transition-colors hover:bg-accent/50"
            >
              <feature.icon className="mb-3 h-5 w-5 text-primary" />
              <h3 className="mb-1 font-semibold">{feature.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <h2 className="mb-6 text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          참여 방법
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row">
          {steps.map((step, i) => (
            <div key={step.number} className="flex flex-1 items-start gap-3 rounded-xl border border-border p-5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {step.number}
              </span>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="hidden h-4 w-4 self-center text-muted-foreground sm:block" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Stats / Social proof */}
      <section className="rounded-xl bg-accent/50 p-8 text-center">
        <TrendingUp className="mx-auto mb-3 h-6 w-6 text-primary" />
        <p className="text-lg font-semibold">함께 성장하는 커뮤니티</p>
        <p className="mt-1 text-sm text-muted-foreground">
          매일 새로운 글과 토론이 이어지고 있습니다
        </p>
        <Link
          href="/community"
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline"
        >
          최신 글 확인하기 <ArrowRight className="h-3 w-3" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border pt-6 text-center text-xs text-muted-foreground">
        <p>스터디 커뮤니티 &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <p className="font-mono text-7xl font-bold text-primary">404</p>
      <h1 className="mt-4 text-2xl font-bold">페이지를 찾을 수 없습니다</h1>
      <p className="mt-2 text-muted-foreground">주소가 바뀌었거나 삭제된 글일 수 있어요.</p>
      <Link href="/" className="mt-8 card-brutal hover-lift bg-primary px-4 py-2 font-semibold text-primary-foreground">
        홈으로
      </Link>
    </main>
  );
}

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md border-b py-3">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/">Kitob Checking</Link>
      </div>
    </header>
  );
}

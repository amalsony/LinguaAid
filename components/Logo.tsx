import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/LinguaAidLogo.svg"
        alt="LinguaAid logo"
        width={32}
        height={32}
        priority
        className="invert-[var(--logo-invert)]"
      />
      <span className="text-lg font-semibold tracking-tight text-[var(--text)]">LinguaAid</span>
    </Link>
  );
}

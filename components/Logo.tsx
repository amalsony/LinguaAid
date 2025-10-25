import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Image
        src="/LinguaAidLogo.svg"
        alt="LinguaAid logo"
        width={28}
        height={28}
        priority
      />
      <span className="text-lg font-semibold tracking-tight">LinguaAid</span>
    </Link>
  );
}

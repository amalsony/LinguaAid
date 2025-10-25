import AccessibilityButton from "./AccessibilityButton";
import Logo from "./Logo";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <Logo />
        <AccessibilityButton />
      </div>
    </header>
  );
}

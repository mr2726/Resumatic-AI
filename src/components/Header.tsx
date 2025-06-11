import { Logo } from './Logo';

export function Header() {
  return (
    <header className="py-4 px-6 border-b bg-card shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        {/* Navigation links can be added here if the app expands */}
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="py-6 px-6 border-t mt-auto bg-card">
      <div className="container mx-auto text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} Resumatic AI. All rights reserved.</p>
        <p className="mt-1">Powered by AI to help you land your dream job.</p>
      </div>
    </footer>
  );
}

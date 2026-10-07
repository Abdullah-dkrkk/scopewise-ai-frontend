export default function PreviewHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-brand-blue font-heading text-sm font-semibold text-white">
            SW
          </div>
          <span className="font-heading text-lg font-semibold tracking-tight">ScopeWise AI</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full border px-3 py-1 text-xs font-medium text-muted-foreground sm:inline">
            Design Preview
          </span>
        </div>
      </div>
    </header>
  );
}

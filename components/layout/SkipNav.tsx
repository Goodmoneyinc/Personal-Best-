export function SkipNav() {
  return (
    <a
      className="sr-only z-50 rounded-full bg-gold px-4 py-3 font-semibold text-navy focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-navy"
      href="#main-content"
    >
      Skip to main content
    </a>
  );
}

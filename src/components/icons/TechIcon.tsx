import { techPaths } from "./techPaths";

export function TechIcon({ name, className }: { name: string; className?: string }) {
  const path = techPaths[name];
  if (!path) return null;

  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={path} />
    </svg>
  );
}

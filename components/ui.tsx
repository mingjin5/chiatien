// Các thành phần giao diện dùng chung. Không cần "use client".

const TONES = ["#ffd23f", "#8be0b5", "#ffa8b8", "#a9c8ff", "#c9b6ff", "#ffb982"];

function toneFor(name: string) {
  let h = 0;
  for (const ch of name) h = (h * 31 + (ch.codePointAt(0) ?? 0)) >>> 0;
  return TONES[h % TONES.length];
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  const last = parts[parts.length - 1];
  const text = parts.length > 1 ? parts[0][0] + last[0] : last.slice(0, 2);
  return text.toUpperCase();
}

// Người Việt gọi nhau bằng tên, là chữ cuối cùng
export function givenName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts[parts.length - 1] ?? name;
}

export function Avatar({
  name,
  size = 40,
  ring = false,
}: {
  name: string;
  size?: number;
  ring?: boolean;
}) {
  return (
    <span
      title={name}
      aria-hidden="true"
      style={{
        background: toneFor(name),
        width: size,
        height: size,
        fontSize: Math.round(size * 0.38),
      }}
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-bold text-ink ${ring ? "ring-2 ring-white" : ""}`}
    >
      {initials(name)}
    </span>
  );
}

export function AvatarStack({
  names,
  max = 4,
  size = 32,
}: {
  names: string[];
  max?: number;
  size?: number;
}) {
  const shown = names.slice(0, max);
  const extra = names.length - shown.length;
  return (
    <span className="flex items-center -space-x-2">
      {shown.map((n, i) => (
        <Avatar key={i} name={n} size={size} ring />
      ))}
      {extra > 0 && (
        <span
          style={{ width: size, height: size }}
          className="inline-flex items-center justify-center rounded-full bg-line text-xs font-semibold text-muted ring-2 ring-white"
        >
          +{extra}
        </span>
      )}
    </span>
  );
}

// Logo: đồng xu chia đôi, đường đứt nét là chỗ "chia"
export function Logo({ size = 32 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2 font-display text-2xl font-extrabold leading-none">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="16" fill="#ffd23f" />
        <path d="M16 0A16 16 0 0 1 16 32Z" fill="#14b87a" />
        <path
          d="M16 5v22"
          stroke="#241b4b"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="0.1 5"
        />
      </svg>
      Chia Tiền
    </span>
  );
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition active:translate-y-px disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: `${base} bg-sun text-ink shadow-[0_3px_0_var(--color-sun-deep)] hover:brightness-105 active:shadow-[0_1px_0_var(--color-sun-deep)]`,
  soft: `${base} bg-white text-ink ring-1 ring-line hover:bg-canvas`,
  ghost: `${base} text-muted hover:text-ink`,
};

const sizes = {
  md: "h-12 px-6 text-base",
  sm: "h-10 px-4 text-sm",
};

export function buttonClass(
  variant: keyof typeof variants = "primary",
  size: keyof typeof sizes = "md",
) {
  return `${variants[variant]} ${sizes[size]}`;
}

export const inputClass =
  "h-12 w-full min-w-0 rounded-full bg-white px-5 text-base ring-1 ring-line placeholder:text-muted/70";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`motion-safe:animate-pulse bg-line ${className}`} />
  );
}

export function PageSkeleton() {
  return (
    <main
      aria-busy="true"
      className="mx-auto w-full max-w-xl px-5 pt-24"
    >
      <Skeleton className="h-10 w-2/3 rounded-full" />
      <Skeleton className="mt-6 h-12 w-full rounded-full" />
      <Skeleton className="mt-10 h-40 w-full rounded-3xl" />
    </main>
  );
}

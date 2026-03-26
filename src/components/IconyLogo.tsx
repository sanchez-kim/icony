interface IconyLogoProps {
  size?: number;
}

export function IconyLogo({ size = 40 }: IconyLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="icony-bg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="12" fill="url(#icony-bg)" />
      <path d="M24 5L26.5 18L40 24L26.5 30L24 43L21.5 30L8 24L21.5 18Z" fill="white" />
      <circle cx="38" cy="9" r="2.2" fill="white" opacity="0.65" />
      <circle cx="10" cy="39" r="1.5" fill="white" opacity="0.45" />
    </svg>
  );
}

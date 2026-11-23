type Props = {
  size?: number;
  className?: string;
};

export function LeafMark({ size = 28, className }: Props) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M32 8c-3.2 9.2-11 15.4-20 16.4 8.4 1.8 15.1 7.8 18.1 15.9 3-8.1 9.7-14.1 18.1-15.9C43 23.4 35.2 17.2 32 8z"
        fill="currentColor"
      />
      <path
        d="M32 40c-2.1 6.1-7.2 10.1-13.1 10.9 5.5 1.2 9.9 5.1 11.9 10.4 2-5.3 6.4-9.2 11.9-10.4C39.2 50.1 34.1 46.1 32 40z"
        fill="currentColor"
        opacity="0.72"
      />
    </svg>
  );
}

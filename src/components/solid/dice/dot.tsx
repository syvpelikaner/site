export interface DotProps {
  n: number;
}

export const Dot = ({ n }: DotProps) => (
  <>
    {Array.from({ length: n }, () => (
      <div class="dot"></div>
    ))}
  </>
);

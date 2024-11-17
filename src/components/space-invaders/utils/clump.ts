export const clump = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

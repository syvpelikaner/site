import type { CommonGameState } from "../types";

export interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
}

export interface StarState extends CommonGameState {
  stars: Star[];
}

function createStar(width: number, height: number) {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 2 + 0.5,
  };
}

export function createStars(width: number, height: number) {
  const count = 100;
  return Array.from({ length: count }, () => createStar(width, height));
}

export function updateStars({ stars, width, height }: StarState) {
  stars.forEach((star) => {
    star.y += star.speed;
    if (star.y > height) {
      star.y = 0;
      star.x = Math.random() * width;
    }
  });
}

export function renderStars(
  ctx: OffscreenCanvasRenderingContext2D,
  { stars }: StarState
) {
  ctx.fillStyle = "white";
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

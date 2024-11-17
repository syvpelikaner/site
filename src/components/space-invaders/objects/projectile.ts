import type { CommonGameState, Rect } from "../types";
import type { PlayerState } from "./player";

export interface Projectile extends Rect {
  active: boolean;
}

export interface ProjectileState extends PlayerState, CommonGameState {
  projectile: Projectile;
}

const projectileSettings = {
  width: 5,
  height: 10,
  speed: 7,
};

export function getInitialProjectileState() {
  return {
    width: projectileSettings.width,
    height: projectileSettings.height,
    x: 0,
    y: 0,
    active: false,
  };
}

export function shootProjectile(state: ProjectileState) {
  if (!state.projectile.active) {
    state.projectile.x = state.player.x;
    state.projectile.y = state.player.y;
    state.projectile.active = true;
  }
}

export function renderProjectile(
  ctx: OffscreenCanvasRenderingContext2D,
  { projectile }: ProjectileState
) {
  if (projectile.active) {
    ctx.fillStyle = "red";
    ctx.fillRect(
      projectile.x - projectileSettings.width / 2,
      projectile.y,
      projectileSettings.width,
      projectileSettings.height
    );
  }
}

export function updateProjectile(state: ProjectileState) {
  if (state.inputs.spacePressed) {
    shootProjectile(state);
  }
  if (state.projectile.active) {
    state.projectile.y -= projectileSettings.speed;
    if (state.projectile.y < 0) {
      state.projectile.active = false;
    }
  }
}

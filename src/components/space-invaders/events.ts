import type { GameState } from "./game";
import { isColliding } from "./utils/is-colliding";

export function checkGameOver(state: GameState) {
  const enemiesReachPlayer = state.enemies.items
    .flat()
    .some(({ y, killed }) => !killed && y > state.height - 50);

  if (enemiesReachPlayer) {
    state.status = "fail";
  }
}

export function checkCollisions(state: GameState) {
  const {
    projectile,
    enemies: { items },
  } = state;

  items.forEach((row) =>
    row.forEach((enemy) => {
      if (!enemy.killed && isColliding(projectile, enemy)) {
        enemy.killed = true;
        projectile.active = false;
      }
    })
  );
}

export function checkWin(state: GameState) {
  const enemiesReachPlayer = state.enemies.items
    .flat()
    .every(({ killed }) => killed);

  if (enemiesReachPlayer) {
    state.status = "win";
  }
}

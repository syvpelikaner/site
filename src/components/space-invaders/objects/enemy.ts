import type { CommonGameState, Rect } from "../types";
import { delay } from "../utils/delay";
import { getShuffledOrder } from "../utils/get-shuffled-order";

export interface Enemy extends Rect {
  movement: number;
  killed: boolean;
}

export interface EnemiesState extends CommonGameState {
  enemies: {
    speed: number;
    step: number;
    items: Enemy[][];
  };
}

const enemySettings = {
  width: 25,
  height: 25,
  color: "#8b8b8b",
  gap: 15,
  stepingSpeed: 10,
};

export function getInitialEnemiesState(
  enemies: [number, number],
  width: number
): EnemiesState["enemies"] {
  const initialX =
    width / 2 - (enemies[1] * (enemySettings.width + enemySettings.gap)) / 2;
  const initialY = enemySettings.height;
  return {
    speed: 1,
    step: 0,
    items: Array.from({ length: enemies[0] }, (_, row) => {
      const rowGap = row * enemySettings.gap;
      return Array.from({ length: enemies[1] }, (_, column) => ({
        width: enemySettings.width,
        height: enemySettings.height,
        x: initialX + column * enemySettings.width + column * enemySettings.gap,
        y: initialY + row * enemySettings.height + rowGap,
        movement: 0,
        killed: false,
      }));
    }),
  };
}

function renderEnemy(ctx: OffscreenCanvasRenderingContext2D, enemy: Enemy) {
  if (enemy.killed) {
    return;
  }
  ctx.fillStyle = enemySettings.color;
  ctx.fillRect(enemy.x, enemy.y, enemySettings.width, enemySettings.height);
  ctx.strokeRect(enemy.x, enemy.y, enemySettings.width, enemySettings.height);
}

export function renderEnemies(
  ctx: OffscreenCanvasRenderingContext2D,
  state: EnemiesState
) {
  state.enemies.items
    .flat()
    .filter(({ killed }) => !killed)
    .forEach((enemy) => renderEnemy(ctx, enemy));
}

function updateEnemy(enemy: Enemy, state: EnemiesState) {
  if (state.enemies.step > 0) {
    enemy.y += state.enemies.step;
  }

  if (enemy.movement !== 0) {
    enemy.x += enemy.movement;
    enemy.movement = 0;
  }
}

export function updateEnemies(state: EnemiesState) {
  state.enemies.items.forEach((row) =>
    row.forEach((enemy) => updateEnemy(enemy, state))
  );

  if (state.enemies.step > 0) {
    state.enemies.step = 0;
  }
}

export function handleEnemiesEvents(state: EnemiesState) {
  setInterval(() => {
    state.enemies.step = enemySettings.stepingSpeed;
  }, 4000);

  runMoves(state, -1);
}

function getDirection(
  x: number,
  paddings: [number, number],
  direction: -1 | 1
) {
  if (direction === -1 && x <= paddings[0]) {
    return 1;
  } else if (direction === 1 && x >= paddings[1]) {
    return -1;
  }

  return direction;
}

async function runMoves(state: EnemiesState, currentDirection: -1 | 1) {
  const direction = getDirection(
    state.enemies.items[0][0].x,
    [50, state.width - 50],
    currentDirection
  );
  const order = getShuffledOrder(state.enemies.items);
  for (const row of order) {
    for (const column of state.enemies.items[row]) {
      column.movement = (enemySettings.width / 3) * direction;
      await delay(state.enemies.items[row].length * 5);
    }
    await delay(
      (state.enemies.items.length + state.enemies.items[row].length) * 10
    );
  }

  await runMoves(state, direction);
}

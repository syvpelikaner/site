import {
  createStars,
  updateStars,
  renderStars,
  type StarState,
} from "./objects/stars";
import {
  getInitialPlayerState,
  renderPlayer,
  updatePlayer,
  type PlayerState,
} from "./objects/player";
import type { CommonGameState } from "./types";
import { type InputsState, handleUserInput } from "./inputs";
import {
  getInitialProjectileState,
  renderProjectile,
  updateProjectile,
  type ProjectileState,
} from "./objects/projectile";
import {
  getInitialEnemiesState,
  handleEnemiesEvents,
  renderEnemies,
  updateEnemies,
  type EnemiesState,
} from "./objects/enemy";
import { checkCollisions, checkGameOver, checkWin } from "./events";

export interface GameState
  extends CommonGameState,
    PlayerState,
    StarState,
    InputsState,
    ProjectileState,
    EnemiesState {
  status: "fail" | "win" | "progress";
}

function render(ctx: OffscreenCanvasRenderingContext2D, state: GameState) {
  ctx.clearRect(0, 0, state.width, state.height);

  renderStars(ctx, state);
  renderPlayer(ctx, state);
  renderProjectile(ctx, state);
  renderEnemies(ctx, state);

  if (state.status === "fail") {
    ctx.fillStyle = "red";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", state.width / 2, state.height / 2);
  }

  if (state.status === "win") {
    ctx.fillStyle = "green";
    ctx.font = "40px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Congratulations", state.width / 2, state.height / 2);
  }
}

function update(state: GameState) {
  if (state.status !== "progress") {
    return;
  }

  updateStars(state);
  updatePlayer(state);
  updateProjectile(state);
  updateEnemies(state);

  checkGameOver(state);
  checkWin(state);
  checkCollisions(state);
}

function gameLoop(ctx: OffscreenCanvasRenderingContext2D, state: GameState) {
  update(state);
  render(ctx, state);
  requestAnimationFrame(() => gameLoop(ctx, state));
}

export function startGame(canvas: OffscreenCanvas) {
  const context = canvas?.getContext("2d");

  if (context === null) {
    throw new Error("Game start failed");
  }

  const width = canvas.width;
  const height = canvas.height;

  const gameState: GameState = {
    status: "progress",
    width,
    height,
    stars: createStars(width, height),
    player: getInitialPlayerState(width, height),
    inputs: { rightPressed: false, leftPressed: false, spacePressed: false },
    projectile: getInitialProjectileState(),
    enemies: getInitialEnemiesState([5, 9], width),
  };

  handleUserInput(gameState);
  handleEnemiesEvents(gameState);
  gameLoop(context, gameState);
}

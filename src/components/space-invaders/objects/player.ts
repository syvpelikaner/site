import type { InputsState } from "../inputs";
import type { CommonGameState, Rect } from "../types";
import { clump } from "../utils/clump";

export interface Player extends Rect {
  movement: number;
}

export interface PlayerState extends CommonGameState, InputsState {
  player: Player;
}

const playerSettings = {
  color: "#fff",
  width: 20,
  height: 20,
};

export function getInitialPlayerState(width: number, height: number) {
  return {
    width: playerSettings.width,
    height: playerSettings.height,
    x: width / 2,
    y: height - 20,
    movement: 0,
  };
}

export function renderPlayer(
  ctx: OffscreenCanvasRenderingContext2D,
  { player: { x, y }, height }: PlayerState
) {
  ctx.fillStyle = playerSettings.color;
  ctx.fillRect(
    x - playerSettings.width / 2,
    y - playerSettings.height / 2,
    playerSettings.width,
    playerSettings.height
  );
}

export function updatePlayer(state: PlayerState) {
  const { leftPressed, rightPressed } = state.inputs;
  if (leftPressed && !rightPressed) {
    state.player.movement = -3;
  } else if (!leftPressed && rightPressed) {
    state.player.movement = 3;
  } else {
    state.player.movement = 0;
  }

  state.player.x = clump(
    state.player.x + state.player.movement,
    playerSettings.width / 2,
    state.width - playerSettings.width / 2
  );
}

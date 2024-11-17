export interface InputsState {
  inputs: {
    leftPressed: boolean;
    rightPressed: boolean;
    spacePressed: boolean;
  };
}

export function handleUserInput(state: InputsState) {
  document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft") {
      state.inputs.leftPressed = true;
    } else if (event.code === "ArrowRight") {
      state.inputs.rightPressed = true;
    } else if (event.code === "Space") {
      state.inputs.spacePressed = true;
    }
  });

  document.addEventListener("keyup", (event) => {
    if (event.code === "ArrowLeft") {
      state.inputs.leftPressed = false;
    } else if (event.code === "ArrowRight") {
      state.inputs.rightPressed = false;
    } else if (event.code === "Space") {
      state.inputs.spacePressed = false;
    }
  });
}

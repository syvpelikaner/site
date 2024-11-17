import { createSignal } from "solid-js";

import "./styles.css";
import { DiceImpl } from "./dice-impl";
import { Dot } from "./dot";

const dice = new DiceImpl();

// 2 -35 -45 90
// 3 -35 -45 0
// 4 145 -45 0
// 5 -35 -45 270

export const Dice = () => {
  const [rotations, setRotations] = createSignal([0, 0, 0]);

  function handleClick() {
    setRotations(() => [
      Math.floor(Math.random() * 4) * 90 * (Math.random() > 0.5 ? 1 : -1),
      Math.floor(Math.random() * 4) * 90 * (Math.random() > 0.5 ? 1 : -1),
      Math.floor(Math.random() * 4) * 90 * (Math.random() > 0.5 ? 1 : -1),
    ]);
  }

  return (
    <div class="container">
      <div class="camera">
        <div
          class="dice"
          onClick={handleClick}
          style={{
            transform: `rotateX(${rotations()[0]}deg) rotateY(${rotations()[1]}deg) rotateZ(${rotations()[2]}deg)`,
          }}
        >
          <div class="face six">
            <Dot n={6} />
          </div>
          <div class="face one">
            <Dot n={1} />
          </div>
          <div class="face five five-like">
            <Dot n={5} />
          </div>
          <div class="face two five-like">
            <Dot n={2} />
          </div>
          <div class="face three five-like">
            <Dot n={3} />
          </div>
          <div class="face four">
            <Dot n={4} />
          </div>
        </div>
      </div>
    </div>
  );
};

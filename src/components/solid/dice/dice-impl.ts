import Mitt from "mitt";

type Events = {
  throw: { angle: number; strength: number };
};

export class DiceImpl {
  constructor(
    private prevX = window.screenX,
    private prevY = window.screenY,
    private mitt = Mitt<Events>(),
    private isDragging = false,
    private prevTime?: number
  ) {}

  handleWindowMove = (time: number) => {
    if (!this.isDragging) return;

    if (this.prevTime === undefined) {
      this.prevTime = time;
    }

    if (time - this.prevTime > 300) {
      const x = window.screenX;
      const y = window.screenY;
      const deltaX = this.prevX - x;
      const deltaY = y - this.prevY;

      const strength = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      let angle = strength > 30 ? Math.atan2(deltaX, deltaY) : 0;

      this.prevTime = time;
      this.prevX = x;
      this.prevY = y;
    }
    requestAnimationFrame(this.handleWindowMove);
  };

  handleMouseUp = () => {
    if (this.isDragging) {
      const x = window.screenX;
      const y = window.screenY;
      const deltaX = this.prevX - x;
      const deltaY = y - this.prevY;

      const strength = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      const angle = strength > 30 ? Math.atan2(deltaX, deltaY) : 0;

      // Emit "throw" event
      this.mitt.emit("throw", { angle, strength });

      // Reset dragging status
      this.isDragging = false;
    }
  };

  startTracking = () => {
    this.isDragging = true;
    this.prevX = window.screenX;
    this.prevY = window.screenY;
    this.prevTime = undefined;

    requestAnimationFrame(this.handleWindowMove);
  };

  run() {
    window.addEventListener("mousedown", this.startTracking);
    window.addEventListener("mouseup", this.handleMouseUp);
    // window.addEventListener("mousemove", this.handleWindowMove);
    requestAnimationFrame(this.handleWindowMove);
  }

  onThrow(callback: (value: Events["throw"]) => void) {
    this.mitt.on("throw", callback);
  }
}

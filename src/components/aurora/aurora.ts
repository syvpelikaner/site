import vertexShaderSource from "./shaders/webgl2/vertex.glsl";
import fragmentShaderSource from "./shaders/webgl2/fragment.glsl";

function compileShader(
  gl: WebGLRenderingContext,
  source: string,
  type: GLenum
) {
  const shader = gl.createShader(type);
  if (shader === null) {
    throw new Error("Failed to create shader");
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const infoLog = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error("Failed to create shader: " + infoLog);
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.bindAttribLocation(program, 0, "aPosition");
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const infoLog = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error("Failed to link program: " + infoLog);
  }
  return program;
}

export function runAurora(canvas: HTMLCanvasElement) {
  const gl = canvas?.getContext("webgl2");

  if (gl === null) {
    throw new Error("WebGL not supported");
  }

  const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
  const fragmentShader = compileShader(
    gl,
    fragmentShaderSource,
    gl.FRAGMENT_SHADER
  );
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  const uTimeLoc = gl.getUniformLocation(program, "iTime");
  const uResLoc = gl.getUniformLocation(program, "iResolution");
  const uMouseLoc = gl.getUniformLocation(program, "iMouse");

  const quadVertices = new Float32Array([
    -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
  ]);
  const quadVBO = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadVBO);
  gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // Track mouse positions.
  const mousePos = [0, 512, 0, 0];
  // canvas.addEventListener("mousemove", (e) => {
  //   const rect = canvas.getBoundingClientRect();
  //   // WebGL's y=0 is at the bottom.
  //   mousePos[0] = e.clientX - rect.left;
  //   mousePos[1] = rect.height - (e.clientY - rect.top);

  //   console.log(`Mouse position: (${mousePos[0]}, ${mousePos[1]})`);
  // });
  // canvas.addEventListener("mousedown", (e) => {
  //   const rect = canvas.getBoundingClientRect();
  //   mousePos[2] = e.clientX - rect.left;
  //   mousePos[3] = rect.height - (e.clientY - rect.top);
  // });

  // Update canvas size and viewport.
  function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    if (gl === null) {
      return;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    mousePos[1] = canvas.height * 0.86;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // Animation loop.
  const startTime = performance.now();
  function render() {
    const currentTime = performance.now();
    const elapsedTime = (currentTime - startTime) / 1000;

    if (gl === null) {
      return;
    }

    // Update uniforms.
    gl.uniform1f(uTimeLoc, elapsedTime);
    gl.uniform3f(uResLoc, canvas.width, canvas.height, 0.0);
    gl.uniform4f(uMouseLoc, mousePos[0], mousePos[1], mousePos[2], mousePos[3]);

    // Draw the full-screen quad.
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    requestAnimationFrame(render);
  }
  render();
}

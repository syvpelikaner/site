precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;

varying vec2 v_texCoord;

void main() {
    vec2 uv = v_texCoord * 2.0 - 1.0;

    float curvature = 0.3;
    vec2 offset = uv * length(uv) * curvature;
    uv += offset;

    uv = uv * 0.5 + 0.5;

    if(uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        discard;
    }

    float chromaOffset = 0.003;
    float r = texture2D(u_texture, uv + vec2(chromaOffset, 0.0)).r;
    float g = texture2D(u_texture, uv).g;
    float b = texture2D(u_texture, uv - vec2(chromaOffset, 0.0)).b;
    vec3 color = vec3(r, g, b);

    float vignette = smoothstep(0.7, 0.5, length(uv - 0.5));
    color *= vignette;

    gl_FragColor = vec4(color, 1.0);
}
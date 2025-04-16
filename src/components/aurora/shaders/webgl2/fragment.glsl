#version 300 es
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform vec4 iMouse;

out vec4 fragColor;

mat2 mm2(in float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, s, -s, c);
}
mat2 m2 = mat2(0.95534f, 0.29552f, -0.29552f, 0.95534f);
float tri(in float x) {
    return clamp(abs(fract(x) - .5f), 0.01f, 0.49f);
}
vec2 tri2(in vec2 p) {
    return vec2(tri(p.x) + tri(p.y), tri(p.y + tri(p.x)));
}

float triNoise2d(in vec2 p, float spd) {
    float z = 1.8f;
    float z2 = 2.5f;
    float rz = 0.0f;
    p *= mm2(p.x * 0.06f);
    vec2 bp = p;
    for(float i = 0.0f; i < 5.0f; i++) {
        vec2 dg = tri2(bp * 1.85f) * 0.75f;
        dg *= mm2(iTime * spd);
        p -= dg / z2;
        bp *= 1.3f;
        z2 *= 0.45f;
        z *= 0.42f;
        p *= 1.21f + (rz - 1.0f) * 0.02f;
        rz += tri(p.x + tri(p.y)) * z;
        p *= -m2;
    }
    return clamp(1.0f / pow(rz * 29.0f, 1.3f), 0.0f, 0.55f);
}

float hash21(in vec2 n) {
    return fract(sin(dot(n, vec2(12.9898f, 4.1414f))) * 43758.5453f);
}

vec4 aurora(vec3 ro, vec3 rd) {
    vec4 col = vec4(0.0f);
    vec4 avgCol = vec4(0.0f);
    for(float i = 0.0f; i < 50.0f; i++) {
        float of = 0.006f * hash21(gl_FragCoord.xy) * smoothstep(0.0f, 15.0f, i);
        float pt = ((0.8f + pow(i, 1.4f) * 0.002f) - ro.y) / (rd.y * 2.0f + 0.4f);
        pt -= of;
        vec3 bpos = ro + pt * rd;
        vec2 p = bpos.zx;
        float rzt = triNoise2d(p, 0.09f);
        vec4 col2 = vec4(0.0f, 0.0f, 0.0f, rzt);
        col2.rgb = (sin(1.f - vec3(2.15f, -.5f, 1.2f) + i * 0.043f) * 0.5f + 0.5f) * rzt;
        avgCol = mix(avgCol, col2, 0.5f);
        col += avgCol * exp2(-i * 0.065f - 2.5f) * smoothstep(0.0f, 5.0f, i);
    }
    col *= clamp(rd.y * 15.0f + 0.4f, 0.0f, 1.0f);
    return col * 1.8f;
}

vec3 nmzHash33(vec3 q) {
    uvec3 p = uvec3(ivec3(q));
    p = p * uvec3(374761393u, 1103515245u, 668265263u) + p.zxy + p.yzx;
    p = p.yzx * (p.zxy ^ (p >> 3u));
    return vec3(p ^ (p >> 16u)) * (1.0f / vec3(4294967295.0f));
}

vec4 stars(in vec3 p) {
    vec3 c = vec3(0.0f);
    float res = iResolution.x * 1.0f;
    for(float i = 0.0f; i < 4.0f; i++) {
        vec3 q = fract(p * (0.15f * res)) - 0.5f;
        vec3 id = floor(p * (0.15f * res));
        vec2 rn = nmzHash33(id).xy;
        float c2 = 1.0f - smoothstep(0.2f, 0.3f, length(q));
        c2 *= step(rn.x, 0.0005f + i * i * 0.001f);
        c += c2 * (mix(vec3(1.0f, 0.49f, 0.1f), vec3(0.75f, 0.9f, 1.0f), rn.y) * 0.1f + 0.9f);
        p *= 1.3f;
    }

    vec3 color = c * c * 1.2f;
    float alpha = clamp(max(max(color.r, color.g), color.b), 0.0f, 1.0f);

    return vec4(color, alpha);
}

// vec4 stars(in vec3 p) {
//     vec3 c = vec3(0.0f);

//     // Use the x-y components as flat screen-space coordinates.
//     vec2 uv = p.xy;

//     // Adjust this value to control how many stars you get and their apparent size.
//     const float starDensity = 100.0f;

//     for(float i = 0.0f; i < 4.0f; i++) {
//         // Use the same density (fixed scale) for each layer to keep sizes uniform.
//         vec2 uvScaled = uv * starDensity;

//         // Create a grid cell coordinate, centered around 0
//         vec2 grid = fract(uvScaled) - 0.5f;
//         vec2 id = floor(uvScaled);

//         // Add the layer index to the hash input to get variation between layers.
//         vec2 rn = nmzHash33(vec3(id, i)).xy;

//         // Generate star shape (a soft-edged point)
//         float starShape = 1.0f - smoothstep(0.0f, 0.6f, length(grid));

//         // Control star appearance via a threshold that can vary per layer.
//         starShape *= step(rn.x, 0.0005f + i * i * 0.001f);

//         // Mix colors for some variation and add the star contribution.
//         c += starShape * (mix(vec3(1.0f, 0.49f, 0.1f), vec3(0.75f, 0.9f, 1.0f), rn.y) * 0.1f + 0.9f);
//     }

//     // Apply a brightness curve and set final alpha.
//     vec3 color = c * c * 1.2f;
//     float alpha = clamp(max(max(color.r, color.g), color.b), 0.0f, 1.0f);
//     return vec4(color, alpha);
// }

vec3 bg(in vec3 rd) {
    float sd = dot(normalize(vec3(-0.5f, -0.6f, 0.9f)), rd) * 0.5f + 0.5f;
    sd = pow(sd, 5.0f);
    vec3 col = mix(vec3(0.05f, 0.1f, 0.2f), vec3(0.1f, 0.05f, 0.2f), sd);
    return col * 0.63f;
}

void mainImage(out vec4 outColor, in vec2 fragCoord) {
    vec2 q = fragCoord / iResolution.xy;
    vec2 p = q - 0.5f;
    p.x *= iResolution.x / iResolution.y;

    vec3 ro = vec3(0.0f, 0.0f, -6.7f);
    vec3 rd = normalize(vec3(p, 1.3f));
    vec2 mo = iMouse.xy / iResolution.xy - 0.5f;
    mo = (mo == vec2(-0.5f)) ? vec2(-0.1f, 0.1f) : mo;
    mo.x *= iResolution.x / iResolution.y;
    rd.yz *= mm2(mo.y);
    // rd.xz *= mm2(mo.x + sin(iTime * 0.05f) * 0.2f);

    vec4 col = vec4(0.0f);
    vec3 brd = rd;
    float fade = smoothstep(0.0f, 0.01f, abs(brd.y)) * 0.1f + 0.9f;

    // col = bg(rd) * fade;

    // if(rd.y > 0.0f) {
    vec4 aur = smoothstep(0.0f, 1.5f, aurora(ro, rd)) * fade;
    vec4 starsCol = stars(rd);
    col += starsCol;
    col += aur;

    outColor = col;
    // col += stars(rd);
    // col = col * (1.0f - aur.a) + aur.rgb;
// } else {
        // rd.y = abs(rd.y);
        // col = bg(rd) * fade * 0.6f;
        // vec4 aur = smoothstep(0.0f, 2.5f, aurora(ro, rd));
        // col += stars(rd) * 0.1f;
        // col = col * (1.0f - aur.a) + aur.rgb;
        // vec3 pos = ro + ((0.5f - ro.y) / rd.y) * rd;
        // float nz2 = triNoise2d(pos.xz * vec2(0.5f, 0.7f), 0.0f);
        // col += mix(vec3(0.2f, 0.25f, 0.5f) * 0.08f, vec3(0.3f, 0.3f, 0.5f) * 0.7f, nz2 * 0.4f);
// }

    // outColor = vec4(col, 1.0f);
}

void main() {
    mainImage(fragColor, gl_FragCoord.xy);
}

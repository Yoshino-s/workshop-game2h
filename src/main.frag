precision mediump float;

uniform sampler2D u_Sampler[8];

varying vec2 v_TexCoord;
varying float v_TexIndex;

vec4 getSamplerTexture() {
  int t = int(v_TexIndex);
  for(int i = 0; i<8; i++) {
    if(i==t) {
       return texture2D(u_Sampler[i], v_TexCoord);
    }
  }
  return vec4(0.0);
}

void main() {
  gl_FragColor = getSamplerTexture();
}

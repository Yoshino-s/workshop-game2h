attribute vec4 a_Position;
attribute vec2 a_TexCoord;
attribute float a_TexIndex;

varying vec2 v_TexCoord;
varying float v_TexIndex;

void main() {
  gl_Position =  a_Position;
  v_TexCoord = a_TexCoord;
  v_TexIndex = a_TexIndex;
}

import vert from "./main.vert";
import frag from "./main.frag";
import DisplayObject from "./DisplayObject";

function loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if(!shader) {
    throw Error("Cannot create shader.");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    throw Error(`An error occurred compiling the shaders: ${ gl.getShaderInfoLog(shader)}`);
  }
  return shader;
}

function initShaderProgram(gl: WebGLRenderingContext, vert: string, frag: string): WebGLProgram {
  const shaderProgram = gl.createProgram();
  if(!shaderProgram) {
    throw new Error("Cannot create shaderProgram");
  }

  gl.attachShader(shaderProgram, loadShader(gl, gl.FRAGMENT_SHADER, frag));
  gl.attachShader(shaderProgram, loadShader(gl, gl.VERTEX_SHADER, vert));
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw Error(`Unable to initialize the shader program: ${ gl.getProgramInfoLog(shaderProgram)}`);
  }

  return shaderProgram;
}

export default class Renderer {
  private gl: WebGLRenderingContext;
  
  glProgram: WebGLProgram;
  attributes= {
    position: -1,
    texCoord: -1,
    texIndex: -1,
  };
  samplers: WebGLUniformLocation[] = [];
  root?: DisplayObject;
  constructor(gl: WebGLRenderingContext) {
    this.gl = gl;
    const program = this.glProgram = initShaderProgram(gl, vert, frag);
    gl.useProgram(this.glProgram);

    const attributes = this.attributes;

    attributes.position = gl.getAttribLocation(program, "a_Position");
    attributes.texCoord = gl.getAttribLocation(program, "a_TexCoord");
    attributes.texIndex = gl.getAttribLocation(program, "a_TexIndex");
    if (attributes.position < 0 || attributes.texCoord < 0 || attributes.texCoord < 0) {
      throw Error("Cannot find some attributes");
    }

    for (let i = 0; i < 8; i++) {
      const loc = gl.getUniformLocation(program, `u_Sampler[${i}]`);
      if (loc === null) {
        throw Error("Cannot find uniform");
      }
      this.samplers[i] = loc;
    }
  }
  setRoot(root: DisplayObject): void {
    this.root = root;
  }
  render(): void {
    if (!this.root) {
      throw Error("YOu should set root first.");
    }
    this._render(this.root);
  }
  private _render(root: DisplayObject): void {
    if (!root.hidden) {
      //Render
    }
    root.children.forEach(c => this._render(c));
  }
}
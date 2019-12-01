import vert from "./main.vert";
import frag from "./main.frag";
import DisplayObject from "./DisplayObject";
import { Rect, bindAttribute, setUniform, } from "./utils";
import Texture from "./Texture";
import WebGLConstants from "./WebGLConstants";

function loadShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if(!shader) {
    throw Error("Cannot create shader.");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const e = Error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    throw e;
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

/*interface IAttributeData {
  position: Tuple<number, 2>;
  texCoord: Tuple<number, 2>;
  texIndex: number;
}*/

export default class Renderer {
  private gl: WebGLRenderingContext;
  glProgram: WebGLProgram;
  elementBuffer: WebGLRenderbuffer;
  arrayBuffer: WebGLRenderbuffer;
  //attributesArray: IAttributeData[] = [];
  attributesArray: number[] = [];
  attributesArrayIndex = -1;
  texIndex = 0;
  textures = new Map<string, [Texture, number]>();
  index = 0;
  attributes= {
    position: -1,
    texCoord: -1,
    texIndex: -1,
  };
  samplers: WebGLUniformLocation[] = [];
  root?: DisplayObject;
  getRect: () => Rect;
  delta = 0;
  time = 0;
  constructor(gl: WebGLRenderingContext, getRect: () => Rect) {
    this.gl = gl;
    this.getRect = getRect;
    const program = this.glProgram = initShaderProgram(gl, vert, frag);
    gl.useProgram(this.glProgram);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

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

    const elementBuffer = gl.createBuffer();
    const arrayBuffer = gl.createBuffer();
    if (elementBuffer === null || arrayBuffer === null) {
      throw Error("Cannot create");
    }
    this.elementBuffer = elementBuffer;
    this.arrayBuffer = arrayBuffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.arrayBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
  }
  setRoot(root: DisplayObject): void {
    this.root = root;
  }
  render(time: number, delta: number): void {
    if (!this.root) {
      throw Error("YOu should set root first.");
    }
    this.time = time;
    this.delta = delta;
    this.gl.useProgram(this.glProgram);
    this.gl.clearColor(1.0, 1.0, 1.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this._addData(this.root);
    if (this.index !== 0) this._render();
  }
  private _render(): void {
    this.textures.forEach((v: [Texture, number]): void => {
      const _t = v[1];
      v[0].bindTexture(_t);
      setUniform(this.gl, WebGLConstants.TEXTURE, this.samplers[_t], [ _t, ]);
    });

    /*
    [...|(position[i].x, position[i].y), (tex[i].x, tex[i].y), (texIndex[i])|...]
    Float32Array
    size: buffer.BYTES_PER_ELEMENT
    position:
      stride: 5*size
      offset: 0
      length: 2
    texCoord:
      stride: 5*size
      offset: 2*size
      length: 2
    texIndex:
      stride: 5*size
      offset: 4*size
      length: 0
    */
    //const buffer = new Float32Array(this.attributesArray.reduce((p, d)=>p.concat(d.position, d.texCoord, d.texIndex), [] as number[]));
    const buffer = new Float32Array(this.attributesArray);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, buffer, this.gl.STATIC_DRAW);
    const fSize = buffer.BYTES_PER_ELEMENT;
    bindAttribute(this.gl, this.gl.FLOAT_VEC4, 2, this.attributes.position, 5, 0, fSize);
    bindAttribute(this.gl, this.gl.FLOAT_VEC2, 2, this.attributes.texCoord, 5, 2, fSize);
    bindAttribute(this.gl, this.gl.FLOAT, 1, this.attributes.texIndex, 5, 4, fSize);

    const length = this.index;
    const elementArray: number[] = [];
    let idx = -1;
    for (let i = -1; i < length * 6;) {
      elementArray[++i] = ++idx;
      elementArray[++i] = idx;
      elementArray[++i] = ++idx;
      elementArray[++i] = ++idx;
      elementArray[++i] = ++idx;
      elementArray[++i] = idx;
    }
    const elementBuffer = new Uint16Array(elementArray);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, elementBuffer, this.gl.STATIC_DRAW);

    this.gl.drawElements(WebGLConstants.TRIANGLE_STRIP, length * 6, WebGLConstants.UNSIGNED_SHORT, 0);
    //clear
    this.index = 0;
    this.attributesArrayIndex = -1;
    this.textures.clear();
    this.texIndex = 0;
  }

  private _addData(root: DisplayObject): void {
    if (!root.hidden) {
      const id = root.texture.id;
      let index = 0;
      const res = this.textures.get(id);
      if (!res) {
        index = this.texIndex++;
        this.textures.set(id, [ root.texture, index, ]);
      } else {
        index = res[1];
      }
      if (this.textures.size === 8) {
        this._render();
      }

      if(!root.static) root.updatePosition(this.time, this.delta);

      const rect = this.getRect();
      const width = rect.right - rect.left;
      const height = rect.bottom - rect.top;
      const x0 = root.left * 2 / width - 1, y0 = 1 - root.top * 2 / height;
      const x1 = root.right * 2 / width - 1, y1 = 1 - root.bottom * 2 / height;
    
      let tx0, tx1, ty0, ty1;
      if (root.texture.rect) {
        const tw = root.texture.width;
        const th = root.texture.height;
        const trect = root.texture.rect;
        tx0 = trect.left / tw; ty1 = 1 - trect.top / th;
        tx1 = trect.left / tw; ty0 = 1 - trect.top / th;
      } else {
        tx0 = 0.0;
        ty1 = 1.0;
        tx1 = 1.0;
        ty0 = 0.0;
      }
      /*this.attributesArray = this.attributesArray.concat([
        {
          position: [ x0, y0, ],
          texCoord: [ tx0, ty0, ],
          texIndex: index,
        }, {
          position: [ x0, y1, ],
          texCoord: [ tx0, ty1, ],
          texIndex: index,
        }, {
          position: [ x1, y0, ],
          texCoord: [ tx1, ty0, ],
          texIndex: index,
        }, {
          position: [ x1, y1, ],
          texCoord: [ tx1, ty1, ],
          texIndex: index,
        },
      ]);*/
      let idx = this.attributesArrayIndex;
      this.attributesArray[++idx] = x0;
      this.attributesArray[++idx] = y0;
      this.attributesArray[++idx] = tx0;
      this.attributesArray[++idx] = ty0;
      this.attributesArray[++idx] = index;
      
      this.attributesArray[++idx] = x0;
      this.attributesArray[++idx] = y1;
      this.attributesArray[++idx] = tx0;
      this.attributesArray[++idx] = ty1;
      this.attributesArray[++idx] = index;

      this.attributesArray[++idx] = x1;
      this.attributesArray[++idx] = y0;
      this.attributesArray[++idx] = tx1;
      this.attributesArray[++idx] = ty0;
      this.attributesArray[++idx] = index;

      this.attributesArray[++idx] = x1;
      this.attributesArray[++idx] = y1;
      this.attributesArray[++idx] = tx1;
      this.attributesArray[++idx] = ty1;
      this.attributesArray[++idx] = index;
      this.attributesArrayIndex = idx;

      this.index++;
    }
    if(!root.final) root.children.forEach(c => this._addData(c));
  }
}
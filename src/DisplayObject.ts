import WebGLConstants from "./WebGLConstants";

export default class DisplayObject {
  private texture: WebGLTexture;
  private img: HTMLImageElement;
  gl: WebGLRenderingContext;

  position = {
    x: 0, y: 0, z: 0,
  };
  center = {
    x: 0, y: 0,
  };
  width = 0;
  height = 0;
  absolute = false;
  hidden = false;
  children = new Set<DisplayObject>();
  parent?: DisplayObject;
  constructor(gl: WebGLRenderingContext, img: HTMLImageElement) {
    this.gl = gl;
    const texture = gl.createTexture();
    if (texture === null) {
      throw Error("Cannot create texture.");
    }
    this.texture = texture;
    this.img = img;
    this.width = img.width;
    this.height = img.height;
  }
  bindTexture(location: number, format?: number): void {
    const gl = this.gl;
    if(!format) format = gl.RGBA;
    gl.activeTexture(WebGLConstants.TEXTURE0 + location);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, this.img);
    gl.generateMipmap(gl.TEXTURE_2D);
  }

  addChildren(...children: DisplayObject[]): void {
    children.forEach(child => {
      this.children.add(child);
      child.parent = this;
    });
  }
  removeChildren(...children: DisplayObject[]): void {
    children.forEach((child) => {
      this.children.delete(child);
      child.parent = undefined;
    });
  }
  get x(): number {
    return this.position.x;
  }
  set x(x: number) {
    this.position.x = x;
  }
  get y(): number {
    return this.position.y;
  }
  set y(y: number) {
    this.position.y = y;
  }
  get z(): number {
    return this.position.z;
  }
  set z(z: number) {
    this.position.z = z;
  }
  get globalX(): number {
    return this.parent && !this.absolute ? this.parent.globalX + this.position.x : this.position.x;
  }
  set globalX(v: number) {
    if (this.parent && !this.absolute) {
      this.position.x = v - this.parent.globalX;
    }
    else {
      this.position.x = v;
    }
  }
  get globalY(): number {
    return this.parent && !this.absolute ? this.parent.globalY + this.position.y : this.position.y;
  }
  set globalY(v: number) {
    if (this.parent && !this.absolute) {
      this.position.y = v - this.parent.globalY;
    }
    else {
      this.position.y = v;
    }
  }
  //rect
  get left(): number {
    return -this.width * this.center.x + this.globalX;
  }
  get right(): number {
    return this.left + this.width;
  }
  get top(): number {
    return -this.height * this.center.y + this.globalY;
  }
  get bottom(): number {
    return this.top + this.height;
  }
}
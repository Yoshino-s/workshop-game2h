import { Rect, } from "./utils";
import WebGLConstants from "./WebGLConstants";

export default class Texture {
  id: string;
  private img: HTMLImageElement|"empty";
  rect?: Rect;
  private gl: WebGLRenderingContext;
  private texture: WebGLTexture;
  constructor(gl: WebGLRenderingContext, img: HTMLImageElement|"empty", rect?: Rect) {
    this.gl = gl;
    this.img = img;
    this.rect = rect;
    
    const texture = gl.createTexture();
    if (texture === null) {
      throw Error("Cannot create texture.");
    }
    this.texture = texture;
    this.id = img === "empty" ? img : img.src;
  }
  bindTexture(location: number, format?: number): void {
    if (this.img === "empty") return;
    const gl = this.gl;
    if (!format) format = gl.RGBA;
    gl.activeTexture(WebGLConstants.TEXTURE0 + location);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, format, format, gl.UNSIGNED_BYTE, this.img);
    gl.generateMipmap(gl.TEXTURE_2D);
  }
  get width(): number {
    if (this.img === "empty") return 0;
    return this.rect ? (this.rect.right - this.rect.left) : this.img.width;
  }
  get height(): number {
    if (this.img === "empty") return 0;
    return this.rect ? (this.rect.bottom - this.rect.top) : this.img.height;
  }
}
import Texture from "./Texture";

export default class DisplayObject {
  texture: Texture;
  position = {
    x: 0, y: 0, z: 0,
  };
  center = {
    x: 0, y: 0,
  };
  width = 0;
  height = 0;
  scale = 1;
  absolute = false;
  hidden = false;
  static = true;
  final = false;
  inViewsight: false | { width: number; height: number; destroy?: boolean} = false;
  private _velocity: {
    x: (t: number, d: number) => number;
    y: (t: number, d: number) => number;
  } = {
    x:()=> 0,
    y:()=> 0,
  }
  children = new Set<DisplayObject>();
  parent?: DisplayObject;
  constructor(texture: Texture) {
    this.texture = texture;
    this.width = texture.width;
    this.height = texture.height;
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
  updatePosition(time: number, delta: number): void {
    const pX = this._velocity.x(time, delta);
    const pY = this._velocity.y(time, delta);
    if (this.inViewsight) {
      if (this.left + pX > 0 && this.right + pX < this.inViewsight.width) {
        this.x += this._velocity.x(time, delta);
      } else {
        if (this.inViewsight.destroy) this.parent && this.parent.removeChildren(this);
      }
      if (this.top + pY > 0 && this.bottom + pY < this.inViewsight.height) {
        this.y += this._velocity.y(time, delta);
      } else {
        if (this.inViewsight.destroy) this.parent && this.parent.removeChildren(this);
      }
    } else {
      this.x += this._velocity.x(time, delta);
      this.y += this._velocity.y(time, delta);
    }
  }
  set velocityX(v: number | ((t: number, d: number) => number)) {
    if ("number" === typeof v) this._velocity.x = (t, d): number => d * v;
    else this._velocity.x = v;
  }
  set velocityY(v: number | ((t: number, d: number) => number)) {
    if ("number" === typeof v) this._velocity.y = (t, d): number => d * v;
    else this._velocity.y = v;
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
  get globalX(): number {
    return (this.parent && !this.absolute ? this.parent.globalX : 0) + this.position.x - this.width * this.scale * this.center.x;
  }
  get globalY(): number {
    return (this.parent && !this.absolute ? this.parent.globalY : 0) + this.position.y - this.height * this.scale * this.center.y;
  }
  //rect
  get left(): number {
    return this.globalX;
  }
  get right(): number {
    return this.left + this.width * this.scale;
  }
  get top(): number {
    return this.globalY;
  }
  get bottom(): number {
    return this.top + this.height * this.scale;
  }
  get centerPos(): {x: number; y: number} {
    return {
      x: this.left + this.width * this.scale / 2,
      y: this.top + this.height * this.scale / 2,
    };
  }
}
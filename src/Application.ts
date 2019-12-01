import { EventEmitter, } from "events";
import StrictEventEmitter from "strict-event-emitter-types";
import DisplayObject from "./DisplayObject";
import Renderer from "./Renderer";
import Texture from "./Texture";
import { Rect, } from "./utils";

interface ApplicationEvent {
  render: (deltaTime: number) => void;
}

type ApplicationEventEmitter = StrictEventEmitter<EventEmitter, ApplicationEvent>;

export default class Application extends (EventEmitter as { new(): ApplicationEventEmitter }) {
  gl: WebGLRenderingContext;
  renderer: Renderer;
  rafId = 0;
  canvas: HTMLCanvasElement;
  stage: DisplayObject;
  width: number;
  height: number;
  private lastTime = 0;
  constructor(canvas: HTMLCanvasElement) {
    super();
    this.canvas = canvas;
    this.width = canvas.width;
    this.height = canvas.height;
    const gl = canvas.getContext("webgl");
    if (!gl) {
      throw Error("Cannot get context");
    }
    this.gl = gl;
    this.renderer = new Renderer(gl, () => this.canvas.getBoundingClientRect());
    this.stage = new DisplayObject(new Texture(this.gl, "empty"));
    this.renderer.setRoot(this.stage);
  }
  render(time: number): void {
    this.renderer.render(time, time - this.lastTime);
    this.emit("render", time - this.lastTime);
    this.rafId = requestAnimationFrame(d => this.render(d));
    this.lastTime = time;
  } 
  start(): void {
    this.rafId = requestAnimationFrame(d => this.render(d));
  }
  stop(): void {
    cancelAnimationFrame(this.rafId);
  }
  get rect(): Rect {
    return this.canvas.getBoundingClientRect();
  }
  async Texture(src: string, rect?: Rect): Promise<Texture> {
    if(src === "empty") return new Texture(this.gl, "empty");
    const img = new Image();
    img.src = String(src);
    await new Promise((res, rej) => {
      img.onload = (): void => res();
      img.onerror = (): void => rej();
    });
    
    return new Texture(this.gl, img, rect);
  }
}
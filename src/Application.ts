import { EventEmitter, } from "events";
import StrictEventEmitter from "strict-event-emitter-types";
import DisplayObject from "./DisplayObject";
import Renderer from "./Renderer";

interface ApplicationEvent {
  render: (deltaTime: number) => void;
}

type ApplicationEventEmitter = StrictEventEmitter<EventEmitter, ApplicationEvent>;

export default class Application extends (EventEmitter as { new(): ApplicationEventEmitter }) {
  gl: WebGLRenderingContext;
  renderer: Renderer;
  rafId = 0;
  constructor(canvas: HTMLCanvasElement) {
    super();
    const gl = canvas.getContext("webgl");
    if (!gl) {
      throw Error("Cannot get context");
    }
    this.gl = gl;
    this.renderer = new Renderer(gl);
  }
  DisplayObject(img: HTMLImageElement): DisplayObject {
    return new DisplayObject(this.gl, img);
  }
  render(deltaTime: number): void {
    this.renderer.render();
    this.emit("render", deltaTime);
    this.rafId = requestAnimationFrame(d => this.render(d));
  } 
  start(): void {
    this.rafId = requestAnimationFrame(d => this.render(d));
  }
  stop(): void {
    cancelAnimationFrame(this.rafId);
  }
}
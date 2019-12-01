import DisplayObject from "./DisplayObject";
import Texture from "./Texture";

export function circle(texture: Texture, centerX: number, centerY: number, count: number, angleStart = 0, angleEnd = 2 * Math.PI, velocityX: (angle: number, time: number, delta: number) => number, velocityY: (angle: number, time: number, delta: number) => number, scale?: number): DisplayObject[] {
  const angleDelta = (angleEnd - angleStart) / count;
  const displayObjects: DisplayObject[] = [];
  for (let i = angleStart; i < angleEnd; i += angleDelta) {
    const obj = new DisplayObject(texture);
    obj.center.x = obj.center.y = 0.5;
    obj.x = centerX;
    obj.y = centerY;
    obj.scale = scale || 1;
    obj.static = false;
    obj.velocityX = (t, d): number => velocityX(i, t, d);
    obj.velocityY = (t, d): number => velocityY(i, t, d);
    displayObjects.push(obj);
  }
  return displayObjects;
}
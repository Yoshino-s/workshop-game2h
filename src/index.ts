import Application from "./Application";
import DisplayObject from "./DisplayObject";
import { circle, } from "./damuku";

const factor = {
  spriteVelocity: 0.15,
};

async function init(): Promise<void> {
  const canvas = document.getElementById("game") as HTMLCanvasElement;
  document.body.append(canvas);
  canvas.width = 400;
  canvas.height = 400;
  
  const app = (window as any).app = new Application(canvas);
  
  const ballT = await app.Texture((await import("../assets/ball.png")).default);

  let gameStatus: "stop" | "fail" | "start" = "stop";
  
  let startTime = 0;

  const hint = new DisplayObject(await app.Texture((await import("../assets/hint.png")).default));
  const die = new DisplayObject(await app.Texture((await import("../assets/die.png")).default));
  die.center.x = die.center.y = 0.5;
  die.scale = 2;
  die.x = 200;
  die.y = 200 - 64;
  hint.center.x = hint.center.y = 0.5;
  hint.x = 200;
  hint.y = 200 + 32;
  app.stage.addChildren(hint);
  
  const ballsContainer = new DisplayObject(await app.Texture("empty"));
  ballsContainer.hidden = false;
  const sprite = new DisplayObject(await app.Texture((await import("../assets/sprite.png")).default));
  sprite.x = 200;
  sprite.y = 350;
  sprite.scale = 0.15;
  sprite.static = false;
  sprite.inViewsight = { width: 400, height: 400, };

  let timer: NodeJS.Timeout;
  function switchStatus(status: "stop" | "fail" | "start"): void {
    app.stage.children.clear();
    clearInterval(timer);
    ballsContainer.children.clear();
    switch (status) {
      case "fail":
        app.stage.addChildren(die);
      // eslint-disable-next-line no-fallthrough
      case "stop":
        app.stage.addChildren(hint);
        break;  
      case "start":
        sprite.x = 200;
        sprite.y = 350;
        startTime = Date.now();
        timer = setInterval(() => {
          const balls = circle(
            ballT,
            200, 200,
            8,
            undefined, undefined,
            (a, d, t) => Math.cos(a + d / 5000) * t / 20,
            (a, d, t) => Math.sin(a + d / 5000) * t / 20,
            0.2
          );
          ballsContainer.addChildren(...balls);
          setTimeout(() => {
            balls.forEach(b => {
              const subBalls = circle(
                ballT,
                b.x, b.y,
                10,
                undefined, undefined,
                (a, d, t) => Math.cos(a + d / 5000) * t / 20,
                (a, d, t) => Math.sin(a + d / 5000) * t / 20,
                0.15
              );
              ballsContainer.addChildren(...subBalls);
              setTimeout(() => ballsContainer.removeChildren(...subBalls), 10000);
            });
            ballsContainer.removeChildren(...balls);
          }, 1000);
        }, 1500);
        app.stage.addChildren(ballsContainer, sprite);
    }
  }

  window.addEventListener("keydown", e => {
    if (e.repeat) return;
    const key = e.key;
    if (key === "ArrowLeft") sprite.velocityX = -factor.spriteVelocity;
    else if (key === "ArrowRight") sprite.velocityX = factor.spriteVelocity;
    else if (key === "ArrowUp") sprite.velocityY = -factor.spriteVelocity;
    else if (key === "ArrowDown") sprite.velocityY = factor.spriteVelocity;
  });
  window.addEventListener("keyup", e => {
    e.preventDefault();
    const key = e.key;
    if (key === "ArrowLeft") sprite.velocityX = 0;
    else if (key === "ArrowRight") sprite.velocityX = 0;
    else if (key === "ArrowUp") sprite.velocityY = 0;
    else if (key === "ArrowDown") sprite.velocityY = 0;
    else if (key === " " && gameStatus !== "start") {
      gameStatus = "start";
      switchStatus(gameStatus);
    }
  });
  

  app.on("render", () => {
    ballsContainer.children.forEach(o => {
      if (sprite.left < o.x && sprite.right > o.x && sprite.top < o.y && sprite.bottom > o.y) {
        gameStatus = "fail";
        switchStatus(gameStatus);
      }
    });
  });
  
  app.start();

  const fps = document.getElementById("fps") as HTMLDivElement;
  let now = Date.now();
  app.on("render", d => {
    fps.innerHTML = `Time: ${Math.round(((gameStatus === "start" && (now = Date.now()), now) - startTime) / 1000)}; FPS: ${(1000 / d).toFixed(2)}; Count: ${ballsContainer.children.size}`;
  });
}

init();
# Workshop: How to build a game in 2h  

大家好，我是Yoshino-s，就在~~本周~~下周末（12.1），我将带大家一起进行一场别开生面的活动。（划掉  

在这场Workshop中，我们将一起从最底层（手写着色器）开始，完成一个小游戏。所有内容将全部基于WebGL，也就是说，可以用任何浏览器（IE不是浏览器）快乐的玩耍。  

本次活动所用语言为[TypeScript](http://www.typescriptlang.org/)（JavaScript的超集)。所用IDE为[Visual Studio Code](https://code.visualstudio.com/)  

下面是一个简单的TypeScript小片段，大家尝试理解一下，就会发现：这真是太简单了  

```Typescript
const c = "233";
let i = 3;
let s = new Map<string, number>();
s.set(c, i);
function getNum(k: string): number {
  const result = s.get(k);
  asset(typeof result === "number");
  return result;
}
console.log(getNum(c));
```

这个repo之后会上传项目的基础配置。后续内容有更新也会在这里。

本次Workshop需要提前配置环境，请填写[问卷](https://www.wjx.cn/m/50200582.aspx)，并加一下我的微信（yoshino-s）。我将会手把手带你配置好环境。（也许  

本次活动仅面向华东师范大学开源社团与微软学生俱乐部成员。如果你对此感兴趣，欢迎随时加入我们（加我WX），即可参加本次活动。（会费只要25  
import { Graph } from "./Graph.js";

const canvas = document.getElementById("svg-canvas");

const graph = new Graph({
  canvas,
  xmin: -4,
  xmax: 4,
  ymin: -10,
  ymax: 20,
  x: 20,
  y: 20,
  width: 450,
  height: 350,
});

graph.drawGrid({ xmajor: 1, xminor: 0.2, ymajor: 5, yminor: 1 });
graph.drawAxes({ xlabel: "x", ylabel: "y" });

const xvals = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
const yvals = [16, 9, 4, 1, 0, 1, 4, 9, 16];
graph.plot({ xvals, yvals });

const xA = [],
  yA = [];
for (let i = 0; i <= 100; i++) {
  xA[i] = (i - 50) * 0.08;
  yA[i] = xA[i] * xA[i];
}
// graph.plot({ xvals: xA, yvals: yA, color: '#ff0000', dots: false, line: true });

const xA1 = new Array();
const yA1 = new Array();

for (var i = 0; i <= 100; i++) {
  //xA[i] = (i-50)*0.08;
  xA1[i] = (i - 50) * 0.06;
  //xA[i] = (i-50)*0.05;
  yA1[i] = f(xA1[i]);
  //y1A[i] = f(-xA[i]);
}

function f(x) {
  let y;
  y = Math.exp(-x * x);
  //y = Math.exp(x);
  //y = -0.5*Math.pow(x,5) + 3*Math.pow(x,3) + x*x - 2*x - 3;
  //y = x*x*x + x*x - 2*x - 3;
  //y = x*x - 2*x - 3;
  //y = 2*x + 1;
  return y;
}

graph.plot({
  xvals: xA1,
  yvals: yA1,
  color: "#ff0000",
  dots: false,
  line: true,
});

const graph2 = new Graph({
  canvas,
  xmin: -4,
  xmax: 4,
  ymin: -20,
  ymax: 20,
  x: 500,
  y: 20,
  width: 400,
  height: 350,
});

graph2.drawGrid({ xmajor: 1, xminor: 0.2, ymajor: 1, yminor: 0.5 });
graph2.drawAxes({ xlabel: "x", ylabel: "y" });

const data = graph2.generateData({
  start: -3,
  end: 3,
  points: 101,
  fn: f2,
});

graph2.plot({
  xvals: data.xvals,
  yvals: data.yvals,
  color: "#ff0000",
  dots: false,
  line: true,
});

function f1(x) {
  return Math.exp(-x * x);
}

function f2(x) {
  return -0.5 * Math.pow(x, 5) + 3 * Math.pow(x, 3) + x * x - 2 * x - 3;
}

function f10(x) {
  let y;
  y = Math.exp(-x * x);
  //y = Math.exp(x);
  //y = -0.5*Math.pow(x,5) + 3*Math.pow(x,3) + x*x - 2*x - 3;
  //y = x*x*x + x*x - 2*x - 3;
  //y = x*x - 2*x - 3;
  //y = 2*x + 1;
  return y;
}

const data3 = graph.generateData({
  start: 0,
  end: 1,
  points: 20,

  fn: t =>
    rationalQuadraticBezier(
      t,

      { x: -3, y: 1 },
      { x: 0, y: 20 },
      { x: 3, y: 0 },

      1,
      0.2,
      1
    ),
});

const data2 = graph.generateData({
  points: 5,

  fn: t =>
    quadraticBezier(
      t,
      { x: -3, y: -3 },
      { x: 0, y: 10 },
      { x: 3, y: -2 }
    ),
});

graph2.plot({
  xvals: data3.xvals,
  yvals: data3.yvals,
  color: "#00aaFF",
  line: true,
  dots: false,
});

function quadraticBezier(t, p0, p1, p2) {
  return {
    x:
      (1 - t) * (1 - t) * p0.x +
      2 * (1 - t) * t * p1.x +
      t * t * p2.x,

    y:
      (1 - t) * (1 - t) * p0.y +
      2 * (1 - t) * t * p1.y +
      t * t * p2.y,
  };
}

function rationalQuadraticBezier(t, p0, p1, p2, w0, w1, w2) {
  const b0 = (1 - t) * (1 - t);
  const b1 = 2 * (1 - t) * t;
  const b2 = t * t;

  const denominator =
    b0 * w0 +
    b1 * w1 +
    b2 * w2;

  return {
    x:
      (
        b0 * w0 * p0.x +
        b1 * w1 * p1.x +
        b2 * w2 * p2.x
      ) / denominator,

    y:
      (
        b0 * w0 * p0.y +
        b1 * w1 * p1.y +
        b2 * w2 * p2.y
      ) / denominator,
  };
}
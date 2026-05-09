import { Graph } from "./Graph.js";
import { generateData } from "./utils.js";

const svg = document.getElementById("svg-element");
svg.setAttribute("width", 1200);
svg.setAttribute("height", 1200);

const graph = new Graph({
  svg,
  xMin: -20,
  xMax: 20,
  yMin: -20,
  yMax: 20,
  x: 40,
  y: 40,
  width: 850,
  height: 850,
});

graph.drawGrid({ xMajor: 5, xMinor: 1, yMajor: 5, yMinor: 1 });
graph.drawAxes();

// const data = generateData({
//   start: -4.4,
//   end: 4.4,
//   points: 20,
//   fn: square
// });

// graph.plot({ xVals: data.xVals, yVals: data.yVals, color: "#39b491" });

// const data2 = generateData({
//   start: -20,
//   end: 20,
//   points: 50,
//   fn: sine
// });

// graph.plot({ xVals: data2.xVals, yVals: data2.yVals, color: "#3970b4", dots: false });

// const data3 = generateData({
//   start: -2.7,
//   end: 2.7,
//   points: 50,
//   fn: cubic
// });

// graph.plot({ xVals: data3.xVals, yVals: data3.yVals, color: "#6839b4", dots: false });

// const data4 = generateData({
//   start: -3.11,
//   end: 3.11,
//   points: 50,
//   fn: poly
// });

// graph.plot({ xVals: data4.xVals, yVals: data4.yVals, color: "#b439a2", dots: false });

// const data5 = generateData({
//   start: -20,
//   end: 20,
//   points: 50,
//   fn: cosine
// });

// graph.plot({ xVals: data5.xVals, yVals: data5.yVals, color: "#b43952", dots: false });

// const data6 = generateData({
//   start: -10,
//   end: 10,
//   points: 200,
//   fn: tangent
// });

// graph.plot({ xVals: data6.xVals, yVals: data6.yVals, color: "#b49b39", dots: false });

const data7 = generateData({
  start: -3,
  end: 3,
  points: 10,
  fn: exp
});

graph.plot({ xVals: data7.xVals, yVals: data7.yVals, color: "#249710", dots: false });

const data8 = generateData({
  start: 0,
  end: 20,
  points: 50,
  fn: sqrt
});

graph.plot({ xVals: data8.xVals, yVals: data8.yVals, color: "#1649b9", dots: false });

const data9 = generateData({
  start: 0,
  end: Math.PI * 2,
  points: 30,
  fn: circle
});

graph.plot({ xVals: data9.xVals, yVals: data9.yVals, color: "#b616b9", dots: false });


// Polynomials
function square(x) { return x * x; }
function cubic(x) { return x * x * x; }
function poly(x) { return x**4 - 8*x**2 + 3; }

// Trigonometry
function sine(x) { return Math.sin(x); }
function cosine(x) { return Math.cos(x); }
function tangent(x) { return Math.tan(x); }

// Exponential / logarithmic
function exp(x) { return Math.exp(x); }
function log(x) { return Math.log(x); }  // undefined for x <= 0

// Absolute value
function abs(x) { return Math.abs(x); }

// Square root
function sqrt(x) { return Math.sqrt(x); }  // undefined for x < 0

// Interesting shapes
function wave(x) { return Math.sin(x) * x; }         // dampened wave
function zigzag(x) { return Math.abs(x % 4 - 2) - 1; }

function circle(x) {
  return {
    x: Math.cos(x) * 10,
    y: Math.sin(x) * 10
  }
}

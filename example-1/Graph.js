import { createSvgEl } from "./utils.js";

export class Graph {
  constructor({ svg, xMin, xMax, yMin, yMax, x, y, width, height }) {
    const required = { svg, xMin, xMax, yMin, yMax, x, y, width, height };

    for (const [key, value] of Object.entries(required)) {
      if (value === undefined) throw new Error(`Graph: "${key}" is required`);
    }

    Object.assign(this, required);

    this._xPixelsPerUnit = this.width / (this.xMax - this.xMin);
    this._yPixelsPerUnit = this.height / (this.yMax - this.yMin);

    // pixel position of data origin (0,0)
    this._x0 = this.x + -this.xMin * this._xPixelsPerUnit;
    this._y0 = this.y + this.height - -this.yMin * this._yPixelsPerUnit;

    this.group = createSvgEl("g", { class: "graph" });
    this.svg.appendChild(this.group);
  }

  drawGrid(options = {}) {
    const { xMajor = 1, xMinor = 0, yMajor = 1, yMinor = 0 } = options;
    const minorColor = "#ededed";
    const majorColor = "#c5c5c5";
    const minorLineWidth = 1;
    const majorLineWidth = 1;

    const group = createSvgEl("g", { class: "grid" });

    this._drawGridLines(group, "x", xMinor, minorColor, minorLineWidth);
    this._drawGridLines(group, "y", yMinor, minorColor, minorLineWidth);
    this._drawGridLines(group, "x", xMajor, majorColor, majorLineWidth);
    this._drawGridLines(group, "y", yMajor, majorColor, majorLineWidth);

    this._drawGridLabels(group, xMajor, yMajor);

    this.group.appendChild(group);
  }

  drawAxes(options = {}) {
    const { xLabel = "x", yLabel = "y" } = options;
    const group = createSvgEl("g", { class: "axes" });
    const strokeColor = "#000000";

    // x axis
    group.appendChild(
      createSvgEl("line", {
        x1: this._toPixelX(0),
        y1: this._toPixelY(this.yMin),
        x2: this._toPixelX(0),
        y2: this._toPixelY(this.yMax),
        stroke: strokeColor,
        "stroke-width": 2,
      }),
    );

    // y axis
    group.appendChild(
      createSvgEl("line", {
        x1: this._toPixelX(this.xMin),
        y1: this._toPixelY(0),
        x2: this._toPixelX(this.xMax),
        y2: this._toPixelY(0),
        stroke: strokeColor,
        "stroke-width": 2,
      }),
    );

    // x label
    group.appendChild(
      createSvgEl(
        "text",
        {
          x: this._toPixelX(this.xMax) + 3,
          y: this._toPixelY(0),
          "font-size": 30,
          "dominant-baseline": "middle",
        },
        xLabel,
      ),
    );

    // y label
    group.appendChild(
      createSvgEl(
        "text",
        {
          x: this._toPixelX(0),
          y: this._toPixelY(this.yMax) - 3,
          "font-size": 30,
          "text-anchor": "middle",
        },
        yLabel,
      ),
    );

    this.group.appendChild(group);
  }

  plot(options = {}) {
    const {
      xVals = [],
      yVals = [],
      color = "#5B8FF9",
      dots = true,
      line = true,
    } = options;

    const group = createSvgEl("g", { class: "plot" });

    if (line) {
      const points = xVals
        .map((x, i) => `${this._toPixelX(x)},${this._toPixelY(yVals[i])}`)
        .join(" ");

      group.appendChild(
        createSvgEl("polyline", {
          points,
          stroke: color,
          "stroke-width": 2,
          fill: "none",
        }),
      );
    }

    if (dots) {
      xVals.forEach((x, i) => {
        group.appendChild(
          createSvgEl("circle", {
            cx: this._toPixelX(x),
            cy: this._toPixelY(yVals[i]),
            r: 4,
            fill: color,
          }),
        );
      });
    }

    this.group.appendChild(group);
  }

  _drawGridLines(parent, axis, step, color, lineWidth) {
    const isX = axis === "x";
    const min = isX ? this.xMin : this.yMin;
    const max = isX ? this.xMax : this.yMax;
    const start = Math.ceil(min / step) * step;

    for (let v = start; v <= max + 1e-9; v += step) {
      parent.appendChild(
        createSvgEl("line", {
          x1: isX ? this._toPixelX(v) : this._toPixelX(this.xMin),
          y1: isX ? this._toPixelY(this.yMin) : this._toPixelY(v),
          x2: isX ? this._toPixelX(v) : this._toPixelX(this.xMax),
          y2: isX ? this._toPixelY(this.yMax) : this._toPixelY(v),
          stroke: color,
          "stroke-width": lineWidth,
        }),
      );
    }
  }

  _drawGridLabels(parent, xMajor, yMajor) {
    // draw x labels
    const xStart = Math.ceil(this.xMin / xMajor) * xMajor;

    for (let v = xStart; v <= this.xMax + 1e-9; v += xMajor) {
      parent.appendChild(
        createSvgEl(
          "text",
          {
            x: this._toPixelX(v),
            y: this._toPixelY(this.yMin) + 20,
            "font-size": 22,
            "text-anchor": "middle",
          },
          v,
        ),
      );
    }

    // draw y labels
    const yStart = Math.ceil(this.yMin / yMajor) * yMajor;

    for (let v = yStart; v <= this.yMax + 1e-9; v += yMajor) {
      parent.appendChild(
        createSvgEl(
          "text",
          {
            x: this._toPixelX(this.xMin) - 5,
            y: this._toPixelY(v),
            "font-size": 22,
            "dominant-baseline": "middle",
            "text-anchor": "end",
          },
          v,
        ),
      );
    }
  }

  _toPixelX(x) {
    return Math.round(this._x0 + x * this._xPixelsPerUnit);
  }
  _toPixelY(y) {
    return Math.round(this._y0 - y * this._yPixelsPerUnit);
  }
}

export class Graph {
  constructor(options = {}) {
    Object.assign(this, {
      xmin: -10,
      xmax: 10,
      ymin: -10,
      ymax: 10,
      x: 0,
      y: 0,
      width: 300,
      height: 300,
      ...options,
    });

    // scaling: how many pixels per data unit
    this._xScale = this.width / (this.xmax - this.xmin);
    this._yScale = this.height / (this.ymax - this.ymin);

    // pixel position of data origin (0,0)
    this._x0 = this.x + -this.xmin * this._xScale;
    this._y0 = this.y + this.height - -this.ymin * this._yScale;

    // pixel boundaries
    this._xMinPx = this.x;
    this._xMaxPx = this.x + this.width;
    this._yMinPx = this.y;
    this._yMaxPx = this.y + this.height;

    this._drawCalls = [];
    this.group = this._createEl("g", { class: "graph" });
    this.canvas.appendChild(this.group);
  }

  // data → pixel
  _tx(x) {
    return (
      this._x0 +
      (x / (this._xScale > 0 ? 1 / this._xScale : 1)) *
        (this._xScale > 0 ? 1 : 1)
    );
  }
  _ty(y) {
    return (
      this._y0 -
      (y / (this._yScale > 0 ? 1 / this._yScale : 1)) *
        (this._yScale > 0 ? 1 : 1)
    );
  }

  _tx(x) {
    return this._x0 + x * this._xScale;
  }
  _ty(y) {
    return this._y0 - y * this._yScale;
  }

  _record(method, args) {
    const i = this._drawCalls.findIndex((c) => c.method === method);
    if (i !== -1) this._drawCalls[i] = { method, args };
    else this._drawCalls.push({ method, args });
  }

  update(options = {}) {
    Object.assign(this, options);

    // recalculate scaling
    this._xScale = this.width / (this.xmax - this.xmin);
    this._yScale = this.height / (this.ymax - this.ymin);
    this._x0 = this.x + -this.xmin * this._xScale;
    this._y0 = this.y + this.height - -this.ymin * this._yScale;

    this.group.innerHTML = "";
    for (const { method, args } of this._drawCalls) {
      this[method](...args);
    }
  }

  _createEl(tag, attrs = {}) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    return el;
  }

  _setText(el, text) {
    el.textContent = text;
    return el;
  }

  // ── DRAW GRID ──────────────────────────────────────────────────────────
  drawGrid(options = {}) {
    this._record("drawGrid", [options]);

    const { xmajor = 1, xminor = 0.5, ymajor = 1, yminor = 0.5 } = options;

    const group = this._createEl("g", { class: "grid" });

    // minor lines first (painted under major)
    this._drawGridLines(group, "x", xminor, "#cccccc", 1);
    this._drawGridLines(group, "y", yminor, "#cccccc", 1);
    this._drawGridLines(group, "x", xmajor, "#999999", 1);
    this._drawGridLines(group, "y", ymajor, "#999999", 1);

    // value labels on major lines
    this._drawGridLabels(group, xmajor, ymajor);

    this.group.appendChild(group);
  }

  _drawGridLines(parent, axis, step, color, lineWidth) {
    const isX = axis === "x";
    const min = isX ? this.xmin : this.ymin;
    const max = isX ? this.xmax : this.ymax;
    const start = Math.ceil(min / step) * step;

    for (let v = start; v <= max + 1e-9; v += step) {
      parent.appendChild(
        this._createEl("line", {
          x1: isX ? this._tx(v) : this._tx(this.xmin),
          y1: isX ? this._ty(this.ymin) : this._ty(v),
          x2: isX ? this._tx(v) : this._tx(this.xmax),
          y2: isX ? this._ty(this.ymax) : this._ty(v),
          stroke: color,
          "stroke-width": lineWidth,
        }),
      );
    }
  }

  _drawGridLabels(parent, xmajor, ymajor) {
    // y axis labels (right of y axis)
    for (
      let y = Math.ceil(this.ymin / ymajor) * ymajor;
      y <= this.ymax + 1e-9;
      y += ymajor
    ) {
      parent.appendChild(
        this._setText(
          this._createEl("text", {
            x: this._tx(this.xmin) - 5,
            y: this._ty(y) + 4,
            "font-size": 10,
            "font-family": "Arial",
            "text-anchor": "end",
            fill: "#000000",
          }),
          +y.toFixed(10),
        ),
      );
    }

    // x axis labels (below x axis)
    for (
      let x = Math.ceil(this.xmin / xmajor) * xmajor;
      x <= this.xmax + 1e-9;
      x += xmajor
    ) {
      parent.appendChild(
        this._setText(
          this._createEl("text", {
            x: this._tx(x),
            y: this._ty(this.ymin) + 14,
            "font-size": 10,
            "font-family": "Arial",
            "text-anchor": "left",
            fill: "#000000",
          }),
          +x.toFixed(10),
        ),
      );
    }
  }

  // ── DRAW AXES ─────────────────────────────────────────────────────────
  drawAxes(options = {}) {
    this._record("drawAxes", [options]);

    const { xlabel = "x", ylabel = "y" } = options;

    const group = this._createEl("g", { class: "axes" });

    // x axis
    group.appendChild(
      this._createEl("line", {
        x1: this._tx(this.xmin),
        y1: this._ty(0),
        x2: this._tx(this.xmax),
        y2: this._ty(0),
        stroke: "#000000",
        "stroke-width": 2,
      }),
    );

    // y axis
    group.appendChild(
      this._createEl("line", {
        x1: this._tx(0),
        y1: this._ty(this.ymin),
        x2: this._tx(0),
        y2: this._ty(this.ymax),
        stroke: "#000000",
        "stroke-width": 2,
      }),
    );

    // x label
    group.appendChild(
      this._setText(
        this._createEl("text", {
          x: this._tx(this.xmax) + 10,
          y: this._ty(0) + 4,
          "font-size": 12,
          "font-family": "Arial",
          fill: "#000000",
        }),
        xlabel,
      ),
    );

    // y label
    group.appendChild(
      this._setText(
        this._createEl("text", {
          x: this._tx(0) - 3,
          y: this._ty(this.ymax) - 10,
          "font-size": 12,
          "font-family": "Arial",
          fill: "#000000",
        }),
        ylabel,
      ),
    );

    this.group.appendChild(group);
  }

  // ── PLOT DATA ─────────────────────────────────────────────────────────
  plot(options = {}) {
    this._record("plot", [options]);

    const {
      xvals = [],
      yvals = [],
      color = "#5B8FF9",
      dots = true,
      line = true,
    } = options;

    const group = this._createEl("g", { class: "plot" });

    // line / polyline
    if (line) {
      const points = xvals
        .map((x, i) => `${this._tx(x)},${this._ty(yvals[i])}`)
        .join(" ");
      group.appendChild(
        this._createEl("polyline", {
          points,
          stroke: color,
          "stroke-width": 2,
          fill: "none",
        }),
      );
    }

    // dots
    if (dots) {
      xvals.forEach((x, i) => {
        group.appendChild(
          this._createEl("circle", {
            cx: this._tx(x),
            cy: this._ty(yvals[i]),
            r: 4,
            fill: color,
            stroke: color,
          }),
        );
      });
    }

    this.group.appendChild(group);
  }

  generateData({ start = 0, end = 1, points = 100, fn }) {
    const step = (end - start) / (points - 1);

    const xvals = [];
    const yvals = [];

    for (let i = 0; i < points; i++) {
      const t = start + i * step;

      const result = fn(t);

      if (typeof result === "number") {
        xvals.push(t);
        yvals.push(result);
      } else {
        xvals.push(result.x);
        yvals.push(result.y);
      }
    }

    return { xvals, yvals };
  }
}

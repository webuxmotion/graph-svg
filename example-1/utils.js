export function createSvgEl(tag, attrs = {}, text = null) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  if (text !== null) el.textContent = text;
  return el;
}

export function generateData({ start = 0, end = 1, points = 100, fn }) {
  const step = (end - start) / (points - 1);

  const xVals = [];
  const yVals = [];

  for (let i = 0; i < points; i++) {
    const t = start + i * step;

    const result = fn(t);

    if (typeof result === "number") {
      xVals.push(t);
      yVals.push(result);
    } else {
      xVals.push(result.x);
      yVals.push(result.y);
    }
  }

  return { xVals, yVals };
}

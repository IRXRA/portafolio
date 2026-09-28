import { networkGeometry, stages } from './config.js';

// Dibujo original del río y la red. Tiempo en milisegundos; medidas en píxeles CSS.
const TAU = Math.PI * 2;
function bez(a, b, c, d, t) {
  let u = 1 - t;
  return {
    x: u * u * u * a.x + 3 * u * u * t * b.x + 3 * u * t * t * c.x + t * t * t * d.x,
    y: u * u * u * a.y + 3 * u * u * t * b.y + 3 * u * t * t * c.y + t * t * t * d.y
  };
}
function pathPoints(w, h, heroMode) {
  return heroMode ? [
    {
      x: w * .42,
      y: -30
    },
    {
      x: w * .02,
      y: h * .4
    },
    {
      x: w * .96,
      y: h * .53
    },
    {
      x: w * .53,
      y: h + 35
    }
  ] : [
    {
      x: w * .13,
      y: h * .88
    },
    {
      x: w * .4,
      y: h * .84
    },
    {
      x: w * .24,
      y: h * .2
    },
    {
      x: w * .53,
      y: h * .43
    }
  ];
}
export function drawRiver(ctx, w, h, time, heroMode) {
  const P = pathPoints(w, h, heroMode), width = heroMode ? Math.min(112, w * .27) : Math.min(72, w * .13);
  const N = 110;
  const at = (t) => bez(...P, t);
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  function line(offset) {
    ctx.beginPath();
    for (let i = 0; i <= N; i++) {
      let t = i / N, p = at(t), q = at(Math.min(1, t + .001)), r = at(Math.max(0, t - .001)), dx = q.x - r.x, dy = q.y - r.y, l = Math.hypot(dx, dy) || 1;
      p.x += -dy / l * offset;
      p.y += dx / l * offset;
      i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
    }
  }
  line(0);
  ctx.strokeStyle = heroMode ? "rgba(86,153,147,.11)" : "rgba(130,207,198,.16)";
  ctx.lineWidth = width + 34;
  ctx.stroke();
  const grad = ctx.createLinearGradient(0, 0, w, h);
  if (heroMode) {
    grad.addColorStop(0, "#a9e1d2");
    grad.addColorStop(.48, "#56b7b5");
    grad.addColorStop(1, "#237f91");
  } else {
    grad.addColorStop(0, "#8cdbcf");
    grad.addColorStop(.5, "#3cb4b5");
    grad.addColorStop(1, "#1c8393");
  }
  line(0);
  ctx.strokeStyle = grad;
  ctx.lineWidth = width;
  ctx.shadowBlur = heroMode ? 22 : 15;
  ctx.shadowColor = "rgba(20,83,87,.13)";
  ctx.stroke();
  ctx.shadowBlur = 0;
  line(width * .37);
  ctx.strokeStyle = "rgba(13,79,95,.14)";
  ctx.lineWidth = width * .13;
  ctx.stroke();
  for (let k = 0; k < 7; k++) {
    ctx.beginPath();
    for (let i = 0; i <= 90; i++) {
      let t = i / 90, p = at(t), q = at(Math.min(1, t + .002)), r = at(Math.max(0, t - .002)), dx = q.x - r.x, dy = q.y - r.y, l = Math.hypot(dx, dy) || 1;
      let offset = width * (-.34 + k * .115) + Math.sin(t * 23 + time * .00155 + k * 1.9) * width * .035;
      p.x += -dy / l * offset;
      p.y += dx / l * offset;
      i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y);
    }
    ctx.strokeStyle = "rgba(250,255,252," + (heroMode ? .13 : .17) + ")";
    ctx.lineWidth = k % 3 === 0 ? 2 : 1;
    ctx.stroke();
  }
  for (let j = 0; j < (heroMode ? 100 : 72); j++) {
    let t = (j * .61803398875 + time * (34e-5 + j % 5 * 21e-6)) % 1, p = at(t), q = at(Math.min(1, t + .002)), r = at(Math.max(0, t - .002)), dx = q.x - r.x, dy = q.y - r.y, l = Math.hypot(dx, dy) || 1;
    let lane = Math.sin(j * 2.3) * width * .34, pX = p.x - dy / l * lane, pY = p.y + dx / l * lane, len = 5 + j % 6 * 4;
    ctx.beginPath();
    ctx.moveTo(pX, pY);
    ctx.lineTo(pX + dx / l * len, pY + dy / l * len);
    ctx.strokeStyle = "rgba(250,255,252," + (.13 + j % 4 * .045) + ")";
    ctx.lineWidth = j % 5 === 0 ? 2 : 1;
    ctx.stroke();
  }
  for (let j = 0; j < (heroMode ? 18 : 12); j++) {
    let t = (j / (heroMode ? 18 : 12) + time * 11e-5) % 1, p = at(t), q = at(Math.min(1, t + .003)), r = at(Math.max(0, t - .003)), dx = q.x - r.x, dy = q.y - r.y, l = Math.hypot(dx, dy) || 1;
    let lane = Math.sin(j * 1.73) * width * .25, px = p.x - dy / l * lane, py = p.y + dx / l * lane, len = heroMode ? 18 + j % 4 * 6 : 12 + j % 3 * 5;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px + dx / l * len, py + dy / l * len);
    ctx.strokeStyle = "rgba(255,255,255,.25)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  ctx.restore();
}
export function drawNetwork(ctx, w, h, time, activeStage = 0) {
  ctx.clearRect(0, 0, w, h);
  const scale = Math.min(w / networkGeometry.width, h / networkGeometry.height);
  const ox = (w - networkGeometry.width * scale) / 2;
  const oy = (h - networkGeometry.height * scale) / 2;
  ctx.save();
  ctx.translate(ox, oy);
  ctx.scale(scale, scale);
  const t = time * .001;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const nodes = networkGeometry.nodes;
  ctx.beginPath();
  ctx.moveTo(35, 382);
  ctx.bezierCurveTo(115, 380, 135, 302, 230, 275);
  ctx.bezierCurveTo(315, 250, 316, 240, 355, 218);
  ctx.bezierCurveTo(413, 180, 420, 172, 445, 154);
  ctx.bezierCurveTo(471, 125, 484, 105, 520, 60);
  ctx.strokeStyle = "#467c7c";
  ctx.lineWidth = 49;
  ctx.stroke();
  const gr = ctx.createLinearGradient(50, 360, 500, 80);
  gr.addColorStop(0, "#62c4bf");
  gr.addColorStop(.5, "#2ba8b2");
  gr.addColorStop(1, "#167d94");
  ctx.strokeStyle = gr;
  ctx.lineWidth = 34;
  ctx.stroke();
  ctx.setLineDash([8, 19]);
  ctx.lineDashOffset = -time * .1;
  ctx.strokeStyle = "rgba(237,255,249,.66)";
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.setLineDash([]);
  nodes.forEach(([nx, ny], i) => {
    let on = i === activeStage;
    ctx.beginPath();
    ctx.arc(nx, ny, on ? 33 : 24, 0, TAU);
    ctx.fillStyle = on ? "#effbf5" : "#badad4";
    ctx.fill();
    ctx.lineWidth = on ? 4 : 2;
    ctx.strokeStyle = on ? "#a4eee0" : "#7eada5";
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(nx, ny, 8, 0, TAU);
    ctx.fillStyle = on ? "#257f85" : "#548c8a";
    ctx.fill();
    if (on) {
      ctx.beginPath();
      ctx.arc(nx, ny, 41 + Math.sin(t * 3) * 4, 0, TAU);
      ctx.strokeStyle = "rgba(185,245,226,.5)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  });
  ctx.strokeStyle = "#b7dfd4";
  ctx.fillStyle = "#d9f0e8";
  ctx.lineWidth = 3;
  let [nx, ny] = nodes[activeStage];
  if (activeStage === 1) {
    ctx.save();
    ctx.translate(nx, ny - 46);
    ctx.rotate(Math.sin(t * 1.7) * .22);
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-16, 0);
    ctx.lineTo(16, 0);
    ctx.moveTo(0, -16);
    ctx.lineTo(0, 16);
    ctx.stroke();
    ctx.restore();
  }
  if (activeStage === 2) {
    ctx.save();
    ctx.translate(nx, ny - 50);
    ctx.rotate(t * 3.6);
    for (let k = 0; k < 4; k++) {
      ctx.rotate(TAU / 4);
      ctx.beginPath();
      ctx.ellipse(11, 0, 12, 5, 0, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }
  if (activeStage === 3) {
    for (let k = 1; k <= 3; k++) {
      ctx.beginPath();
      ctx.arc(nx, ny, k * 15 + Math.sin(t * 2) * 2, -2.5, -.6);
      ctx.strokeStyle = "rgba(189,245,224," + (1 - k * .24) + ")";
      ctx.stroke();
    }
  }
  ctx.font = "600 12px system-ui";
  ctx.textAlign = "center";
  ctx.fillStyle = "#d9f0e8";
  stages.map(stage => stage.title.toLocaleUpperCase('es')).forEach((s, i) => {
    let [px, py] = nodes[i];
    ctx.fillText(s, Math.max(65, Math.min(490, px)), py + (i === 4 ? 48 : 55));
  });
  ctx.restore();
}

export {};

const canvas = document.querySelector<HTMLCanvasElement>("#rover-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>("#rover-readout")!;
const commandListEl = document.querySelector<HTMLOListElement>(
  "#rover-pending",
)!;
const queueStatusEl = document.querySelector<HTMLParagraphElement>(
  "#rover-queue-status",
)!;
const runButton = document.querySelector<HTMLButtonElement>("#rover-run")!;
const clearButton = document.querySelector<HTMLButtonElement>("#rover-clear")!;

let x = 2;
let y = 2;
let directionIndex = 0;
const commandQueue: Command[] = [];

type Command = "FORWARD" | "RIGHT";

interface DirectionRecord {
  name: string;
  dx: number;
  dy: number;
}

const directions: DirectionRecord[] = [
  { name: "North", dx: 0, dy: -1 },
  { name: "East", dx: 1, dy: 0 },
  { name: "South", dx: 0, dy: 1 },
  { name: "West", dx: -1, dy: 0 },
];

function drawRover() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#718881";
  for (let row = 0; row < 5; row++) {
    for (let column = 0; column < 5; column++) {
      ctx.strokeRect(10 + column * 56, 10 + row * 56, 56, 56);
    }
  }
  ctx.save();
  ctx.translate(38 + x * 56, 38 + y * 56);
  ctx.rotate(directionIndex * Math.PI / 2);
  ctx.fillStyle = "#27766b";
  ctx.beginPath();
  ctx.moveTo(0, -20);
  ctx.lineTo(17, 16);
  ctx.lineTo(-17, 16);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  readout.textContent = `Position: (${x}, ${y}) · Facing: ${
    directions[directionIndex].name
  }`;
}

function updateCommandList() {
  commandListEl.innerHTML = "";
  commandQueue.forEach((cmd) => {
    const li = document.createElement("li");
    li.textContent = cmd === "FORWARD" ? "Forward" : "Right";
    commandListEl.appendChild(li);
  });

  if (commandQueue.length === 0) {
    queueStatusEl.textContent = "Empty · queue ready";
    runButton.disabled = true;
    clearButton.disabled = true;
  } else {
    queueStatusEl.textContent = `${commandQueue.length} pending command(s)`;
    runButton.disabled = false;
    clearButton.disabled = false;
  }
}

function executeCommand(command: Command) {
  if (command === "FORWARD") {
    const currentDir = directions[directionIndex];
    x = Math.max(0, Math.min(4, x + currentDir.dx));
    y = Math.max(0, Math.min(4, y + currentDir.dy));
  } else if (command === "RIGHT") {
    directionIndex = (directionIndex + 1) % directions.length;
  }
}

document.querySelector<HTMLButtonElement>("#rover-forward")!.onclick = () => {
  commandQueue.push("FORWARD");
  updateCommandList();
};
document.querySelector<HTMLButtonElement>("#rover-right")!.onclick = () => {
  commandQueue.push("RIGHT");
  updateCommandList();
};

runButton.onclick = () => {
  while (commandQueue.length > 0) {
    const cmd = commandQueue.shift()!;
    executeCommand(cmd);
  }
  updateCommandList();
  drawRover();
};

clearButton.onclick = () => {
  commandQueue.length = 0;
  updateCommandList();
};

document.querySelector<HTMLButtonElement>("#rover-reset")!.onclick = () => {
  x = 2;
  y = 2;
  directionIndex = 0;
  commandQueue.length = 0;
  updateCommandList();
  drawRover();
};

updateCommandList();
drawRover();

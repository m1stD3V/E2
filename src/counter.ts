export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
const CAPACITY = 10;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

export interface ShieldSnapshot {
  charge: number;
  capacity: number;
  missing: number;
}

const shieldEventTarget = new EventTarget();

function createShieldSnapshot(currentCharge: number): ShieldSnapshot {
  return {
    charge: currentCharge,
    capacity: CAPACITY,
    missing: CAPACITY - currentCharge,
  };
}

function renderMeter(snapshot: ShieldSnapshot) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < snapshot.capacity; i++) {
    ctx.fillStyle = i < snapshot.charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${snapshot.charge} / ${snapshot.capacity} shield`, 12, 100);
  readout.textContent =
    `Shield charge: ${snapshot.charge} / ${snapshot.capacity}`;
}

const inspectorListener = ((event: CustomEvent<ShieldSnapshot>) => {
  if (!panel) return;
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  panel.textContent =
    `Shield charge: ${event.detail.charge} · Missing charge: ${event.detail.missing}`;
}) as EventListener;

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(CAPACITY, next));
  if (bounded === count) return;
  count = bounded;
  const snapshot = createShieldSnapshot(count);

  const event = new CustomEvent<ShieldSnapshot>("shieldchange", {
    detail: snapshot,
  });
  shieldEventTarget.dispatchEvent(event);
}

shieldEventTarget.addEventListener(
  "shieldchange",
  ((event: CustomEvent<ShieldSnapshot>) => {
    renderMeter(event.detail);
  }) as EventListener,
);

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  const snapshot = createShieldSnapshot(count);
  panel.textContent =
    `Shield charge: ${snapshot.charge} · Missing charge: ${snapshot.missing}`;
  shieldEventTarget.addEventListener("shieldchange", inspectorListener);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  panel.remove();
  panel = null;
  shieldEventTarget.removeEventListener("shieldchange", inspectorListener);
};

renderMeter(createShieldSnapshot(count));

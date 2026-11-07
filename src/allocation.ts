export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;

let producers = 2;
const STANDARD_CONSUMPTION = 6;

export interface ShiftResult {
  producers: number;
  capacity: number;
  production: number;
  consumption: number;
  balance: number;
}

interface ReportRow {
  label: string;
  value: number;
  color: string;
}

function calculateShiftResult(activeProducers: number): ShiftResult {
  const production = activeProducers * 3;
  const consumption = STANDARD_CONSUMPTION;
  return {
    producers: activeProducers,
    capacity: 6,
    production,
    consumption,
    balance: production - consumption,
  };
}

function renderAllocation(result: ShiftResult) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < result.capacity; i++) {
    ctx.fillStyle = i < result.producers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < result.producers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }

  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${result.producers} / ${result.capacity}`, 18, 76);

  const rows: ReportRow[] = [
    {
      label: `Production: ${result.production}`,
      value: result.production,
      color: "#27766b",
    },
    {
      label: `Consumption: ${result.consumption}`,
      value: result.consumption,
      color: "#a44d23",
    },
  ];

  rows.forEach((row, index) => {
    const textY = 102 + index * 52;
    const barY = 110 + index * 52;

    ctx.fillStyle = "#233e43";
    ctx.font = "14px system-ui";
    ctx.fillText(row.label, 18, textY);

    ctx.fillStyle = row.color;
    ctx.fillRect(18, barY, row.value * 14, 20);
  });

  readout.textContent =
    `Assigned: ${result.producers}/${result.capacity} · Production: ${result.production} · Consumption: ${result.consumption} · Balance: ${
      result.balance > 0 ? "+" : ""
    }${result.balance}`;
}

function updateAllocationUI() {
  const result = calculateShiftResult(producers);
  renderAllocation(result);
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  producers = Math.max(0, producers - 1);
  updateAllocationUI();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  producers = Math.min(6, producers + 1);
  updateAllocationUI();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    producers = 2;
    updateAllocationUI();
  };
updateAllocationUI();

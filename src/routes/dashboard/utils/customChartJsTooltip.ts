import { Chart as ChartJS, type TooltipModel } from "chart.js";

export const customChartJsTooltip = (context: {
  chart: ChartJS;
  tooltip: TooltipModel<"bar">;
}) => {
  const { chart, tooltip } = context;

  const parent = chart.canvas.parentNode as HTMLElement;

  let tooltipEl = parent.querySelector(".chartjs-tooltip") as HTMLDivElement;

  if (!tooltipEl) {
    tooltipEl = document.createElement("div");
    tooltipEl.className = "chartjs-tooltip";
    tooltipEl.style.position = "absolute";
    tooltipEl.style.pointerEvents = "none";
    tooltipEl.style.background = "rgba(0, 0, 0, 0.8)";
    tooltipEl.style.color = "white";
    tooltipEl.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.12)";
    tooltipEl.style.borderRadius = "8px";
    tooltipEl.style.padding = "10px";
    tooltipEl.style.display = "flex";
    tooltipEl.style.alignItems = "center";
    tooltipEl.style.gap = "10px";
    tooltipEl.style.zIndex = "9999";
    tooltipEl.style.transform = "translate(-50%, -120%)";

    parent.appendChild(tooltipEl);
  }

  while (tooltipEl.firstChild) {
    tooltipEl.removeChild(tooltipEl.firstChild);
  }

  if (tooltip.opacity === 0) {
    tooltipEl.style.opacity = "0";
    return;
  }

  const index = tooltip.dataPoints?.[0]?.dataIndex;
  const dataset = chart.data.datasets[0];

  const image = (dataset as typeof dataset & { productImages?: string[] })
    .productImages?.[index];
  const label = tooltip.dataPoints?.[0]?.label;
  const value = tooltip.dataPoints?.[0]?.formattedValue;

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.gap = "10px";

  if (image) {
    const img = document.createElement("img");
    img.src = image;

    img.setAttribute("loading", "lazy");

    img.style.width = "36px";
    img.style.height = "36px";
    img.style.borderRadius = "6px";
    img.style.objectFit = "cover";

    wrapper.appendChild(img);
  }

  const textContainer = document.createElement("div");

  const title = document.createElement("div");
  title.style.fontWeight = "600";
  title.style.fontSize = "13px";
  title.textContent = label;

  const subtitle = document.createElement("div");
  subtitle.style.fontSize = "12px";
  subtitle.style.opacity = "0.7";
  subtitle.textContent = value;

  textContainer.appendChild(title);
  textContainer.appendChild(subtitle);

  wrapper.appendChild(textContainer);

  tooltipEl.appendChild(wrapper);

  const { offsetLeft, offsetTop } = chart.canvas;

  tooltipEl.style.opacity = "1";
  tooltipEl.style.left = offsetLeft + tooltip.caretX + "px";
  tooltipEl.style.top = offsetTop + tooltip.caretY + "px";
};

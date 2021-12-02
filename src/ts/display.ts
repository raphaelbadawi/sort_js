const d3 = require("d3");
import { DataHolder } from "./data_holder";
import { Operations } from "./enums/enums";
import { CityData, CityDisplayData } from "./types/types";

export class Display extends DataHolder {
  COMPARE_COLOR: string = "#61CE70";
  SWAP_COLOR: string = "#EF2961";
  PIVOT_COLOR: string = "#3273DC";
  DEFAULT_COLOR: string = "#000";

  prev1 = null;
  prev2 = null;

  compareCount: number;
  swapCount: number;
  compareCountElement: HTMLSpanElement;
  swapCountElement: HTMLSpanElement;

  constructor() {
    super();
    this.compareCountElement = document.querySelector("#compareCount");
    this.swapCountElement = document.querySelector("#swapCount");
  }

  incrementCount(countable: Operations) {
    if (countable === Operations.COMPARE) {
      this.compareCount++;
      this.compareCountElement.innerHTML = String(this.compareCount);
    }
    if (countable === Operations.SWAP) {
      this.swapCount++;
      this.swapCountElement.innerHTML = String(this.swapCount);
    }
  }

  swapAttr(p1, p2, attr) {
    var tmp = p1.attr(attr);
    p1.attr(attr, p2.attr(attr));
    p2.attr(attr, tmp);
  }

  swapRect(p1, p2) {
    this.swapAttr(p1, p2, "x");
    this.swapAttr(p1, p2, "id");
  }

  getRect(i: number) {
    return d3.select("rect#c" + i);
  }

  oneStep(action: [Operations, number, number]) {
    if (action.length < 3) {
      return;
    }

    let i = this.getRect(action[1]);
    let j = this.getRect(action[2]);
    if (this.prev1) {
      this.prev1.attr("fill", this.DEFAULT_COLOR);
    }
    if (this.prev2) {
      this.prev2.attr("fill", this.DEFAULT_COLOR);
    }
    this.prev1 = i;
    this.prev2 = j;

    if (action[0] === Operations.COMPARE) {
      i.attr("fill", this.COMPARE_COLOR);
      j.attr("fill", this.COMPARE_COLOR);
    }
    if (action[0] === Operations.SWAP) {
      this.swapRect(i, j);
      i.attr("fill", this.SWAP_COLOR);
      j.attr("fill", this.SWAP_COLOR);
    }
    if ((this.csvData[action[1]] as CityDisplayData).is_pivot) {
      i.attr("fill", this.PIVOT_COLOR);
    }
    if ((this.csvData[action[2]] as CityDisplayData).is_pivot) {
      j.attr("fill", this.PIVOT_COLOR);
    }

    this.incrementCount(action[0]);
  }

  setupDisplay() {
    const w: number = 800;
    const h: number = 400;
    const xScale = d3
      .scaleLinear()
      .domain([0, this.csvData.length])
      .range([0, w]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(this.csvData, (d: CityData) => d.dist)])
      .range([0, h]);

    d3.selectAll("svg > *").remove();

    const canvas = d3
      .select("body")
      .select("svg")
      .attr("width", w)
      .attr("height", h)
      .call(
        d3.zoom().on("zoom", function () {
          canvas.attr("transform", d3.event.transform);
        })
      )
      .append("g");

    const div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    const bars = canvas
      .selectAll("rect")
      .data(this.csvData)
      .enter()
      .append("rect")
      .attr("id", (i: CityData, j: number) => {
        return "c" + j;
      })
      .attr("width", xScale(1))
      .attr("height", (i: CityData) => yScale(i.dist))
      .attr("x", (i: number, j: number) => {
        return xScale(j);
      })
      .attr("y", (i: CityData, j: number) => h - yScale(i.dist))
      .attr("fill", (i: CityData) => i.dist)
      .attr("str", (i: CityData) => i.str)
      .on("mouseover", (e: MouseEvent, i: CityData) => {
        div.transition().duration(200).style("opacity", 0.9);
        div
          .html(i.str)
          .style("left", e.clientX + "px")
          .style("top", e.clientY - 28 + "px")
          .style("color", "white");
      })
      .on("mouseout", (d: CityData) => {
        div.transition().duration(500).style("opacity", 0);
      });

    // Make the canvas fit the available space
    const resize_canvas = () => {
      const mainCanvas = document.querySelector(
        "#main-canvas"
      ) as HTMLDivElement;
      const canvasDiv = document.querySelector("#canvas-div") as HTMLDivElement;
      mainCanvas.style.width = canvasDiv.clientWidth + "px";
    };
    resize_canvas();
  }
}

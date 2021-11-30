import { Operations } from "./enums/enums";
import { cityData } from "./types/types";
const d3 = require("d3");

export class Display {
  COMPARE_COLOR: string = "#00f";
  SWAP_COLOR: string = "#0f0";
  DEFAULT_COLOR: string = "#000";

  prev1 = null;
  prev2 = null;
  displayBuffer: [] = [];

  compareCount: number;
  swapCount: number;
  compareCountElement: HTMLSpanElement;
  swapCountElement: HTMLSpanElement;
  csvData: cityData[];

  constructor() {
    this.compareCountElement = document.querySelector("#compare-count");
    this.swapCountElement = document.querySelector("#swap-count");
  }

  incrementCount(countable: Operations) {
    if (countable === Operations.COMPARE) {
      this.compareCount++;
      this.compareCountElement.innerHTML = String(this.compareCount);
      if (compareCountElement.classList.contains("d-none"))
        compareCountElement.classList.remove("d-none");
    } else if (countable === Operations.SWAP) {
      this.swapCount++;
      this.swapCountElement.innerHTML = String(this.swapCount);
      if (compareCountElement.classList.contains("d-none"))
        compareCountElement.classList.remove("d-none");
    }
  }

  swap_attr(p1, p2, attr) {
    var tmp = p1.attr(attr);
    p1.attr(attr, p2.attr(attr));
    p2.attr(attr, tmp);
  }

  swap_rect(p1, p2) {
    this.swap_attr(p1, p2, "x");
    this.swap_attr(p1, p2, "id");
  }

  getRect(i) {
    return d3.select("rect#c" + i);
  }

  oneStep() {
    if (this.displayBuffer.length === 0) {
      return;
    }

    let action: Operations[] = this.displayBuffer.shift();
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
    } else if (action[0] === Operations.SWAP) {
      this.swap_rect(i, j);
      i.attr("fill", this.SWAP_COLOR);
      j.attr("fill", this.SWAP_COLOR);
    }
    this.incrementCount(action[0]);
  }

  setupDisplay() {
    const w: number = 800;
    const h: number = 400;
    var xScale = d3
      .scaleLinear()
      .domain([0, this.csvData.length])
      .range([0, w]);
    var yScale = d3
      .scaleLinear()
      .domain([0, d3.max(this.csvData, (d: cityData) => d.dist)])
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
      .attr("id", function (i, j) {
        return "c" + j;
      })
      .attr("width", xScale(1))
      .attr("height", function (i) {
        return yScale(i.dist);
      })
      .attr("x", function (i, j) {
        return xScale(j);
      })
      .attr("y", function (i, j) {
        return h - yScale(i.dist);
      })
      .attr("fill", function (i) {
        return i.dist;
      })
      .attr("str", function (i) {
        return i.str;
      })
      .on("mouseover", function (d) {
        div.transition().duration(200).style("opacity", 0.9);
        div
          .html(d.str)
          .style("left", d3.event.pageX + "px")
          .style("top", d3.event.pageY - 28 + "px");
      })
      .on("mouseout", function (d) {
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

  setData(data: cityData[]) {
    function num_dptIsntNAN(elt) {
      return !(isNaN(elt.dist) || elt.latitude == 0 || elt.longitude == 0);
    }

    this.csvData = data.filter(num_dptIsntNAN);
  }
}

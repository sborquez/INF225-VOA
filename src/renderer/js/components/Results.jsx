import React, { Component } from "react";
import Plot from "react-plotly.js";

const { ipcRenderer } = require("electron");

class Results extends Component {
  constructor() {
    super();
    ipcRenderer.on("results", (event, results) => {
      const { TS, res, csv } = results;

      const new_data = {
        USA: undefined,
        EU: undefined,
        TS: undefined
      };

      if (res.type === "USA") new_data.USA = res.result.plot_data;
      if (res.type === "EU") new_data.EU = res.result;
      if (TS) new_data.TS = TS;
      this.setState({ data: new_data });
    });

    this.state = {
      data: {
        USA: undefined,
        EU: undefined,
        TS: undefined
      }
    };

    this.getTimeSeriesPlot = this.getTimeSeriesPlot.bind(this);
    this.getUSAPlot = this.getUSAPlot.bind(this);
    this.getEU = this.getEU.bind(this);
  }

  getEU() {
    const data = this.state.data.EU;
    if (data) {
      return (
        <div>
          <h4>EU</h4>
          <span>
            {data.price}&plusmn;{data.payoff}
          </span>
        </div>
      );
    }
  }

  getUSAPlot() {
    if (this.state.data.USA) {
      const data = this.state.data.USA;

      const prices = {};
      prices.x = data.prices.x;
      prices.y = data.prices.y;
      prices.type = "scatter";

      return <Plot data={[prices]} layout={{ title: "Americana" }} />;
    } else {
      return <span>Sin resultados aun (Americana)</span>;
    }
  }

  getTimeSeriesPlot() {
    if (this.state.data.TS) {
      const data = this.state.data.TS;

      const high = {};
      high.x = data.High.x;
      high.y = data.High.y;
      high.type = "scatter";
      high.name = "High";

      const close = {};
      close.x = data.Close.x;
      close.y = data.Close.y;
      close.type = "scatter";
      close.name = "Close";

      const low = {};
      low.x = data.Low.x;
      low.y = data.Low.y;
      low.type = "scatter";
      low.name = "Low";

      return (
        <Plot data={[high, close, low]} layout={{ title: "Time Series" }} />
      );
    } else {
      return <span>Sin resultados aun (Time Series)</span>;
    }
  }

  render() {
    return (
      <div>
        {this.getTimeSeriesPlot()}
        {this.getUSAPlot()}
        {this.getEU()}
      </div>
    );
  }
}

export default Results;

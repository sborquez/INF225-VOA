import React, { Component } from "react";
import Plot from "react-plotly.js";

import DisplayType from "./DisplayType";

const { ipcRenderer } = require("electron");

class Results extends Component {
  constructor(props) {
    super(props);
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

    this.layout = {
      width: 500,
      height: 300,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      autosize: true,
      margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 4
      },
      font: {
        size: 13,
        color: "#ffffff"
      }
    };

    this.state = {
      data: {
        USA: undefined,
        EU: undefined,
        TS: undefined
      },
      display_type: "ts"
    };

    this.getTimeSeriesPlot = this.getTimeSeriesPlot.bind(this);
    this.getUSAPlot = this.getUSAPlot.bind(this);
    this.getEUPlot = this.getEUPlot.bind(this);

    this.handleNewType = this.handleNewType.bind(this);
  }

  getEUPlot() {
    const data = this.state.data.EU;
    if (data) {
      return (
        <div>
          <h4>EU</h4>
          <span>
            <b>{data.price}</b>
          </span>
          <span style={{ padding: 10 }}>{data.payoff}</span>
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

      return <Plot data={[prices]} layout={this.layout} />;
    } else {
      return <span />;
    }
  }

  getTimeSeriesPlot() {
    const pdataFromData = (data, name) => {
      const pdata = {};
      pdata.x = data.x;
      pdata.y = data.y;
      pdata.type = "scatter";
      pdata.name = name;
      return pdata;
    };

    if (this.state.data.TS) {
      const data = this.state.data.TS;

      const high = pdataFromData(data.High, "High");
      const close = pdataFromData(data.Close, "Close");
      const low = pdataFromData(data.Low, "Low");

      return <Plot data={[high, close, low]} layout={this.layout} />;
    } else {
      return <span />;
    }
  }

  handleNewType(type) {
    this.setState({ display_type: type });
  }

  render() {
    return (
      <React.Fragment>
        <div className="lt_type">
          <DisplayType onNewType={this.handleNewType} />
        </div>
        <div className="lt_display">
          <div
            className={
              "disp_ts" + (this.state.display_type === "ts" ? "" : " hidden")
            }
          >
            {this.getTimeSeriesPlot()}
          </div>
          <div
            className={
              "disp_eu" + (this.state.display_type === "eu" ? "" : " hidden")
            }
          >
            {this.getEUPlot()}
          </div>
          <div
            className={
              "disp_usa" + (this.state.display_type === "usa" ? "" : " hidden")
            }
          >
            {this.getUSAPlot()}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Results;

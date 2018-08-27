import React, { Component } from "react";
import ActionComplete from "./ActionComplete";

const { ipcRenderer, remote } = require("electron");
const dialog = remote.dialog;

class Companies extends Component {
  constructor() {
    super();
    this.state = {
      mode: 0,
      company: null,
      filename: null
    };
  }

  handleNewCompany(company) {
    this.props.onUpdate(this.state.mode, company);
  }

  render() {
    const setMode = m => {
      this.setState({
        mode: m,
        filename: m === 0 ? null : this.state.filename
      });
      if (m === 0) this.props.onFilename(null);
    };

    const openFile = () => {
      dialog.showOpenDialog(
        {
          filters: [{ name: "CSV", extensions: ["csv"] }]
        },
        fileNames => {
          if (fileNames === undefined) return;
          this.setState({ filename: fileNames[0] });
          this.props.onFilename(fileNames[0]);
        }
      );
    };

    return (
      <React.Fragment>
        <div className="lt_area-overlap data-inp highlight">
          {this.state.mode === 0 ? (
            <ActionComplete onUpdate={this.handleNewCompany} />
          ) : (
            <React.Fragment>
              <button type="button" id="file_submit" onClick={openFile}>
                {this.state.filename
                  ? this.state.filename
                  : "Seleccione un archivo..."}
              </button>
              <input
                id="data_input"
                name="filepath_data"
                type="hidden"
                value={this.state.filename ? this.state.filename : ""}
              />
            </React.Fragment>
          )}
        </div>
        <div className="lt_data-name highlight" />
        <a
          className={
            "lt_data1 " + (this.state.mode === 0 ? "highlight" : "select")
          }
          onClick={() => setMode(0)}
        >
          <i className="material-icons">cloud</i>
        </a>
        <a
          className={
            "lt_data2 " + (this.state.mode === 1 ? "highlight" : "select")
          }
          onClick={() => setMode(1)}
        >
          <i className="material-icons">attachment</i>
        </a>
      </React.Fragment>
    );
  }
}

export default Companies;

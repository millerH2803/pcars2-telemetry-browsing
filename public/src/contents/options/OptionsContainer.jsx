import React from "react";
import ReactDom from "react-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  requestTempUnitChange,
  requestDistanceUnitChange,
  requestAirPressureUnitChange
} from "../../appActionCreators.js";
import checkBoxStyle from "../../common/slideCheckBox.css";

class OptionsContent extends React.Component {
  constructor(props) {
    super(props);
    this.handleTempUnitCheckBoxChanged = this.handleTempUnitCheckBoxChanged.bind(this);
    this.handleDistanceUnitCheckBoxChanged = this.handleDistanceUnitCheckBoxChanged.bind(this);
    this.handleAirPressureUnitCheckBoxChanged = this.handleAirPressureUnitCheckBoxChanged.bind(this);
  }

  handleTempUnitCheckBoxChanged(evt) {
    this.props.onTempUnitChange(evt.target.checked);
  }

  handleDistanceUnitCheckBoxChanged(evt) {
    this.props.onDistanceUnitChange(evt.target.checked);
  }

  handleAirPressureUnitCheckBoxChanged(evt) {
    this.props.onAirPressureUnitChange(evt.target.checked);
  }

  createTempChangeContent() {
    return (
      <div>
        <span>Fahrenheit</span>
        <div className={checkBoxStyle.slideCheckBox}>
          <input
            id="tempCheckBox"
            type="checkbox"
            checked={this.props.isCelsius}
            onChange={evt => this.handleTempUnitCheckBoxChanged(evt)}
          />
          <label htmlFor="tempCheckBox"></label>
        </div>
        <span>Celsius</span>
      </div>
    );
  }

  createDistanceChangeContent() {
    return (
      <div>
        <span>Miles</span>
        <div className={checkBoxStyle.slideCheckBox}>
          <input
            id="distanceCheckBox"
            type="checkbox"
            checked={this.props.isMeter}
            onChange={evt => this.handleDistanceUnitCheckBoxChanged(evt)}
          />
          <label htmlFor="distanceCheckBox"></label>
        </div>
        <span>Meter</span>
      </div>
    );
  }

  createAirPressureChangeContent() {
    return (
      <div>
        <span>psi</span>
        <div className={checkBoxStyle.slideCheckBox}>
          <input
            id="airPressureCheckBox"
            type="checkbox"
            checked={this.props.isBar}
            onChange={evt => this.handleAirPressureUnitCheckBoxChanged(evt)}
          />
          <label htmlFor="airPressureCheckBox"></label>
        </div>
        <span>bar</span>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.createTempChangeContent()}
        {this.createDistanceChangeContent()}
        {this.createAirPressureChangeContent()}
      </div>
    );
  }
}

OptionsContent.propTypes = {
  isCelsius: PropTypes.bool.isRequired,
  isMeter: PropTypes.bool.isRequired,
  isBar: PropTypes.bool.isRequired,
  onTempUnitChange: PropTypes.func.isRequired,
  onDistanceUnitChange: PropTypes.func.isRequired,
  onAirPressureUnitChange: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  const options = state.options;
  return {
    isCelsius: options.isCelsius,
    isMeter: options.isMeter,
    isBar: options.isBar
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTempUnitChange: isCelsius => {
      dispatch(requestTempUnitChange(isCelsius));
    },
    onDistanceUnitChange: isMeter => {
      dispatch(requestDistanceUnitChange(isMeter));
    },
    onAirPressureUnitChange: isBar => {
      dispatch(requestAirPressureUnitChange(isBar));
    }
  };
};

const OptionsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(OptionsContent);

export default OptionsContainer;

import React from "react";
import { connect } from "react-redux";

const OptionComponent = (props) => {
  return (
    <div>
      <div>Option One: {props.option} </div>
      <div>Option Two: {props.option2} </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    option: state.simpleReducer.option,
    option2: state.simpleReducer.option2
  };
};

export default connect(mapStateToProps, null)(OptionComponent);
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { setOption, setOption2 } from "../redux/superAdmin/actions/simpleActions";
import OptionComponent from "./OptionComponent";

const ActionComponent = (props) => {
  const [option, setNewOption] = useState("");
  const [option2, setNewOption2] = useState("");

  const setOptionAction = (event) => {
    props.setOption(option);
  };

  const setOption2Action = (event) => {
    props.setOption2(option2);
  };

  return (
    <div className="App">
      <label>
        Option:
        <input
          type="text"
          value={option}
          onChange={(e) => setNewOption(e.target.value)}
        />
      </label>
      <button onClick={setOptionAction}>Save</button>
      <label>
        Option2:
        <input
          type="text"
          value={option2}
          onChange={(e) => setNewOption2(e.target.value)}
        />
      </label>
      <button onClick={setOption2Action}>Save</button>
      <OptionComponent />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setOption: (optionOne) => dispatch(setOption(optionOne)),
  setOption2: (optionTwo) => dispatch(setOption2(optionTwo)),
});

export default connect(null, mapDispatchToProps)(ActionComponent);

export const simpleAction = () => (dispatch) => {
    dispatch({
      type: "SIMPLE_ACTION",
      payload: "result_of_simple_action",
    });
  };
  
  export const setOption = (option) => (dispatch) => {
    
    dispatch({
      type: "SET_OPTION_ONE",
      payload: option,
    });
  };
  
  export const setOption2 = (option2) => (dispatch) => {
    dispatch({
      type: "SET_OPTION_TWO",
      payload: option2,
    });
  };
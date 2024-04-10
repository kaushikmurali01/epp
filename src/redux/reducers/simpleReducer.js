const initialState = {
    result: "",
    option: "",
    option2: "",
  };
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case "SIMPLE_ACTION":
        return {
          result: action.payload,
        };
      case "SET_OPTION_ONE":
        return {
          ...state, option: action.payload,
        };
      case "SET_OPTION_TWO":
        return {
          ...state, option2: action.payload,
        };
      default:
        return state;
    }
  };
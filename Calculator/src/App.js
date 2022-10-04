import "./App.css";
import { useReducer } from "react";

const buttons = [
  "7",
  "8",
  "9",
  "/",
  "4",
  "5",
  "6",
  "*",
  "1",
  "2",
  "3",
  "-",
  "0",
  ".",
  "+",
  "=",
];

const mathOpr = ["+", "-", "*", "/", "="];

const initialValue = {
  firstOprd: "",
  operation: "",
  result: "0",
  inputHistory: "",
  input: "",
  isTotal: "",
};

function calculate(opr, v1, v2) {
  let value1 = parseFloat(v1);
  let value2 = parseFloat(v2);
  let result;

  if (opr === "+") result = value1 + value2;
  if (opr === "-") result = value1 - value2;
  if (opr === "*") result = value1 * value2;
  if (opr === "/") result = value1 / value2;

  if (opr === "/" && (isNaN(result) || result === Infinity)) {
    return "0";
  }

  if (result !== parseInt(result)) {
    return result.toFixed(3).toString();
  }

  return result.toString();
}

const calcReducer = (state = initialValue, { type, payload }) => {
  let total = "0";
  switch (type) {
    case "=":
      total = calculate(state.operation, state.firstOprd, state.input);
      return {
        ...state,
        isTotal: "full",
        result: total,
      };
    case "OPERATION":
      total = calculate(state.operation, state.firstOprd, state.input);
      return {
        ...state,
        inputHistory: state.inputHistory.concat(payload),
        firstOprd: total,
        input: total,
        operation: payload,
        isTotal: "partial",
      };
    case "UPDATE":
      if (mathOpr.includes(payload))
        return {
          ...state,
          operation: payload,
          inputHistory: state.inputHistory.concat(payload),
          firstOprd: !state.firstOprd ? state.input : state.firstOprd,
          input: "",
        };
      return {
        ...state,
        inputHistory: state.inputHistory.concat(payload),
        input:
          state.isTotal === "partial" ? payload : state.input.concat(payload),
        isTotal: "",
      };
    case "DELETE":
      if (
        state.input.length <= 0 ||
        state.inputHistory.length <= 0 ||
        state.isTotal === "partial" ||
        state.isTotal === "full"
      )
        return state;
      return {
        ...state,
        input: state.input?.substring(0, state.input.length - 1),
        inputHistory:
          state.input?.length >= 0 &&
          state.inputHistory?.substring(0, state.inputHistory.length - 1),
      };
    case "AC":
      return { ...initialValue };
    default:
      return state;
  }
};

function App() {
  const [calc, dispatch] = useReducer(calcReducer, initialValue);

  const getValues = (e) => {
    const inputValue = e.target.id;

    if (!validityCheck(inputValue)) return;

    if (calc.operation && mathOpr.includes(inputValue)) {
      dispatch({
        type: inputValue === "=" ? "=" : "OPERATION",
        payload: inputValue,
      });
    } else {
      if (calc.isTotal === "full") dispatch({ type: "AC" });
      dispatch({ type: "UPDATE", payload: inputValue });
    }
  };

  const validityCheck = (entered) => {
    if (calc.input.length === 0 && mathOpr.includes(entered)) return false;
    if (entered === "." && calc.input.includes(".")) return false;
    if (entered === "=" && calc.operation === "") return false;
    if (
      (entered === "=" || mathOpr.includes(entered)) &&
      mathOpr.includes(calc.inputHistory.split("").pop())
    )
      return false;
    return true;
  };

  return (
    <div className="container">
      <div className="display">
        <p>{calc?.inputHistory}</p>
        <h2>
          {calc?.input === ""
            ? 0
            : calc?.isTotal === "full"
            ? calc?.result
            : calc.input}
        </h2>
      </div>
      <div className="buttonContainer">
        <div className="buttonHeader">
          <div className="button ac" onClick={() => dispatch({ type: "AC" })}>
            AC
          </div>
          <div
            className="button delete"
            onClick={() => dispatch({ type: "DELETE" })}
          >
            Delete
          </div>
        </div>
        {buttons &&
          buttons.map((button) => {
            return (
              <div
                key={button}
                id={button}
                className="button"
                onClick={(e) => getValues(e)}
              >
                {button}
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;

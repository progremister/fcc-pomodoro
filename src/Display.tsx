import { FaPause, FaPlay, FaUndo } from "react-icons/fa";
import { DisplayState, formatTime } from "./helpers";

type DisplayProps = {
  displayState: DisplayState;
  reset: () => void;
  startStop: (displayState: DisplayState) => void;
};

const Display: React.FC<DisplayProps> = ({
  displayState,
  reset,
  startStop,
}: DisplayProps) => {
  return (
    <div className="display">
      <h4 id="timer-label">{displayState.timeType.charAt(0).toUpperCase() + displayState.timeType.slice(1)}</h4>
      <span id="time-left" className={displayState.timeType === "Session" ? "red" : "green" } style={{ opacity: `${displayState.isTimeRunning ? "1" : ".6"}`}}>
        {formatTime(displayState.time)}
      </span>
      <div className="actions">
        <button id="start_stop" onClick={() => startStop(displayState)}>
            {displayState.isTimeRunning ? <FaPause /> : <FaPlay />}
        </button>
        <button id="reset" onClick={reset}>
            <FaUndo />
        </button>

      </div>
    </div>
  );
};

export default Display;

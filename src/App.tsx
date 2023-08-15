import { useEffect, useState } from "react";
import "./sass/style.scss";
import { DisplayState } from "./helpers";
import TimeSetter from "./TimeSetter";
import Display from "./Display";
import AlarmSound from "./assets/alarm.mp3";

const defaultBreak = 5 * 60;
const defaultSession = 25 * 60;
const min = 60,
  max = 60 * 60,
  interval = 60;

function App() {
  const [breakTime, setBreakTime] = useState(defaultBreak);
  const [sessionTime, setSessionTime] = useState(defaultSession);
  const [display, setDisplay] = useState<DisplayState>({
    time: sessionTime,
    timeType: "Session",
    isTimeRunning: false,
  });

  useEffect(() => {
    let timerID: number;
    if (!display.isTimeRunning) return;

    if (display.isTimeRunning) {
      timerID = window.setInterval(decrementDisplay, 1000);
    }

    return () => {
      window.clearInterval(timerID);
    };
  }, [display.isTimeRunning]);

  useEffect(() => {
    if (display.time === 0) {
      const audio = document.getElementById("beep") as HTMLAudioElement;
      audio.currentTime = 2;
      audio.play().catch((err) => console.log(err));
      setDisplay((prev) => ({
        ...prev,
        timeType: prev.timeType === "Session" ? "Break" : "Session",
        time: prev.timeType === "Session" ? breakTime : sessionTime,
      }));
      (document.getElementById("timer-label") as HTMLElement).innerText = display.timeType;
    }
  }, [display, breakTime, sessionTime]);

  const reset = () => {
    setBreakTime(defaultBreak);
    setSessionTime(defaultSession);
    setDisplay({
      time: defaultSession,
      timeType: "Session",
      isTimeRunning: false,
    });
    const audio = document.getElementById("beep") as HTMLAudioElement;
    audio.pause();
    audio.currentTime = 0;
  };

  const startStop = () => {
    setDisplay((prev) => ({
      ...prev,
      isTimeRunning: !prev.isTimeRunning,
    }));
  };

  const changeBreak = (time: number) => {
    if (display.isTimeRunning) {
      return;
    }
    setBreakTime(time);
  };

  const changeSession = (time: number) => {
    if (display.isTimeRunning) {
      return;
    }
    setSessionTime(time);
    setDisplay({
      time: time,
      timeType: "Session",
      isTimeRunning: false,
    });
  };

  const decrementDisplay = () => {
    setDisplay((prev) => ({
      ...prev,
      time: prev.time - 1,
    }));
  };

  return (
    <div className="container">
      <h2 className="title">Pomodoro Timer</h2>
      <div className="setters">
        <div className="break">
          <h4 id="break-label">Break Length</h4>
          <TimeSetter
            time={breakTime}
            setTime={changeBreak}
            min={min}
            max={max}
            interval={interval}
            type="break"
          />
        </div>
        <div className="session">
          <h4 id="session-label">Session Length</h4>
          <TimeSetter
            time={sessionTime}
            setTime={changeSession}
            min={min}
            max={max}
            interval={interval}
            type="session"
          />
        </div>
      </div>
      <Display displayState={display} reset={reset} startStop={startStop} />
      <audio id="beep" src={AlarmSound} />
    </div>
  );
}

export default App;

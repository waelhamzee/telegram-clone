import React, { useEffect, useState } from 'react'
import { formatMinutes, formatSeconds } from '../utils/format-time';

  const flex = {
    display: "flex",
    alignItems: "center",
  };
  
  
  const Timer = () => {
    const [timer, setTimer] = useState({recordingMinutes : 0, recordingSeconds : 0});
  
    useEffect(() => {
      const MAX_RECORDER_TIME = 5;
      let recordingInterval = null;
  
      if (timer.initRecording) {
        recordingInterval = setInterval(() => {
            setTimer((prevState) => {
            if (
              prevState.recordingMinutes === MAX_RECORDER_TIME &&
              prevState.recordingSeconds === 0
            ) {
              clearInterval(recordingInterval);
              return prevState;
            }
  
            if (
              prevState.recordingSeconds >= 0 &&
              prevState.recordingSeconds < 59
            )
              return {
                ...prevState,
                recordingSeconds: prevState.recordingSeconds + 1,
              };
  
            if (prevState.recordingSeconds === 59)
              return {
                ...prevState,
                recordingMinutes: prevState.recordingMinutes + 1,
                recordingSeconds: 0,
              };
          });
        }, 1000);
      } else clearInterval(recordingInterval);
  
      return () => clearInterval(recordingInterval);
    });
  

    return (
        <div style={flex}>
        <div style={flex}>
          <span>{formatMinutes(timer.recordingMinutes)}</span>
          <span>:</span>
          <span>{formatSeconds(timer.recordingSeconds)}</span>
        </div>
      </div>
    )
}

export default Timer;
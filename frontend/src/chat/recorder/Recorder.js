import React from "react";
import { formatMinutes, formatSeconds } from "../../utils/format-time";
import "./recorder.css";

const flex = {
  display: "flex",
  alignItems: "center",
};

const Recorder = ({ initRecording, recordingMinutes, recordingSeconds }) => {
  return (
    <div style={flex}>
      <div style={flex}>
        <span>{formatMinutes(recordingMinutes)}</span>
        <span>:</span>
        <span>{formatSeconds(recordingSeconds)}</span>
      </div>
      {initRecording && <div className="recording-indicator"></div>}
    </div>
  );
};

export default Recorder;

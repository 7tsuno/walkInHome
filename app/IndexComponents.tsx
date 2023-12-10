"use client";

import {
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import React from "react";
import Webcam from "react-webcam";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const IndexComponents: React.FC<IndexComponentsProps> = ({
  message,
  distance,
  walkCount,
  webcamRef,
  videoConstraints,
  started,
  lat,
  lng,
  changeLat,
  changeLng,
}) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <div style={{ height: "100%", width: "100%" }}>
        <div
          id="street-view"
          style={{
            height: "100%",
            width: "100%",
            display: started ? "block" : "none",
          }}
        ></div>
        {message && (
          <div className="message">
            <Typography variant="h4">{message}</Typography>
          </div>
        )}
        <div
          style={{
            zIndex: "10",
            position: "absolute",
            left: "1em",
            top: "4em",
          }}
        >
          {!started && (
            <div
              style={{
                zIndex: "10",
                background: "rgba(0,0,0,0.8)",
                color: "#FFF",
                padding: "1em",
                margin: "1em",
              }}
            >
              <div>
                <TextField
                  label="Lat"
                  variant="outlined"
                  value={lat}
                  onChange={changeLat}
                />
              </div>
              <div style={{ marginTop: "1em" }}>
                <TextField
                  label="Lng"
                  variant="outlined"
                  value={lng}
                  onChange={changeLng}
                />
              </div>
            </div>
          )}
          {started && (
            <div
              style={{
                zIndex: "10",
                background: "rgba(0,0,0,0.8)",
                color: "#FFF",
                padding: "1em",
                margin: "1em",
              }}
            >
              <Typography variant="h4">
                Distance : {distance.toFixed(0)} m
              </Typography>
              <Typography variant="h4">Steps : {walkCount}</Typography>
              <Typography variant="h4">
                Calory : {(walkCount * 0.0353).toFixed(1)}kcal
              </Typography>
            </div>
          )}
        </div>
        <div
          style={{
            position: "absolute",
            left: "1em",
            bottom: "1em",
            zIndex: "10",
          }}
        >
          <Webcam
            audio={false}
            width={320}
            height={180}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
        </div>
      </div>
    </ThemeProvider>
  );
};

interface IndexComponentsProps {
  message: string;
  distance: number;
  walkCount: number;
  webcamRef: React.RefObject<Webcam>;
  videoConstraints: MediaTrackConstraints;
  started: boolean;
  lat: number;
  lng: number;
  changeLat: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  changeLng: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export default IndexComponents;

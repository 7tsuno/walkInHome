import { useRef } from "react";
import Webcam from "react-webcam";

export const useWebcam = (props: { width: number; height: number }) => {
  const webcamRef = useRef<Webcam>(null);
  const videoConstraints = {
    width: props.width,
    height: props.height,
    facingMode: "user",
  };
  return { webcamRef, videoConstraints };
};

import { useEffect, useState, RefObject } from "react";
import Webcam from "react-webcam";
import {
  FilesetResolver,
  NormalizedLandmark,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";

export const useMediaPipe = (webcamRef: RefObject<Webcam>) => {
  const [landmarks, setLandmarks] = useState<NormalizedLandmark[]>();

  useEffect(() => {
    const setupPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );

      const poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath:
            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task",
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        minPoseDetectionConfidence: 0.7,
      });

      poseLandmarker.setOptions({
        runningMode: "VIDEO",
      });

      let lastVideoTime = -1;
      const renderLoop = () => {
        const video = webcamRef.current?.video;
        if (video && video.currentTime !== lastVideoTime) {
          const timestamp = video.currentTime * 1000;
          poseLandmarker.detectForVideo(video, timestamp, (results) => {
            setLandmarks(results.landmarks[0]);
            lastVideoTime = video.currentTime;
          });
        }
        requestAnimationFrame(() => renderLoop());
      };

      renderLoop();
    };

    setupPoseLandmarker();
  }, [webcamRef]);

  return { landmarks };
};

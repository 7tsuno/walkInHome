"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import IndexComponents from "./IndexComponents";
import { useStreetView } from "./hooks/useStreetView";
import { useMediaPipe } from "./hooks/useMediaPipe";
import { usePose } from "./hooks/usePose";
import { useWebcam } from "./hooks/useWebcam";

const IndexContainer: React.FC = () => {
  const [message, setMessage] = useState<string>(
    "開始地点の緯度経度を入力し、準備ができたら両手をあげてください"
  );
  const [started, setStarted] = useState<boolean>(false);
  const [lat, setLat] = useState<number>(48.8600479);
  const [lng, setLng] = useState<number>(2.2896996);
  const { videoConstraints, webcamRef } = useWebcam({
    width: 1280,
    height: 720,
  });

  const { turnLeft, turnRight, distance, moveForward } = useStreetView(
    lat,
    lng,
    started
  );

  const { landmarks } = useMediaPipe(webcamRef);

  const { walkCount, walk, bothHandsUp, leftHandsUp, rightHandsUp } =
    usePose(landmarks);

  useEffect(() => {
    if (walk) {
      moveForward();
    }
  }, [walk]);

  useEffect(() => {
    if (bothHandsUp && !started) {
      setMessage("OK!それではあなたの旅を始めましょう！");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      setStarted(true);
    }
    if (leftHandsUp) {
      const id = setInterval(() => {
        turnLeft();
      }, 10);
      return () => clearInterval(id);
    }
    if (rightHandsUp) {
      const id = setInterval(() => {
        turnRight();
      }, 10);
      return () => clearInterval(id);
    }
  }, [bothHandsUp, leftHandsUp, rightHandsUp, started]);

  const changeLat = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);

    setLat(Number(e.target.value));
  }, []);

  const changeLng = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLng(Number(e.target.value));
  }, []);

  const props = {
    webcamRef,
    message,
    distance,
    walkCount,
    videoConstraints,
    started,
    lat,
    lng,
    changeLat,
    changeLng,
  };

  return <IndexComponents {...props} />;
};

export default IndexContainer;

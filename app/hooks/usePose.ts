import { NormalizedLandmark } from "@mediapipe/tasks-vision";
import { useEffect, useState } from "react";

type WalkPoseType = "none" | "rightUp" | "rightDown" | "leftUp" | "leftDown";
const stepThresholdRatio = 1 / 8;

export const usePose = (landmarks: NormalizedLandmark[] | undefined) => {
  const [beforeWalkPoseType, setBeforeWalkPoseType] =
    useState<WalkPoseType>("none");
  const [rightFootUpThreshold, setRightFootUpThreshold] = useState<number>();
  const [leftFootUpThreshold, setLeftFootUpThreshold] = useState<number>();
  const [walkCount, setWalkCount] = useState<number>(0);
  const [bothHandsUp, setBothHandsUp] = useState<boolean>(false);
  const [rightHandsUp, setRightHandsUp] = useState<boolean>(false);
  const [leftHandsUp, setLeftHandsUp] = useState<boolean>(false);
  const [walk, setWalk] = useState<boolean>(false);

  useEffect(() => {
    if (!landmarks) {
      return;
    }
    const rightHandsUp = landmarks[16].y < landmarks[12].y;
    const leftHandsUp = landmarks[15].y < landmarks[11].y;
    const bothHandsUp = rightHandsUp && leftHandsUp;

    setRightHandsUp(rightHandsUp);
    setLeftHandsUp(leftHandsUp);
    setBothHandsUp(bothHandsUp);

    if (bothHandsUp && !rightFootUpThreshold && !leftFootUpThreshold) {
      setRightFootUpThreshold(
        landmarks[30].y -
          (landmarks[30].y - landmarks[26].y) * stepThresholdRatio
      );
      setLeftFootUpThreshold(
        landmarks[29].y -
          (landmarks[29].y - landmarks[25].y) * stepThresholdRatio
      );
    }

    if (!rightFootUpThreshold || !leftFootUpThreshold) {
      return;
    }

    if (
      (beforeWalkPoseType === "none" || beforeWalkPoseType === "leftDown") &&
      landmarks[30].y < rightFootUpThreshold
    ) {
      setBeforeWalkPoseType("rightUp");
    }

    if (
      beforeWalkPoseType === "rightUp" &&
      landmarks[30].y > rightFootUpThreshold
    ) {
      setBeforeWalkPoseType("rightDown");
      setWalkCount(walkCount + 1);
    }

    if (
      (beforeWalkPoseType === "none" || beforeWalkPoseType === "rightDown") &&
      landmarks[29].y < leftFootUpThreshold
    ) {
      setBeforeWalkPoseType("leftUp");
    }

    if (
      beforeWalkPoseType === "leftUp" &&
      landmarks[29].y > leftFootUpThreshold
    ) {
      setBeforeWalkPoseType("leftDown");
      setWalkCount(walkCount + 1);
    }
  }, [
    landmarks,
    beforeWalkPoseType,
    walkCount,
    rightFootUpThreshold,
    leftFootUpThreshold,
  ]);

  useEffect(() => {
    if (walkCount !== 0 && walkCount % 4 === 0) {
      setWalk(true);
    } else {
      setWalk(false);
    }
  }, [walkCount]);

  return { walkCount, walk, bothHandsUp, rightHandsUp, leftHandsUp };
};

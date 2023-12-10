import { useCallback, useEffect, useRef, useState } from "react";
import { computeDistanceBetween } from "../utils/distance";

export const useStreetView = (lat: number, lng: number, started: boolean) => {
  const [rotating, setRotating] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>(0);

  const streetViewRef = useRef<google.maps.StreetViewPanorama>();

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window !== "undefined" && lat && lng && started) {
        console.log("loadGoogleMapsScript");

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&callback=initStreetView`;
        document.head.appendChild(script);
      }
    };

    // ストリートビューを初期化
    window.initStreetView = () => {
      const initialPosition = { lat, lng };
      streetViewRef.current = new google.maps.StreetViewPanorama(
        document.getElementById("street-view") as HTMLElement,
        {
          position: initialPosition,
          pov: { heading: 34, pitch: 10 },
        }
      );
    };

    loadGoogleMapsScript();
  }, [lat, lng, started]);

  // 指定された角度だけカメラを回転させる関数
  const turn = useCallback(
    (angle: number) => {
      if (streetViewRef.current && !rotating) {
        setRotating(true);
        let pov = streetViewRef.current.getPov();
        const targetHeading = pov.heading! + angle;

        const rotate = () => {
          if (streetViewRef.current) {
            pov = streetViewRef.current.getPov();
            const headingDifference = targetHeading - pov.heading!;

            if (Math.abs(headingDifference) > 0.5) {
              pov.heading! +=
                (headingDifference / Math.abs(headingDifference)) * 0.5;
              streetViewRef.current.setPov(pov);
              requestAnimationFrame(rotate);
            } else {
              streetViewRef.current.setPov({ ...pov, heading: targetHeading }); // 目標に到達したら正確に角度を設定
              setRotating(false);
            }
          }
        };

        requestAnimationFrame(rotate);
      }
    },
    [rotating]
  );

  // 左にちょっと回転する関数
  const turnLeft = useCallback(() => {
    turn(-1);
  }, [turn]);

  // 左にちょっと回転する関数
  const turnRight = useCallback(() => {
    turn(1);
  }, [turn]);

  // 次のパノラマに移動する関数
  const moveForward = useCallback(() => {
    if (streetViewRef.current) {
      const currentPosition = streetViewRef.current.getPosition();
      const currentPov = streetViewRef.current.getPov();
      const links = streetViewRef.current.getLinks();
      if (!links) return;

      // 現在のheadingに最も近いリンクをソートで選択
      const closestLink = links.sort((a, b) => {
        const diffA = Math.abs(currentPov.heading! - a.heading!);
        const diffB = Math.abs(currentPov.heading! - b.heading!);
        return diffA - diffB;
      })[0];

      if (closestLink) {
        const streetViewService = new google.maps.StreetViewService();
        streetViewService.getPanorama(
          { pano: closestLink.pano! },
          (data, status) => {
            if (status === google.maps.StreetViewStatus.OK) {
              const nextPosition = data!.location!.latLng;

              // 距離を計算
              setDistance(
                distance +
                  computeDistanceBetween(currentPosition, nextPosition!)
              );
              streetViewRef.current!.setPano(closestLink.pano!);
            }
          }
        );
      }
    }
  }, [distance]);

  return { turnLeft, turnRight, moveForward, distance };
};

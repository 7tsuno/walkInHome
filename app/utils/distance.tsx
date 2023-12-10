const computeDistanceBetween = (
  from: google.maps.LatLng,
  to: google.maps.LatLng
) => {
  const R = 6371e3; // 地球の半径（メートル）
  const rad = Math.PI / 180;
  const lat1 = from.lat() * rad;
  const lat2 = to.lat() * rad;
  const deltaLat = (to.lat() - from.lat()) * rad;
  const deltaLng = (to.lng() - from.lng()) * rad;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 距離（メートル）
};

export { computeDistanceBetween };

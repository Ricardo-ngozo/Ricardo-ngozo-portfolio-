export default function handleResize(renderer, camera, canvasDiv) {
  if (!canvasDiv.current) return;
  const width = canvasDiv.current.offsetWidth || window.innerWidth;
  const height = canvasDiv.current.offsetHeight || window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}

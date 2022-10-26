import * as math from "mathjs";
import React, { useEffect, useRef, useState } from "react";
import tokamakRenderImage from "./masked_rendered_view_highres.png";
type Props = {
  flatCameraImage;
};
const scaleFactor = 0.67;
const aspectRatio = 772 / 1032;
const CameraImageCanvas = ({ flatCameraImage: flatCameraImage }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const height = 384;

    canvas.width = 193;
    canvas.height = 258;
    canvas.style.width = `${height * aspectRatio}px`;
    canvas.style.height = `${height}px`;
    canvas.style.background =
      "url('/blogdata/machine-learning-reconstruction/masked_rendered_view_highres.png')";
    canvas.style.backgroundSize = "100% 100%";
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    let colourImageData = new Uint8ClampedArray(258 * 193 * 4);
    const maxFlatCameraImage = math.max(flatCameraImage);
    const brightnessScaling = 370.0 / maxFlatCameraImage;
    const normalizedColour = [1, 39 / 232, 57 / 232];
    for (let i = 0; i < colourImageData.length; i += 4) {
      colourImageData[i + 0] = brightnessScaling * flatCameraImage[i / 4]; // R value
      colourImageData[i + 1] = normalizedColour[1] * brightnessScaling * flatCameraImage[i / 4]; // G value
      colourImageData[i + 2] = normalizedColour[2] * brightnessScaling * flatCameraImage[i / 4]; // B value
      colourImageData[i + 3] = maxFlatCameraImage > 0 ? 235 : 130; // A value
    }
    let imageData = new ImageData(colourImageData, 193, 258);
    ctxRef.current.putImageData(imageData, 0, 0);
  }, [flatCameraImage]);
  return (
    <>
      <canvas ref={canvasRef} className={"transform -scale-x-100"}></canvas>
    </>
  );
};

export default CameraImageCanvas;

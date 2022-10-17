import * as math from "mathjs";
import React, { useEffect, useRef, useState } from "react";

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
    // we use a scale factor to automatically have the correct resolution for the inversion grid
    const height = 384;

    canvas.width = 193;
    canvas.height = 258;
    canvas.style.width = `${height * aspectRatio}px`;
    canvas.style.height = `${height}px`;
    canvas.style.backgroundColor = "black";
    // Setting the context to enable us draw
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    let colourImageData = new Uint8ClampedArray(258 * 193 * 4);
    const brightnessScaling = 300.0 /  math.max(flatCameraImage)
    for (let i = 0; i < colourImageData.length; i += 4) {
      colourImageData[i + 0] = brightnessScaling * flatCameraImage[i / 4];    // R value
      colourImageData[i + 1] = 0.5 * brightnessScaling * flatCameraImage[i / 4];  // G value
      colourImageData[i + 2] = 0.5 * brightnessScaling * flatCameraImage[i / 4];    // B value
      colourImageData[i + 3] = 255;  // A value
    }
    let imageData = new ImageData(colourImageData, 193, 258);
    ctxRef.current.putImageData(imageData, 0, 0);
  }, [flatCameraImage]);
  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
};

export default CameraImageCanvas;

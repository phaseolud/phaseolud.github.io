import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";

const scaleFactor = 1 / 6;
const unusedJsPixels = [
  2058, 2059, 2060, 2061, 2062, 2063, 2064, 2093, 2094, 2095, 2096, 2097, 2098, 2099, 2127, 2128, 2129, 2130,
  2131, 2132, 2133, 2134, 2161, 2162, 2163, 2164, 2165, 2166, 2167, 2168, 2169, 2170, 2195, 2196, 2197, 2198,
  2199, 2200, 2201, 2202, 2203, 2204, 2205, 2206, 2229, 2230, 2231, 2232, 2233, 2234, 2235, 2236, 2237, 2238,
  2239, 1819, 1853, 1854, 1888, 1889, 1922, 1923, 1924, 1956, 1957, 1958, 1959, 1990, 1991, 1992, 1993, 1994,
  2024, 2025, 2026, 2027, 2028, 2029,
];

type Props = {
  updateParent: Function;
};

const InterActiveCanvas = forwardRef((props: Props, ref) => {
  const [drawing, setDrawing] = useState(false);
  const [initializedDrawing, setInitializedDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D>(null);

  useImperativeHandle(ref, () => ({
    testRef() {
      return ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    },
  }));

  const setUnusedJsPixelsGray = () => {
    let imageData = ctxRef.current.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
    for (let pixelIndex of unusedJsPixels) {
      imageData.data[4 * pixelIndex] = 252;
      imageData.data[4 * pixelIndex + 1] = 252;
      imageData.data[4 * pixelIndex + 2] = 252;
      imageData.data[4 * pixelIndex + 3] = 255;
    }
    ctxRef.current.putImageData(imageData, 0, 0);
  };

  const startDraw = ({ nativeEvent }) => {
    if (!initializedDrawing) {
      setInitializedDrawing(true);
      clear();
    }
    let { offsetX, offsetY } = nativeEvent;
    if (offsetX === undefined) {
      const rect = nativeEvent.target.getBoundingClientRect();
      offsetX = nativeEvent.targetTouches[0].clientX - rect.left;
      offsetY = nativeEvent.targetTouches[0].clientY - rect.top;
    }
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const stopDraw = () => {
    if (!drawing) return;
    ctxRef.current.closePath();
    setDrawing(false);
    setUnusedJsPixelsGray();
    props.updateParent();
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing) return;

    let { offsetX, offsetY } = nativeEvent;
    if (offsetX === undefined) {
      const rect = nativeEvent.target.getBoundingClientRect();
      offsetX = nativeEvent.targetTouches[0].clientX - rect.left;
      offsetY = nativeEvent.targetTouches[0].clientY - rect.top;
    }
    ctxRef.current.lineTo(offsetX, offsetY);
    ctxRef.current.stroke();
  };

  const clear = () => {
    ctxRef.current.clearRect(
      0,
      0,
      (canvasRef.current.width * 1) / scaleFactor,
      (canvasRef.current.height * 1) / scaleFactor
    );
    setUnusedJsPixelsGray();
    props.updateParent();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    // we use a scale factor to automatically have the correct resolution for the inversion grid
    const width = 35 / scaleFactor;
    const height = 64 / scaleFactor;
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    canvas.style.imageRendering = "pixelated";
    canvas.style.backgroundColor = "black";
    // Setting the context to enable us draw
    const ctx = canvas.getContext("2d");
    ctx.scale(scaleFactor, scaleFactor);
    ctx.lineCap = "round";
    ctx.strokeStyle = "#ee6c4dff";
    ctx.lineWidth = 2;
    ctxRef.current = ctx;
    ctx.font = "80px sans-serif";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Draw", width / 2, height / 2);
    ctx.fillText("Here", width / 2, height * 0.75);
    setUnusedJsPixelsGray();
  }, []);

  // Drawing functionalities

  return (
    <>
      <div className="flex flex-col">
        <div>
          <button onClick={clear} className="bg-[#ee6c4dff] px-2 py-1 my-2 rounded-md text-white">
            Clear Drawing
          </button>
        </div>
        <canvas
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          onTouchCancel={stopDraw}
          onMouseDown={startDraw}
          onMouseUp={stopDraw}
          onMouseMove={draw}
          onMouseLeave={stopDraw}
          ref={canvasRef}
          style={{ touchAction: "none" }}
        ></canvas>
      </div>
    </>
  );
});

export default InterActiveCanvas;

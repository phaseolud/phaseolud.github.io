import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";

const scaleFactor = 1 / 6;

type Props = {
  updateParent: Function;
};

const InterActiveCanvas = forwardRef((props: Props, ref) => {
  const [drawing, setDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D>(null);

  useImperativeHandle(ref, () => ({
    testRef() {
      return ctxRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    },
  }));

  const startDraw = ({ nativeEvent }) => {
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
    ctxRef.current.closePath();
    setDrawing(false);
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
    console.log(offsetY);
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
    ctx.strokeStyle = "#FF8787";
    ctx.lineWidth = 2;
    ctxRef.current = ctx;
  }, []);

  // Drawing functionalities

  return (
    <>
      <div className="flex flex-col">
        <div>
          <button
            onClick={clear}
            className="bg-red-300 px-2 py-1 my-2 rounded-md"
          >
            Clear Canvas
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

import React, { useEffect, useRef, useState } from "react";
import InterActiveCanvas from "./InteractiveCanvas";
import CameraImageCanvas from "./CameraImageCanvas";
import { create, all } from "mathjs";
const math = create(all);

async function loadGeometryMatrix() {
  const response = await fetch(
    "/blogdata/machine-learning-reconstruction/mathjs_gm.json"
  );
  const data = await response.json();
  // @ts-ignore
  return math.SparseMatrix.fromJSON(data);
}

async function loadRectToPoloidalGridMap(): Promise<Map<number, number>> {
  const response = await fetch(
    "/blogdata/machine-learning-reconstruction/jsrect_to_pol.json"
  );
  const data = await response.json();
  const dataMap = new Map(
    Object.entries(data).map(([rectIndex, PolIndex]) => [
      parseInt(rectIndex),
      PolIndex,
    ])
  ) as Map<number, number>;
  return dataMap;
}

const DrawPoloidalCamera = () => {
  const interactiveCanvasRef = useRef(null);
  const [emissivity, setEmissivity] = useState<Array<number>>(
    Array(2162).fill(0)
  );
  const [geometryMatrix, setGeometryMatrix] = useState(null);
  const [rectToPolMap, setRectToPolMap] = useState<Map<number, number>>(null);
  const [flatCameraImage, setFlatCameraImage] = useState<Array<number>>(
    Array(49794).fill(0)
  );

  useEffect(() => {
    loadGeometryMatrix().then((data) => setGeometryMatrix(data));
    loadRectToPoloidalGridMap().then((data) => setRectToPolMap(data));
  }, []);

  const parseEmissivityFromCanvas = () => {
    const canvasData = Array.from(
      interactiveCanvasRef.current.testRef().data
    ) as Array<number>;

    const rectEmissivityData = canvasData
      .filter((_value, index) => index % 4 == 0)
      .map((value) => value / 255.0);

    const emissivityData = new Array(rectToPolMap.size).fill(0);
    for (const [rectIndex, polIndex] of rectToPolMap)
      emissivityData[polIndex] = rectEmissivityData[rectIndex];

    setEmissivity(emissivityData);
  };

  const calculateCameraFromEmissivity = () => {
    const flatCameraImage = math.squeeze(
      math.matrix(math.multiply(geometryMatrix, emissivity), "dense")
    );
    setFlatCameraImage(flatCameraImage.toArray() as Array<number>);
  };

  useEffect(() => {
    if (geometryMatrix && rectToPolMap) calculateCameraFromEmissivity();
  }, [emissivity]);

  if (!(geometryMatrix || rectToPolMap))
    return (
      <div className="flex justify-center items-center font-bold my-16 text-lg">
        Loading math data
      </div>
    );

  return (
    <>
      <div>
        <div className="flex justify-between items-end">
          <InterActiveCanvas
            ref={interactiveCanvasRef}
            updateParent={parseEmissivityFromCanvas}
          />
          <CameraImageCanvas flatCameraImage={flatCameraImage} />
        </div>
      </div>
    </>
  );
};

export default DrawPoloidalCamera;

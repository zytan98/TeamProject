import { useEffect, useRef, useState } from 'react/cjs/react.development';
import './siteMap.css';
import { history } from 'umi';
import request from 'umi-request';
import { message } from 'antd';

const SiteMap = (props) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(true);
  const [shapeClicked, setShapeClicked] = useState(-1);
  const [lastPointValidation, setlastPointValidation] = useState(false);
  const [startPoint, setStartPoint] = useState({});
  const [currentPoints, setCurrentPoints] = useState([]);
  const [buildingClicked, setBuildingClicked] = useState(null);
  const [pointsList, setPointsList] = useState([]);
  function getSiteShapePoints() {
    request('https://localhost:5001/api/ShapePoint/byworksiteId/', {
      suffix: props.selectWorksite,
      method: 'get',
    }).then((response) => {
      setPointsList(response);
    });
  }
  function updateNewBuildingPoints(shapePoint) {
    request('https://localhost:5001/api/Building/', {
      method: 'put',
      suffix: props.buildingSelected.selectedBuildingId,
      data: {
        buildingId: props.buildingSelected.selectedBuildingId,
        worksiteId: props.buildingSelected.worksiteId,
        restricted: props.buildingSelected.restriction,
        buildingName: props.buildingSelected.buildingName,
      },
    }).then((e) => {
      request('https://localhost:5001/api/ShapePoint/bulk', {
        method: 'post',
        data: shapePoint,
      }).then((response) => {
        if (response) {
          props.setNewShapeUpdated(true);
          message.success('Successfully Inserted Building Shape');
          getSiteShapePoints();
        }
      });
    });
  }
  useEffect(() => {}, [props.buildingSelected]);
  useEffect(() => {
    getSiteShapePoints();
  }, [props.selectWorksite]);
  useEffect(() => {
    if (props.isDeleteCurrentShape) {
      getSiteShapePoints();
      props.setIsDeleteCurrentShape(false);
    }
  }, [props.isDeleteCurrentShape]);
  useEffect(() => {
    drawCanvas();
  }, [pointsList, props.siteImage]);
  useEffect(() => {
    setIsDrawing(props.isDrawing);
    canvasRef.current.classList.toggle('is-drawing');
    drawCanvas();
    setCurrentPoints([]);
  }, [props.isDrawing, props.siteImage]);

  useEffect(() => {
    drawCanvas();
  }, [shapeClicked, props.siteImage]);

  useEffect(() => {
    //ensure that last point is updated before pushing into pointList
    if (lastPointValidation) {
      updateNewBuildingPoints(currentPoints);
      setCurrentPoints([]);
      contextRef.current.closePath();
      setlastPointValidation(false);
    } else {
      //set IsDrawing to false as drawing ended
      //will also trigger to redraw canvas
      props.setIsDrawing(false);
    }
  }, [lastPointValidation]);

  //declare canvas and background
  function drawCanvas() {
    var background = new Image();
    background.src = props.siteImage;
    background.onload = () => {
      //declare canvas background
      const canvas = canvasRef.current;
      canvas.width = background.naturalWidth;
      canvas.height = background.naturalHeight;
      canvas.style.width = background.naturalWidth + 'px';
      canvas.style.height = background.naturalHeight + 'px';
      canvas.style.border = '1px solid black';

      //declare canvas
      const context = canvas.getContext('2d');

      context.drawImage(background, 0, 0);
      context.lineCap = 'round';
      context.strokeStyle = 'black';
      context.lineWidth = 5;
      contextRef.current = context;
      contextRef.current.lineWidth = 3;
      //draw shapes from data
      drawShape();
    };
  }

  //when user starts drawing shape
  const startDrawing = (xpoint, ypoint) => {
    //first drawing point
    if (currentPoints.length === 0) {
      //draw the starting point rectangle
      contextRef.current.strokeStyle = 'black';
      contextRef.current.beginPath();
      contextRef.current.moveTo(xpoint, ypoint);
      contextRef.current.rect(xpoint - 10, ypoint - 10, 20, 20);
      contextRef.current.stroke();
      contextRef.current.closePath();
      //set the starting point
      contextRef.current.beginPath();
      contextRef.current.moveTo(xpoint, ypoint);
      setStartPoint({ buildingId: props.buildingSelected.selectedBuildingId, xpoint, ypoint });
      setCurrentPoints([
        ...currentPoints,
        { buildingId: props.buildingSelected.selectedBuildingId, xpoint, ypoint },
      ]);
    } else {
      //last point
      //current point is the same as first point, 20px variance
      if (isFirstPoint(xpoint, ypoint)) {
        setCurrentPoints([...currentPoints, startPoint]);
        setlastPointValidation(true);
      } else {
        //draw next point
        contextRef.current.lineTo(xpoint, ypoint);
        setCurrentPoints([
          ...currentPoints,
          { buildingId: props.buildingSelected.selectedBuildingId, xpoint, ypoint },
        ]);
      }
      contextRef.current.stroke();
    }
  };

  const canvasOnClick = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    if (isDrawing) {
      //if drawing feature selected
      startDrawing(offsetX, offsetY);
    } else {
      //clicking on shape to get building details
      clickOnDrawing(offsetX, offsetY);
    }
  };
  const toggleIsDrawing = () => {
    setIsDrawing((prevState) => !prevState);
  };

  //check if current this point is the same as first point, 20px variance
  function isFirstPoint(xpoint, ypoint) {
    if (xpoint >= startPoint.xpoint - 10 && xpoint <= startPoint.xpoint + 10) {
      if (ypoint >= startPoint.ypoint - 10 && ypoint <= startPoint.ypoint + 10) {
        return true;
      }
    } else {
      return false;
    }
  }

  //check if shape is clicked
  function clickOnDrawing(xpoint, ypoint) {
    if (pointsList.length != 0) {
      for (var i = 0; i < pointsList.length; i++) {
        if (pointsList[i] && pointsList[i].shapePoints.length > 0) {
          var shape = pointsList[i].shapePoints;
          defineShape(shape);
          if (contextRef.current.isPointInPath(xpoint, ypoint)) {
            //emit building that is clicked
            props.setBuildingClicked({
              buildingId: pointsList[i].buildingId,
              building: pointsList[i].buildingName,
              restricted: pointsList[i].restricted,
            });
            setBuildingClicked(pointsList[i]);
            //set which shape is clicked on
            setShapeClicked(i);
            break;
          } else {
            props.setBuildingClicked({ building: '-', access: false });
            setBuildingClicked(null);
            setShapeClicked(-1);
          }
        }
      }
    }
  }

  //draw out shapes
  function drawShape() {
    if (pointsList.length != 0) {
      for (var i = 0; i < pointsList.length; i++) {
        if (pointsList[i] && pointsList[i].shapePoints.length > 0) {
          var shape = pointsList[i].shapePoints;
          defineShape(shape);
          if (pointsList[i].restricted) {
            contextRef.current.fillStyle = 'rgba(196, 77, 86, 0.3)';
          } else {
            contextRef.current.fillStyle = 'rgba(95, 29, 194, 0.3)';
          }
          contextRef.current.fill();
          if (i == shapeClicked) {
            //shape is clicked on
            contextRef.current.strokeStyle = 'yellow';
          } else {
            contextRef.current.strokeStyle = 'black';
          }
          contextRef.current.stroke();
          contextRef.current.closePath();
        }
      }
    }
  }

  //set up the shape object
  //used for drawing, or checking if click is on shape
  function defineShape(shape) {
    contextRef.current.beginPath();
    contextRef.current.moveTo(shape[0].xpoint, shape[0].ypoint);
    for (var k = 1; k < shape.length; k++) {
      contextRef.current.lineTo(shape[k].xpoint, shape[k].ypoint);
    }
  }

  const canvasToggleDrag = () => {
    canvasRef.current.classList.toggle('drag-cursor');
  };

  const buildingDetails = () => {
    if (buildingClicked != null) {
      history.push({ pathname: '../building', query: { building: buildingClicked.buildingId } });
    }
  };

  return (
    <>
      <canvas
        onClick={canvasOnClick}
        onDoubleClick={buildingDetails}
        onMouseDown={() => {
          if (!isDrawing) {
            canvasToggleDrag();
          }
        }}
        onMouseUp={() => {
          if (!isDrawing) {
            canvasToggleDrag();
          }
        }}
        ref={canvasRef}
      />
    </>
  );
};

export default SiteMap;

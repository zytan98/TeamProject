import React, { useEffect, useState } from 'react';
import { Line } from '@ant-design/charts';
import { Button, Card } from 'antd';
import './GraphCard.css';
import request from 'umi-request';

const GraphCard = (props) => {
  const [isGraphSettingModal, setIsGraphSettingModal] = useState(false);
  const [data, setData] = useState([]);
  const [average, setAverage] = useState({});
  const [ifExceedThreshold, setIfExceedthreshold] = useState(false);

  
  //This function gets sensor data by sensor type id
  //Props.sensorTypeid as params to pass to API
  //Props.sitePage determines if fetch by site or building with
  function getSensorDataBySensorType() {
    if (props.sitePage) {
      request('https://localhost:5001/api/SensorDatum/sensortype/', {
        method: 'get',
        suffix: props.sensorTypeId,
      }).then((response) => {
        setData(response);
      });
    } else {
      request('https://localhost:5001/api/SensorDatum/building/', {
        suffix: props.buildingId + '/' + props.sensorTypeId,
        method: 'get',
      }).then((response) => {
        setData(response);
      });
    }
  }

  //this function gets sensor average data by sensor type id
  //either by site or by building
  function getAverageSensorDataBySensorType() {
    if (props.sitePage) {
      request('https://localhost:5001/api/SensorDatum/average/sensortype/', {
        method: 'get',
        suffix: props.sensorTypeId,
      }).then((response) => {
        //if no sensor data yet
        if (!response) {
          setAverage(0);
        } else {
          setAverage(response.value.toFixed(2));
        }
      });
    } else {
      request('https://localhost:5001/api/SensorDatum/building/average/sensortype/', {
        method: 'get',
        suffix: props.buildingId + '/' + props.sensorTypeId,
      }).then((response) => {
        //if no sensor data yet
        if (!response) {
          setAverage(0);
        } else {
          setAverage(response.value.toFixed(2));
        }
      });
    }
  }
  function getThresholdBySensorId() {
    const latestSensorData = data[data.length - 1];
    request('https://localhost:5001/api/threshold/sensorid/', {
      suffix: latestSensorData.sensorid,
      method: 'get',
    }).then((response) => {
      //get the type
      response.forEach((threshold) => {
        if (threshold.typeid == props.sensorTypeId) {
          if (
            latestSensorData.value > threshold.upperthreshold ||
            latestSensorData.value < threshold.lowerthreshold
          ) {
            request('http://159.138.89.74:5001/api/notification/supervisor', {
              method: 'post',
              headers: {
                'Content-Type': 'application/json',
              },
              params: {
                message:
                  'Sensor: ' +
                  threshold.deveui +
                  ' has exceeded ' +
                  threshold.typeDescription +
                  ' threshold',
              },
            }).catch((error) => {
              console.log('error', error);
            });
          }
        }
      });
    });
  }
  function getGraphData() {
    //get sensor type data
    getSensorDataBySensorType();
    //get sensor type average
    getAverageSensorDataBySensorType();
  }
  useEffect(() => {
    if (props.sensorTypeId) {
      //get sensor type data
      getSensorDataBySensorType();
      //get sensor type average
      getAverageSensorDataBySensorType();
      //poll data every 5 second
      const interval = setInterval(() => getGraphData(), 5000);
      return () => clearInterval(interval);
    }
  }, [props.sensorTypeId]);
  useEffect(() => {
    if (data.length > 0) {
      getThresholdBySensorId();
    }
  }, [data]);

  const config = {
    xAxis: {
      text: 'time',
    },
    yAxis: {
      text: 'value',
    },
    data,
    xField: 'time',
    yField: 'value',
    point: {},
  };

  return (
    <>
      <Card className="graph-card">
        <div className="graph-card__body--title">
          {data.length > 0
            ? 'Average ' + props.description + ': ' + average
            : 'No data for ' + props.description}
        </div>
        <div className="graph-card__graph-wrapper">
          <Line {...config} />
        </div>
      </Card>
    </>
  );
};
export default GraphCard;

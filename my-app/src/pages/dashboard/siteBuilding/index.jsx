import { Row, Col, Button, Card } from 'antd';
import { Tabs } from 'antd';
import GraphCard from '../site/components/GraphCard/GraphCard';
import './index.css';
import SensorsTable from '../site/components/SensorTable/SensorTable';
import WorkersTable from '../site/components/WorkerTable/WorkerTable';
import { useEffect, useRef, useState } from 'react/cjs/react.development';
import { useLocation } from 'umi';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { history } from 'umi';
import request from 'umi-request';
import moment from 'moment';

const building = () => {
  const [numOfWorkers, setNumOfWorkers] = useState();
  const [graphShown, setgraphShown] = useState([
    'Temperature',
    'Humidity',
    'Rain',
    'Noise',
    'Wind',
  ]);
  const [buildingDetails, setBuildingDetails] = useState({});

  const { TabPane } = Tabs;
  const [sensorData, setSensorData] = useState();

  const tabContainer = useRef(null);
  const [tabContainerHeight, setTabContainerHeight] = useState();
  const [buildingId, setBuildingId] = useState();
  const location = useLocation();
  function getsensorData() {
    request('https://localhost:5001/api/Sensor/', {
      method: 'get',
      suffix: 'checksensorsbuilding/' + buildingId,
    }).then((response) => setSensorData(response));
  }

  //get sensor type and arrange display in order
  function getSensorTypes() {
    request('https://localhost:5001/api/Building/', {
      suffix: location.query.building,
      method: 'get',
    }).then((response) => {
      setBuildingDetails(response);
      request('https://localhost:5001/api/SensorType/worksite/', {
        suffix: response.worksiteId,
        method: 'get',
      }).then((response) => {
        if (response.length > 0) {
          var negativeList = [];
          var positiveList = [];
          for (var i = 0; i < response.length; i++) {
            if (response[i].display <= 0) {
              negativeList.push(response[i]);
            }
          }
          for (var i = 0; i < response.length; i++) {
            if (response[i].display > 0) {
              positiveList.push(response[i]);
            }
          }
          positiveList.sort(function (a, b) {
            return a.display - b.display;
          });
          negativeList.sort(function (a, b) {
            return b.display - a.display;
          });
          if (negativeList.length > 0) {
            setgraphShown(positiveList.concat(negativeList).slice(0, 5));
          } else {
            setgraphShown(positiveList.slice(0, 5));
          }
        } else {
          setgraphShown([]);
        }
      });
    });
  }
  useEffect(() => {
    const tabContainerHeight = tabContainer.current.clientHeight;
    setTabContainerHeight(tabContainerHeight);
  });
  useEffect(() => {
    setgraphShown([]);
    setBuildingId(location.query.building);
    getSensorTypes();
  }, []);
  useEffect(() => {
    if (buildingId) {
      getsensorData();
    }
  }, [buildingId]);

  //get the number of unique workers that is checked in today from selected building 
  useEffect(() => {
    request('https://localhost:5001/api/Worker/CheckInOut', {
      method: 'get',
      params: { checkInDate: moment().format('YYYY-MM-DD'), buildingId: buildingId },
    })
      .then((response) => {
        const unique = response
          .map((e) => e['id'])
          .map((e, i, final) => final.indexOf(e) === i && i)
          .filter((e) => response[e])
          .map((e) => response[e]);
        setNumOfWorkers(unique.length);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <>
      <div className="header">
        <Button
          icon={<ArrowLeftOutlined style={{ fontSize: '20px', color: '#000' }} />}
          type="link"
          onClick={() => {
            history.goBack();
          }}
        />
        <h1>{buildingDetails.buildingName} Details</h1>
      </div>

      <Row gutter={[0, 0]} flex className="dashboard-row dashboard-row--small">
        <Col span={19}>
          <div className="btm-graph-container">
            <div className="btm-graph-wrapper">
              {graphShown[0] ? (
                <GraphCard
                  sensorTypeId={graphShown[0].typeid}
                  sitePage={false}
                  buildingId={buildingId}
                  description={graphShown[0].description}
                  setRefresh={() => {
                    getSensorTypes();
                  }}
                />
              ) : (
                <Card className="graph-card--empty">No Sensor</Card>
              )}
            </div>
            <div className="btm-graph-wrapper">
              {graphShown[1] ? (
                <GraphCard
                  sensorTypeId={graphShown[1].typeid}
                  sitePage={false}
                  buildingId={buildingId}
                  description={graphShown[1].description}
                  setRefresh={() => {
                    getSensorTypes();
                  }}
                />
              ) : (
                <Card className="graph-card--empty">No Sensor</Card>
              )}
            </div>
            <div className="btm-graph-wrapper">
              {graphShown[2] ? (
                <GraphCard
                  sensorTypeId={graphShown[2].typeid}
                  sitePage={false}
                  buildingId={buildingId}
                  description={graphShown[2].description}
                  setRefresh={() => {
                    getSensorTypes();
                  }}
                />
              ) : (
                <Card className="graph-card--empty">No Sensor</Card>
              )}
            </div>
            <div className="btm-graph-wrapper">
              {graphShown[3] ? (
                <GraphCard
                  sensorTypeId={graphShown[3].typeid}
                  sitePage={false}
                  buildingId={buildingId}
                  description={graphShown[3].description}
                  setRefresh={() => {
                    getSensorTypes();
                  }}
                />
              ) : (
                <Card className="graph-card--empty">No Sensor</Card>
              )}
            </div>
          </div>
        </Col>
        <Col span={5}>
          <div className="btm-graph-wrapper">
            {graphShown[4] ? (
              <GraphCard
                sensorTypeId={graphShown[4].typeid}
                sitePage={false}
                buildingId={buildingId}
                description={graphShown[4].description}
                setRefresh={() => {
                  getSensorTypes();
                }}
              />
            ) : (
              <Card className="graph-card--empty">No Sensor</Card>
            )}
          </div>
        </Col>
      </Row>
      <Row gutter={[0, 0]} flex className="dashboard-row dashboard-row--large">
        <Col span={19}>
          <div className="container" ref={tabContainer}>
            <Tabs defaultActiveKey="1">
              <TabPane tab="Sensor" key="1">
                <SensorsTable sensorSource={sensorData} tabContainerHeight={tabContainerHeight} />
              </TabPane>
              <TabPane tab="Worker" key="2" className="workers-table-tab">
                <WorkersTable tabContainerHeight={tabContainerHeight} buildingId={buildingId} />
              </TabPane>
            </Tabs>
          </div>
        </Col>
        <Col span={5} className="card-container">
          <Card className="sensor-worker-card" title="Sensors Online">
            <p>{sensorData ? sensorData.length : 0}</p>
          </Card>
          <Card className="sensor-worker-card" title="Workers">
            <p>{numOfWorkers}</p>
          </Card>
          <Card
            title="Access"
            headStyle={
              buildingDetails.restricted
                ? { background: '#db1010', border: 0 }
                : { background: '#43c71b', border: 0 }
            }
            className="access-card"
          >
            {buildingDetails.restricted ? <p>Restricted</p> : <p>None</p>}
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default building;

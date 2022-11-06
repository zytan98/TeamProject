import { Row, Col, Button, Select, Card } from 'antd'
import './index.css'
import { useState, useEffect } from 'react'

import GraphCard from './components/GraphCard/GraphCard'
import Workers from './components/modals/WorkerTableModal'
import SensorsTableModal from './components/modals/SensorTableModal'
import Zoom from './components/SiteMap/zoom'
import GraphSettingModal from './components/GraphSetting/graphSettingModal'
import SensorConfiguration from './components/modals/SensorConfiguration'
import UploadImage from './components/SiteMap/uploadImage'
import { FundProjectionScreenOutlined, FundFilled } from '@ant-design/icons'
import request from 'umi-request'
import SiteImage from './components/SiteMap/siteImage'

import { afterAll } from 'lodash-decorators'
import moment from 'moment'

const dashboard = () => {
  const { Option } = Select
  const [isWorkerVisible, setisWorkerVisible] = useState(false)
  const [isSensorConfigurationVisible,setIsSensorConfigurationVisible] = useState(false)
  const [isSensorVisible, setisSensorVisible] = useState(false)
  const [isGraphSettingVisible, setIsGraphSettingVisible] = useState(false)
  const [selectProject, setSelectProject] = useState('Project_B')
  const [worksiteList, setWorksiteList] = useState([])
  const [sensorSource, setSensorSource] = useState()
  const [graphShown, setgraphShown] = useState([
    { id: '', description: 'Loading...' },
    { id: '', description: 'Loading...' },
    { id: '', description: 'Loading...' },
    { id: '', description: 'Loading...' },
  ])
  const [sortedGraphList, setSortedGraphList] = useState([])
  const [selectWorksite, setSelectWorksite] = useState()
  const [sensorData, setSensorData] = useState([])
  //get sensor data
  function getSensorSource () {
    request('https://localhost:5001/api/Sensor/checksensors/', {
      method: 'get',
      suffix: selectWorksite,
    }).then(response => {
      setSensorSource(response)
    })
  }
  const [workersSource, setWorkersSource] = useState()
  const [numOfWorkers, setNumOfWorkers] = useState()
  const [buildingId, setBuildingId] = useState([])

  //get worksite details
  function getWorkSiteDetails () {
    request('https://localhost:5001/api/Worksite', {
      method: 'get',
    }).then(response => {
      setWorksiteList(response)
      setSelectWorksite(response[0].worksiteId)
    })
  }

  //get sensor types and arrange in display order
  function getSensorConfigDetails () {
    if (selectWorksite) {
      request('https://localhost:5001/api/SensorType/worksite/', {
        method: 'get',
        suffix: selectWorksite,
      }).then(response => {
        if (response.length > 0) {
          var negativeList = []
          var positiveList = []
          for (var i = 0; i < response.length; i++) {
            if (response[i].display <= 0) {
              negativeList.push(response[i])
            }
          }
          for (var i = 0; i < response.length; i++) {
            if (response[i].display > 0) {
              positiveList.push(response[i])
            }
          }
          positiveList.sort(function (a, b) {
            return a.display - b.display
          })
          negativeList.sort(function (a, b) {
            return b.display - a.display
          })
          setgraphShown(positiveList)
          if (negativeList.length > 0) {
            setSortedGraphList(positiveList.concat(negativeList))
          } else {
            setSortedGraphList(positiveList)
          }
        } else {
          setSortedGraphList([])
          setgraphShown([])
        }
      })
    }
  }
  useEffect(() => {
    getWorkSiteDetails()
    getSensorConfigDetails()
  }, [])
  useEffect(() => {
    if (selectWorksite) {
      getSensorConfigDetails()
      getSensorSource()
    }
  }, [selectWorksite])

  //get all the building that is in the selected worksite 
  useEffect(() => {
    if (selectWorksite) {
      request('https://localhost:5001/api/Building', {
        method: 'get',
        suffix: '/worker/' + selectWorksite,
      })
        .then(response => {
          const buildingid = []
          for (var i = 0; i < response.length; i++) {
            buildingid.push(response[i].buildingId)
          }
          setBuildingId(buildingid)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [selectWorksite])


  //get the number of unique workers that is checked in today from selected worksite 
  useEffect(() => {
    const workerSource = []
    for (var i = 0; i < buildingId.length; i++) {
      request('https://localhost:5001/api/Worker/CheckInOut', {
        method: 'get',
        params: { checkInDate: moment().format('YYYY-MM-DD'), buildingId: buildingId[i] },
      })
        .then(response => {
          for (var i = 0; i < response.length; i++) {
            const workerid = response[i].id
            const buildingid = response[i].buildingId
            workerSource.push({
              workerId: workerid,
              buildingId: buildingid,
            })
          }

          const unique = workerSource
            .map(e => e['workerId'])
            .map((e, i, final) => final.indexOf(e) === i && i)
            .filter(e => workerSource[e])
            .map(e => workerSource[e])

          setNumOfWorkers(unique.length)
        })
        .catch(error => {
          console.log(error)
        })
    }
  }, [buildingId])

  return (
    <>
      <GraphSettingModal
        isGraphSettingVisible={isGraphSettingVisible}
        setIsGraphSettingVisible={setIsGraphSettingVisible}
        sortedGraphList={sortedGraphList}
        setRefresh={() => {
          getSensorConfigDetails()
        }}
      />
      <SensorConfiguration
        sortedGraphList={sortedGraphList}
        isSensorConfigurationVisible={isSensorConfigurationVisible}
        setIsSensorConfigurationVisible={setIsSensorConfigurationVisible}
        selectWorksite={selectWorksite}
        sensorSource={sensorSource}
        getSensorSource={getSensorSource}
        getSensorConfigDetails={getSensorConfigDetails}
      />
      {' '}
      <div className='dashboard-header'>
        <Select
          style={{ width: 300 }}
          value={selectWorksite}
          onChange={e => {
            setSelectWorksite(e)
          }}
        >
          {worksiteList.length > 0 &&
            worksiteList.map((worksite, index) => (
              <Option key={index} value={worksite.worksiteId}>
                {worksite.worksiteName}
              </Option>
            ))}
        </Select>
        <div className='graph-setting-btn-wrapper'>
          <Button
          onClick={() => {
            setIsSensorConfigurationVisible(true)
          }}
          >
            Sensor Configuration
          </Button>
          <Button
            onClick={() => {
              setIsGraphSettingVisible(true)
            }}
          >
            {isGraphSettingVisible ? <FundFilled /> : <FundProjectionScreenOutlined />}
          </Button>
        </div>
      </div>
      <Row gutter={[0, 0]} className='dashboard-row dashboard-row--large'>
        <Col span={19}>
          <SiteImage selectWorksite={selectWorksite} />
        </Col>
        <Col span={5}>
          {graphShown[0] ? (
            <GraphCard
              sensorTypeId={graphShown[0].typeid}
              sitePage={true}
              description={graphShown[0].description}
              setRefresh={() => {
                getSensorConfigDetails()
              }}
            />
          ) : (
            <Card className='graph-card--empty'>No Sensor</Card>
          )}
        </Col>
      </Row>
      <Row gutter={[0, 0]} className='dashboard-row dashboard-row--small'>
        <Col span={19}>
          <div className='btm-graph-container'>
            <div className='btm-graph-wrapper'>
              {graphShown[1] ? (
                <GraphCard
                  sensorTypeId={graphShown[1].typeid}
                  sitePage={true}
                  description={graphShown[1].description}
                  setRefresh={() => {
                    getSensorConfigDetails()
                  }}
                />
              ) : (
                <Card className='graph-card--empty'>No Sensor</Card>
              )}
            </div>
            <div className='btm-graph-wrapper'>
              {graphShown[2] ? (
                <GraphCard
                  sensorTypeId={graphShown[2].typeid}
                  sitePage={true}
                  description={graphShown[2].description}
                  setRefresh={() => {
                    getSensorConfigDetails()
                  }}
                />
              ) : (
                <Card className='graph-card--empty'>No Sensor</Card>
              )}
            </div>
            <div className='btm-graph-wrapper'>
              {graphShown[3] ? (
                <GraphCard
                  sensorTypeId={graphShown[3].typeid}
                  sitePage={true}
                  description={graphShown[3].description}
                  setRefresh={() => {
                    getSensorConfigDetails()
                  }}
                />
              ) : (
                <Card className='graph-card--empty'>No Sensor</Card>
              )}
            </div>
          </div>
        </Col>
        <Col span={5}>
          <div className='button-container'>
            <Button
              onClick={() => {
                setisSensorVisible(true)
              }}
            >
              <div className='button-title'>Sensors Online</div>
              <div className='button-text'>{sensorSource ? sensorSource.length : 0}</div>
            </Button>
            <SensorsTableModal
              isSensorVisible={isSensorVisible}
              setisSensorVisible={setisSensorVisible}
              sensorSource={sensorSource}
            />
            <Button
              onClick={() => {
                setisWorkerVisible(true)
              }}
            >
              <div className='button-title'>Workers</div>
              <div className='button-text'>{numOfWorkers}</div>
            </Button>
            <Workers
              isWorkerVisible={isWorkerVisible}
              setisWorkerVisible={setisWorkerVisible}
              workersSource={workersSource}
              buildingId={buildingId}
            />
          </div>
        </Col>
      </Row>
    </>
  )
}

export default dashboard

import { useState, useEffect } from 'react'
import { Calendar, Select, Button, Space, Input, Card, message } from 'antd'
import { SettingOutlined, ToolOutlined, PlusCircleOutlined } from '@ant-design/icons'
import './index.css'
import MissedMaintenance from './components/modals/MissedMaintenance/MissedMaintenance'
import MaintenanceSettingModal from './components/modals/MaintenanceSetting/MaintenanceSettingModal'
import NewMaintenanceCalander from './components/modals/NewMaintenanceCalander/NewMaintenanceCalander'
import MaintenanceTable from './components/MaintenanceTable/MaintenanceTable'
import request from 'umi-request'
import moment from 'moment'
import SearchID from './components/modals/SearchID/SearchID'

const maintenance = () => {
  const [isMissedVisible, setisMissedVisible] = useState(false)
  const [isMaintenanceSettingModal, setIsMaintenanceSettingModal] = useState(false)
  const [isTableVisible, setisTableVisible] = useState(false)
  const [selectedDate, setSelectedDate] = useState()
  const [searchSensorData, setSearchSensorData] = useState()
  const [isSearchVisible, setisSearchVisible] = useState(false)
  const [isNewMaintenanceCalanderVisible, setIsNewMaintenanceCalanderVisible] = useState(false)
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())
  const [selectProject, setSelectProject] = useState()
  const [presetInfo, setPresetInfo] = useState('')
  const [maintenanceInfo, setMaintenanceInfo] = useState()
  const [missedSource, setMissedSource] = useState()
  const [sensorName, setSensorName] = useState()
  const [worksiteList, setWorksiteList] = useState([])
  const [sensorSource, setSensorSource] = useState([])
  let missedMaintenanceAmount = 0

  useEffect(() => {
    function handleResize () {
      setWindowDimensions(getWindowDimensions())
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  function getSensorSource () {
    request('https://localhost:5001/api/Sensor/checksensors/', {
      method: 'get',
      suffix: selectProject,
    }).then(response => {
      setSensorSource(response)
    })
  }
  // gets the preset value that is used to add onto the maintenance date
  // if it's completed for the next maintenance
  const settingPresetInfo = () => {
    request('https://localhost:5001/api/MaintenanceConfig', {
      method: 'get',
      suffix: '/preset/' + selectProject,
    }).then(response => {
      setPresetInfo(response.maintenanceConfigValue)
    })
  }
  // gets all maintenance according to the worksite
  const allMaintenance = () => {
    request('https://localhost:5001/api/Maintenance', {
      method: 'get',
      suffix: '/searchproject/' + selectProject,
    }).then(response => {
      setMaintenanceInfo(response)
    })
  }
  // gets all missed maintenance according to the worksite
  const getMissed = () => {
    request('https://localhost:5001/api/Maintenance', {
      method: 'get',
      suffix: '/search/missed/' + selectProject,
    }).then(response => {
      setMissedSource(response)
    })
  }
  // gets all worksites
  function getWorkSiteDetails () {
    request('https://localhost:5001/api/Worksite', {
      method: 'get',
    }).then(response => {
      setWorksiteList(response)
    })
  }
  useEffect(() => {
    getWorkSiteDetails()
  }, [])
  useEffect(() => {
    if (worksiteList.length != 0) {
      let worklist = worksiteList[0]
      setSelectProject(worklist.worksiteId)
    }
  }, [worksiteList])
  useEffect(() => {
    if (selectProject) {
      allMaintenance()
      settingPresetInfo()
      getMissed()
      getSensorSource()
    }
  }, [selectProject])

  function getWindowDimensions () {
    const { innerWidth: width, innerHeight: height } = window
    return {
      width,
      height,
    }
  }
  function getListData (value) {
    let status = [{ type: 'completed' }]
    var hasMaintenance = false
    if (maintenanceInfo != null) {
      for (let i = 0; i < maintenanceInfo.length; i++) {
        if (moment(maintenanceInfo[i].startDate).format('L') == value.format('L')) {
          hasMaintenance = true
          if (maintenanceInfo[i].completed == false) {
            if (moment().isAfter(maintenanceInfo[i].startDate, 'day')) {
              status = [{ type: 'missed' }]
              return status
            } else {
              status = [{ type: 'future' }]
            }
          }
        }
      }
      if (hasMaintenance) {
        return status
      } else {
        return []
      }
    }
  }
  function dateCellRender (value) {
    const listData = getListData(value)
    if (maintenanceInfo != null) {
      return (
        <ul className='events'>
          {listData.map((item, index) => (
            <li key={index}>
              {item.type == 'missed' && (
                <Button
                  shape='round'
                  type='primary'
                  size='small'
                  danger
                  className='button--visible'
                  onClick={() => {
                    setisTableVisible(true)
                  }}
                />
              )}
              {item.type == 'completed' && (
                <Button
                  shape='round'
                  type='primary'
                  size='small'
                  className='button--visible button--success'
                  onClick={() => {
                    setisTableVisible(true)
                  }}
                />
              )}
              {item.type == 'future' && (
                <ToolOutlined
                  style={{ fontSize: 25 }}
                  onClick={() => {
                    setisTableVisible(true)
                  }}
                />
              )}
            </li>
          ))}
        </ul>
      )
    }
  }
  // removing the unnecessary info from the ISO date string
  function onSelect (value) {
    //const selectedDate = new Date(value).toISOString().substring(0, 10)
    let selectedDate = new Date(value)
    selectedDate = new Date(selectedDate.setHours(8))
    selectedDate = selectedDate.toISOString().substring(0, 10)
    setSelectedDate(selectedDate)
  }
  // returns all maintenance info of the sensor deveui that is searched
  const onSearch = sensorname => {
    request('https://localhost:5001/api/Maintenance', {
      method: 'get',
      suffix: '/search/' + sensorname + '/' + selectProject,
    })
      .then(data => {
        setSensorName(sensorname)
        setSearchSensorData(data)
        setisSearchVisible(true)
      })
      .catch(() => {
        message.error('No maintenance is found for this sensor!')
      })
  }
  const { Search } = Input
  if (missedSource) {
    missedMaintenanceAmount = missedSource.length
  }
  return (
    <>
      <Card>
        <div className='maintenance-header-wrapper'>
          <h2>Maintenance</h2>{' '}
          <Select
            value={selectProject}
            defaultActiveFirstOption={true}
            style={{ width: 300, float: 'left' }}
            onChange={e => {
              setSelectProject(e)
            }}
          >
            {worksiteList.map((worksite, index) => (
              <Select.Option key={worksite.worksiteId} value={worksite.worksiteId}>
                {worksite.worksiteName}
              </Select.Option>
            ))}
          </Select>
          <Space>
            <Button
              style={{ visibility: missedMaintenanceAmount > 0 ? 'visible' : 'hidden', float: '' }}
              type='primary'
              shape='round'
              danger
              onClick={() => {
                setisMissedVisible(true)
              }}
            >
              Missed: {missedMaintenanceAmount}
            </Button>
            <Button
              type='primary'
              shape='round'
              onClick={() => {
                setIsNewMaintenanceCalanderVisible(true)
              }}
            >
              {windowDimensions.width > 1320 ? 'Schedule a new maintenance' : 'Schedule'}
              <PlusCircleOutlined />
            </Button>
            <Button
              shape='round'
              onClick={() => {
                setIsMaintenanceSettingModal(!isMaintenanceSettingModal)
              }}
            >
              {windowDimensions.width > 1320 ? ' Preset next maintenance duration' : 'Preset'}
              <SettingOutlined />
            </Button>
            <Search
              placeholder='Search Deveui'
              onSearch={onSearch}
              style={{ width: windowDimensions.width > 1320 ? '250px' : '150px' }}
            />
          </Space>
        </div>
        <Calendar dateCellRender={dateCellRender} onSelect={onSelect} />
      </Card>
      <MaintenanceTable
        isTableVisible={isTableVisible}
        setisTableVisible={setisTableVisible}
        selectedDate={selectedDate}
        presetInfo={presetInfo}
        getMissed={getMissed}
        allMaintenance={allMaintenance}
        selectProject={selectProject}
        sensorSource={sensorSource}
      />
      <MaintenanceSettingModal
        isMaintenanceSettingModal={isMaintenanceSettingModal}
        setIsMaintenanceSettingModal={setIsMaintenanceSettingModal}
        selectProject={selectProject}
        settingPresetInfo={settingPresetInfo}
      />
      <MissedMaintenance
        isMissedVisible={isMissedVisible}
        setisMissedVisible={setisMissedVisible}
        missedSource={missedSource}
        getMissed={getMissed}
        allMaintenance={allMaintenance}
      />
      <NewMaintenanceCalander
        isNewMaintenanceCalanderVisible={isNewMaintenanceCalanderVisible}
        setIsNewMaintenanceCalanderVisible={setIsNewMaintenanceCalanderVisible}
        allMaintenance={allMaintenance}
        selectProject={selectProject}
        sensorSource={sensorSource}
      />
      <SearchID
        setisSearchVisible={setisSearchVisible}
        isSearchVisible={isSearchVisible}
        searchSensorData={searchSensorData}
        presetInfo={presetInfo}
        allMaintenance={allMaintenance}
        onSearch={onSearch}
        sensorName={sensorName}
      />
    </>
  )
}

export default maintenance

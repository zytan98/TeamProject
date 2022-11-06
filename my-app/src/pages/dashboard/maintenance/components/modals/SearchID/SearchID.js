import { Modal, Table, Button } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, HistoryOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import SetDate from '../SetDate/SetDate'
import moment from 'moment'
import ConfirmationModal from '../ConfirmationModal/ConfirmationModal'

const SearchID = props => {
  const [isSetDateVisible, setisSetDateVisible] = useState(false)
  const [sensorID, setsensorID] = useState()
  const [startDate,setStartDate] = useState()
  const [newDate, setNewDate] = useState()
  const [responsible, setResponsible] = useState()
  const [maintenanceID,setmaintenanceID] = useState()
  const [isConfirmVisible, setisConfirmVisible] = useState(false)
  let duration = ''
  let timeType = ''
  let addedDate = ''
  let ConfigValueArray = ''
  let monthsetted = ''
  let functioncheck = 'search'
  useEffect(()=>{
    ConfigValueArray = props.presetInfo.split(' ')
    duration = parseInt(ConfigValueArray[0])
    timeType = ConfigValueArray[1]
  },[props.presetInfo])
  if(props.presetInfo){
    ConfigValueArray = props.presetInfo.split(' ')
    duration = parseInt(ConfigValueArray[0])
    timeType = ConfigValueArray[1]
  }
  // Add preset value to the date provided in the function, 
  //adds additional 8 hours due to a bug which removes 8 h from the correct value
  const calculateNextDate = date => {
    addedDate = new Date(date)
    if (timeType == 'Month') {
      monthsetted = new Date(addedDate.setMonth(addedDate.getMonth() + duration))
    } else if (timeType == 'Year') {
      monthsetted = new Date(addedDate.setFullYear(addedDate.getFullYear() + duration))   
    } else {
      monthsetted = new Date(addedDate.setDate(addedDate.getDate() + duration))     
    }
    setNewDate(new Date(monthsetted.setHours(8)))
  }
  const maintenance_columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Schedule Start Date',
      dataIndex: 'startDate',
      key: 'startDate',
      render: value => {
        return new Date(value).toLocaleDateString('en-GB')
      },
    },
    {
      title: 'Responsible',
      dataIndex: 'responsible',
      key: 'responsible',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',   
    },
    {
      title: 'Completed',
      dataIndex: 'completed',
      key: 'completed',
      render: (_, record) => {
        if (record.completed == true) {
          return (
            <CheckCircleOutlined
              style={{
                fontSize: 30,
                color: 'green',
              }}
            />
          )
        } else if (record.completed == false && moment().isAfter(record.startDate, 'day')) {
          return (
            <Button
              onClick={() => {
                setsensorID(record.sensorid)
                setResponsible(record.responsible)
                setmaintenanceID(record.id)
                setisSetDateVisible(true)
              }}
              icon={<HistoryOutlined />}
            />
          )
        } else {
          return (
            <Button
              type='text'
              shape='circle'
              onClick={() => {
                setsensorID(record.sensorid)
                setResponsible(record.responsible)
                setmaintenanceID(record.id)
                setStartDate(record.startDate)
                calculateNextDate(record.startDate)
                setisConfirmVisible(true)
              }}
              icon={
                <CloseCircleOutlined
                  style={{
                    fontSize: 30,
                    color: 'red',
                  }}
                />
              }
            />
          )
        }
      },
    },
  ]
  return (
    <>
      <Modal
        title='Search Results'
        visible={props.isSearchVisible}
        onOk={() => {
          props.setisSearchVisible(false)
        }}
        onCancel={() => {
          props.setisSearchVisible(false)
        }}
        width={1000}
      >
        <Table rowKey="id" dataSource={props.searchSensorData} columns={maintenance_columns} pagination={6} title={()=><b><h1>{props.sensorName}</h1></b>}/>
      </Modal>
      <ConfirmationModal
        isConfirmVisible={isConfirmVisible}
        setisConfirmVisible={setisConfirmVisible}
        sensorID={sensorID}
        presetInfo={props.presetInfo}
        responsible={responsible}
        maintenanceID={maintenanceID}
        newDate={newDate}
        startDate={startDate}
        onSearch={props.onSearch}
        functioncheck={functioncheck}
        allMaintenance={props.allMaintenance}
        sensorName={props.sensorName}
      />
      <SetDate
        isSetDateVisible={isSetDateVisible}
        setisSetDateVisible={setisSetDateVisible}
        sensorID={sensorID}
        responsible={responsible}
        maintenanceID={maintenanceID}
        onSearch={props.onSearch}
        functioncheck={functioncheck}
        allMaintenance={props.allMaintenance}
        sensorName={props.sensorName}
      />
    </>
  )
}

export default SearchID

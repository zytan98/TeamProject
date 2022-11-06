import { useEffect, useState } from 'react'
import './MaintenanceTable.css'
import {
  PlusCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  HistoryOutlined,
} from '@ant-design/icons'
import { Row, Col, Button, Modal, Card } from 'antd'
import { Table } from 'antd'
import SetDate from '../modals/SetDate/SetDate'
import NewMaintenanceCalander from '../modals/NewMaintenanceCalander/NewMaintenanceCalander'
import moment from 'moment'
import ConfirmationModal from '../modals/ConfirmationModal/ConfirmationModal'
import request from 'umi-request'

const Maintenancetable = props => {
  const [isSetDateVisible, setisSetDateVisible] = useState(false)
  const [sensorID, setsensorID] = useState()
  const [sensorName, setsensorName] = useState()
  const [isConfirmVisible, setisConfirmVisible] = useState(false)
  const [isNewMaintenanceCalanderVisible, setIsNewMaintenanceCalanderVisible] = useState(false)
  const [selectedDateSource, setSelectedDateSource] = useState()
  const [startDate, setStartDate] = useState()
  const [newDate, setNewDate] = useState()
  const [responsible, setResponsible] = useState()
  const [maintenanceID, setmaintenanceID] = useState()
  let duration = ''
  let timeType = ''
  let addedDate = ''
  let ConfigValueArray = ''
  let monthsetted = ''
  let functioncheck = 'table'

  useEffect(() => {
    ConfigValueArray = props.presetInfo.split(' ')
    duration = parseInt(ConfigValueArray[0])
    timeType = ConfigValueArray[1]
  }, [props.presetInfo])
  if (props.presetInfo) {
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

  //gets all maintenance that occurs on that date according to the worksite
  const getMaintenanceonDate = () => {
    if (props.selectedDate) {
      let senddate = new Date(props.selectedDate)
      let year = senddate.getFullYear()
      let month = senddate.getMonth() + 1
      let day = senddate.getDate()
      request('https://localhost:5001/api/Maintenance', {
        method: 'get',
        suffix: '/search/' + year + '/' + month + '/' + day + '/' + props.selectProject,
      }).then(response => {
        setSelectedDateSource(response)
      })
    }
  }
  useEffect(()=>{
    getMaintenanceonDate()
  },[props.isTableVisible])
  useEffect(() => {
    getMaintenanceonDate()
  }, [props.selectedDate])
  useEffect(() => {
    getMaintenanceonDate()
  }, [props.selectProject])
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
      title: 'Deveui',
      dataIndex: 'deveui',
      key: 'deveui',
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
                setsensorName(record.deveui)
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
                setsensorName(record.deveui)
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
  const [completedCount, setCompletedCount] = useState()
  const [notDoneCount, setNotDoneCount] = useState()
  const [totalCount, setTotalCount] = useState()

  useEffect(() => {
    if (selectedDateSource) {
      const completed = selectedDateSource.filter(item => item.completed == true)
      setCompletedCount(completed.length)

      const notDone = selectedDateSource.filter(item => item.completed == false)
      setNotDoneCount(notDone.length)

      setTotalCount(selectedDateSource.length)
    }
  }, [selectedDateSource])

  return (
    <>
      <Modal
        zIndex={3}
        visible={props.isTableVisible}
        onOk={() => {
          props.setisTableVisible(false)
        }}
        onCancel={() => {
          props.setisTableVisible(false)
        }}
        width={900}
        cancelButtonProps={{ style: { display: 'none' } }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <h1>{props.selectedDate}</h1>
        <Row>
          <Col span={20}>
            <Card className='Maintenance-summary-card'>
              <div className='Maintenance-summary'>
                <div>Not Done: {notDoneCount}</div>
                <div>Completed: {completedCount}</div>
                <div>Total: {totalCount}</div>
              </div>
            </Card>
          </Col>
          <Col span={2} offset={2}>
            <Button
              disabled={moment(props.selectedDate) < moment().startOf('day') ? true : false}
              type='primary'
              shape='round'
              onClick={() => {
                setIsNewMaintenanceCalanderVisible(true)
              }}
              style={{ float: 'right' }}
            >
              New Maintenance <PlusCircleOutlined />
            </Button>
          </Col>
        </Row>

        <Table
          style={{
            marginTop: 20,
          }}
          dataSource={selectedDateSource}
          columns={maintenance_columns}
          pagination={{
            pageSize: 6,
          }}
          rowKey='id'
        />
      </Modal>
      <ConfirmationModal
        isConfirmVisible={isConfirmVisible}
        setisConfirmVisible={setisConfirmVisible}
        sensorID={sensorID}
        sensorName={sensorName}
        presetInfo={props.presetInfo}
        responsible={responsible}
        maintenanceID={maintenanceID}
        newDate={newDate}
        startDate={startDate}
        getMaintenanceonDate={getMaintenanceonDate}
        functioncheck={functioncheck}
        allMaintenance={props.allMaintenance}
      />
      <SetDate
        isSetDateVisible={isSetDateVisible}
        setisSetDateVisible={setisSetDateVisible}
        sensorName={sensorName}
        sensorID={sensorID}
        getMissed={props.getMissed}
        responsible={responsible}
        maintenanceID={maintenanceID}
        getMaintenanceonDate={getMaintenanceonDate}
        functioncheck={functioncheck}
        allMaintenance={props.allMaintenance}
      />
      <NewMaintenanceCalander
        isNewMaintenanceCalanderVisible={isNewMaintenanceCalanderVisible}
        setIsNewMaintenanceCalanderVisible={setIsNewMaintenanceCalanderVisible}
        selectedDate={props.selectedDate}
        getMaintenanceonDate={getMaintenanceonDate}
        functioncheck={functioncheck}
        sensorSource={props.sensorSource}
        allMaintenance={props.allMaintenance}
      />
    </>
  )
}

export default Maintenancetable

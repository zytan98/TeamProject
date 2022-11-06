import { HistoryOutlined } from '@ant-design/icons'
import { ModalForm } from '@ant-design/pro-form'
import ProTable from '@ant-design/pro-table'
import { useState } from 'react'
import { Button } from 'antd'
import SetDate from '../SetDate/SetDate'

const MissedMaint = props => {
  const [isSetDateVisible, setisSetDateVisible] = useState(false)
  const [sensorID, setsensorID] = useState()
  const [sensorName, setsensorName] = useState()
  const [responsible, setResponsible] = useState()
  const [maintenanceID,setmaintenanceID] = useState()
  let functioncheck = 'missed'
  const missedcolumns = [
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
      sorter: (a, b) => a.deveui.localeCompare(b.deveui),
    },
    {
      title: 'Responsible',
      dataIndex: 'responsible',
      key: 'responsible',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.responsible.localeCompare(b.responsible),
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      defaultSortOrder: 'descend',
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'x',
      render: (_, record) => (
        <Button
          onClick={() => {
            setsensorID(record.sensorid)
            setsensorName(record.deveui)
            setResponsible(record.responsible)
            setmaintenanceID(record.id)
            setisSetDateVisible(true)
          }}
          icon={<HistoryOutlined />}
        />
      ),
    },
  ]
  return (
    <>
      <ModalForm
        title='Missed Maintenance'
        submitter={false}
        visible={props.isMissedVisible}
        modalProps={{
          centered: true,
          onCancel: () => {
            props.setisMissedVisible(false)
          },
        }}
      >
        <ProTable
          search={false}
          toolBarRender={false}
          dataSource={props.missedSource}
          columns={missedcolumns}
          pagination={{
            pageSize: 6,
            simple: true,
          }}
          rowKey='id'
        />
      </ModalForm>
      <SetDate
        isSetDateVisible={isSetDateVisible}
        setisSetDateVisible={setisSetDateVisible}
        sensorName={sensorName}
        sensorID={sensorID}
        responsible={responsible}
        maintenanceID={maintenanceID}
        getMissed={props.getMissed}
        functioncheck={functioncheck}
        allMaintenance={props.allMaintenance}
      />
    </>
  )
}

export default MissedMaint

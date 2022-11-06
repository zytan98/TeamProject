import { Modal } from 'antd'
import { useEffect, useState } from 'react'
import request from 'umi-request'

const ConfirmationModal = props => {
  let newmaintdate = new Date(props.newDate).toLocaleDateString('en-GB')
  return (
    <Modal
      centered
      visible={props.isConfirmVisible}
      onOk={() => {
        request('https://localhost:5001/api/Maintenance', {
          method: 'post',
          data: {
            startDate: props.newDate,
            responsible: props.responsible,
            completed: false,
            sensorID: props.sensorID,
          },
        })
        request('https://localhost:5001/api/Maintenance', {
          method: 'put',
          suffix: '/' + props.maintenanceID,
          data: {
            id: props.maintenanceID,
            startDate: props.startDate,
            completed: true,
            responsible: props.responsible,
            sensorid: props.sensorID,
          },
        }).then(() => {
          if (props.functioncheck == 'table') {
            props.getMaintenanceonDate()
          } else {
            props.onSearch(props.sensorName)
          }
          props.allMaintenance()
          props.setisConfirmVisible(false)
        })
      }}
      onCancel={() => {
        props.setisConfirmVisible(false)
      }}
    >
      <p style={{ textAlign: 'center' }}>
        <b>Complete Maintenance?</b>
      </p>
      <p style={{ textAlign: 'center' }}>
        Next Maintenance date for <b>{props.sensorName}</b> is on <b>{newmaintdate}</b>
      </p>
    </Modal>
  )
}

export default ConfirmationModal

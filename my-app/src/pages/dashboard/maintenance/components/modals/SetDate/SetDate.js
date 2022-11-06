import { Form, Modal, DatePicker } from 'antd'
import { useState } from 'react'
import moment from 'moment'
import request from 'umi-request'

const SetDate = props => {
  const [form] = Form.useForm()
  const [isConfirmVisible, setisConfirmVisible] = useState(false)
  const [newDate, setnewDate] = useState()

  //disables all dates that were past today
  function disabledDate (current) {
    return current && current < moment().add(-1, 'days')
  }
  return (
    <>
      <Modal
        title='Set New Maintenance Date'
        visible={props.isSetDateVisible}
        centered
        onOk={() => {
          form.validateFields().then(values => {
            request('https://localhost:5001/api/Maintenance', {
              method: 'put',
              suffix: '/' + props.maintenanceID,
              data: {
                id: props.maintenanceID,
                startDate: moment(values.date).add(8, 'hours'),
                completed: false,
                responsible: props.responsible,
                sensorid: props.sensorID,
              },
            }).then(() => {
              setnewDate(
                values.date.format('YYYY-MM-DD'),
              )
              setisConfirmVisible(true)
              form.resetFields()
              props.setisSetDateVisible(false)
            })
          })
        }}
        onCancel={() => {
          form.resetFields()
          props.setisSetDateVisible(false)
        }}
      >
        <Form form={form}>
          <Form.Item name='date' rules={[{ required: true, message: 'Date is required' }]}>
            <DatePicker disabledDate={disabledDate} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title='New Maintenance Date set'
        visible={isConfirmVisible}
        onOk={() => {
          if(props.functioncheck=='table'){
            props.getMaintenanceonDate()
            props.getMissed()
          }else if(props.functioncheck=='search'){
            props.onSearch(props.sensorName)
          }else{
            props.getMissed()
          }
          props.allMaintenance()
          setisConfirmVisible(false)
        }}
        onCancel={() => {
          props.onSearch(props.sensorName)
          setisConfirmVisible(false)
        }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>Next Maintenance Date has been set for</p>
        <p>
          <b>{props.sensorName}</b>
        </p>
        <p>
          Start: <b>{newDate}</b>
        </p>
      </Modal>
    </>
  )
}

export default SetDate

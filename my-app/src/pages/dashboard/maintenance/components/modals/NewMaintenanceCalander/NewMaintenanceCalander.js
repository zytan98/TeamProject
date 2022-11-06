import { useState, useRef, useEffect } from 'react'
import { Modal, DatePicker, Form, Input, Button, message, Select } from 'antd'
import moment from 'moment'
import request from 'umi-request'

const NewMaintenanceCalander = props => {
  const [isConfirmVisible, setisConfirmVisible] = useState(false)
  const [selectSensor, setSelectSensor] = useState()
  const [newMaintenance, setnewMaintenance] = useState({
    date: '',
    sensorid: 0,
    sensorname: '',
    location: '',
    responsible: '',
    remarks: '',
  })

  const { TextArea } = Input
  const [form] = Form.useForm()

  useEffect(() => {
    form.setFieldsValue({
      dateInitialised: moment(props.selectedDate, dateFormat),
    })
  }, [props.selectedDate])
  const dateFormat = 'YYYY/MM/DD'
  //disable all dates
  function disabledDateEvery (current) {
    return current
  }
  //disable all dates past today
  function disabledDate (current) {
    return current && current < moment().add(-1, 'days')
  }
  return (
    <>
      <Modal
        title='New Maintenance'
        visible={props.isNewMaintenanceCalanderVisible}
        forceRender={true}
        onOk={() => {
          form
            .validateFields()
            .then(values => {
              if (props.selectedDate) {
                setnewMaintenance({
                  date: moment(values.dateInitialised).format('YYYY/MM/DD'),
                  sensorid: selectSensor,
                  responsible: values.responsible,
                  remarks: values.remarks,
                })
              } else {
                setnewMaintenance({
                  date: moment(values.date).format('YYYY/MM/DD'),
                  sensorid: selectSensor,
                  responsible: values.responsible,
                  remarks: values.remarks,
                })
              }
              setisConfirmVisible(true)
            })
            .catch(e => {
              message.error('Please enter into the required fields!')
            })
        }}
        onCancel={() => {
          props.setIsNewMaintenanceCalanderVisible(false)
          if (props.selectedDate) {
            form.resetFields(['sensorname', 'responsible', 'remarks'])
          } else {
            form.resetFields()
          }
        }}
      >
        <Form form={form} layout='horizontal' initialValues={{}}>
          {props.selectedDate && (
            <Form.Item label='Dates' name='dateInitialised'>
              <DatePicker disabledDate={disabledDateEvery} format={dateFormat} />
            </Form.Item>
          )}
          {!props.selectedDate && (
            <Form.Item label='Dates' name='date'>
              <DatePicker disabledDate={disabledDate} />
            </Form.Item>
          )}
          <Form.Item
            name='sensorname'
            label='Deveui'
            rules={[{ required: true, message: 'Please enter the Deveui!' }]}
          >
            <Select
              style={{ width: 300 }}
              onChange={e => {
                console.log(e)
                setSelectSensor(e)
              }}
            >
              {props.sensorSource.length > 0 &&
                props.sensorSource.map((sensor, index) => (
                  <Select.Option key={index} value={sensor.sensorid}>
                    {sensor.deveui}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>{' '}
          <Form.Item
            name='responsible'
            label='Responsible'
            rules={[{ required: true, message: 'Please enter who is reponsible!' }]}
          >
            <Input />
          </Form.Item>{' '}
          <Form.Item name='remarks' label='Remarks'>
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title='New Maintenance set'
        visible={isConfirmVisible}
        onOk={() => {
          form.validateFields().then(values => {
            if (props.selectedDate) {
              request('https://localhost:5001/api/Maintenance', {
                method: 'post',
                data: {
                  startdate: moment(values.dateInitialised).add(8, 'hours'),
                  responsible: values.responsible,
                  remarks: values.remarks,
                  completed: false,
                  sensorid: newMaintenance.sensorid,
                },
              }).then(() => {
                if (props.functioncheck == 'table') {
                  props.getMaintenanceonDate()
                  props.allMaintenance()
                } else {
                  props.allMaintenance()
                }
                setisConfirmVisible(false)
                props.setIsNewMaintenanceCalanderVisible(false)
                if (props.selectedDate) {
                  form.resetFields(['sensorname', 'responsible', 'remarks'])
                } else {
                  form.resetFields()
                }
              })
            } else {
              request('https://localhost:5001/api/Maintenance', {
                method: 'post',
                data: {
                  startdate: moment(values.date).add(8, 'hours'),
                  responsible: values.responsible,
                  remarks: values.remarks,
                  completed: false,
                  sensorid: newMaintenance.sensorid,
                },
              }).then(() => {
                if (props.functioncheck == 'table') {
                  props.getMaintenanceonDate()
                  props.allMaintenance()
                } else {
                  props.allMaintenance()
                }
                setisConfirmVisible(false)
                props.setIsNewMaintenanceCalanderVisible(false)
                if (props.selectedDate) {
                  form.resetFields(['sensorname', 'responsible', 'remarks'])
                } else {
                  form.resetFields()
                }
              })
            }
          })
        }}
        onCancel={() => {
          setisConfirmVisible(false)
        }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        <p>The new maintenance information are </p>
        <p>
          Start date: <b>{newMaintenance.date}</b>
        </p>
        <p>
          Responsible: <b>{newMaintenance.responsible}</b>
        </p>
        <p>
          Remarks: <b>{newMaintenance.remarks}</b>
        </p>
      </Modal>
    </>
  )
}

export default NewMaintenanceCalander

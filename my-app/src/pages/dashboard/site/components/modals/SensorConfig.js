import { Modal, Select, Form, Input, message } from 'antd'
import { useState, useEffect } from 'react'
import request from 'umi-request'

const SensorConfig = props => {
  const [levelList, setLevelList] = useState([])
  const [selectLevel, setSelectLevel] = useState()
  const [selectType, setSelectType] = useState()
  const [selectSensor, setSelectSensor] = useState()
  const [form] = Form.useForm()
  let title = ''
  function getLevels () {
    request('https://localhost:5001/api/Level', {
      method: 'get',
      suffix: '/checkWorksite/' + props.selectWorksite,
    }).then(response => {
      setLevelList(response)
      if (response.length > 0) {
        setSelectLevel(response[0].levelid)
      }
    })
  }
  useEffect(() => {
    if (props.selectWorksite) {
      setSelectLevel(null)
      getLevels()
    }
  }, [props.selectWorksite])
  if (props.selectedOption) {
    if (props.selectedOption == 'createsensor') {
      title = 'Create Sensor'
    } else if (props.selectedOption == 'updatesensor') {
      title = 'Update Sensor'
    } else if (props.selectedOption == 'createsensortype') {
      title = 'Create Sensor Type'
    } else if (props.selectedOption == 'updatesensortype') {
      title = 'Update Sensor Type'
    } else if (props.selectedOption == 'createthreshold') {
      title = 'Assign Type To Sensor'
    }
  }
  return (
    <Modal
      title={title}
      visible={props.isSensorConfigVisible}
      onOk={() => {
        form.validateFields().then(value => {
          if (props.selectedOption == 'createsensor') {
            let data = {
              deveui: value.Deveui,
              location: value.Location,
              levelid: selectLevel,
            }
            request('http://159.138.89.74:5001/api/Sensor/sensor', {
              method: 'post',
              data: data,
            })
              .then(response => {
                /* when creation of sensor is successful */
                /* Notification to show that it is successful */
                // console.log("created",response)
                message.success(data.deveui + ' has been added')
                props.getSensorSource()
              })
              .catch(() => {
                message.error('Sensor has not been added')
              })
          } else if (props.selectedOption == 'updatesensor') {
            let data = {
              deveui: selectSensor,
              location: value.Location,
              levelid: selectLevel,
            }
            request('http://159.138.89.74:5001/api/Sensor/sensor', {
              method: 'put',
              data: data,
            })
              .then(response => {
                /* when creation of sensor is successful */
                /* Notification to show that it is successful */
                // console.log("created",response)
                message.success(data.deveui + ' has been updated')
                props.getSensorSource()
              })
              .catch(() => {
                message.error('Sensor has not been updated')
              })
          } else if (props.selectedOption == 'createsensortype') {
            let data = {
              type: value.Type,
              description: value.Description,
              format: value.Format,
              worksite_id: props.selectWorksite,
            }
            request('http://159.138.89.74:5001/api/SensorType/type', {
              method: 'post',
              data: data,
            })
              .then(response => {
                /* when creation of sensor is successful */
                /* Notification to show that it is successful */
                // console.log("created",response)
                message.success(data.type + ' has been added')
                props.getSensorConfigDetails()
              })
              .catch(() => {
                message.error('Sensor type has not been added')
              })
          } else if (props.selectedOption == 'updatesensortype') {
            let data = {
              type: selectType,
              description: value.Description,
              format: value.Format,
              worksite_id: props.selectWorksite,
            }
            request('http://159.138.89.74:5001/api/SensorType/type', {
              method: 'put',
              suffix: '/' + data.type,
              data: data,
            })
              .then(response => {
                /* when creation of sensor is successful */
                /* Notification to show that it is successful */
                // console.log("created",response)
                message.success(data.type + ' has been updated')
                props.getSensorConfigDetails()
              })
              .catch(() => {
                message.error('Sensor type has not been updated')
              })
          } else if (props.selectedOption == 'createthreshold') {
            let data = {
              upperthreshold: value.Upthreshold,
              lowerthreshold: value.Lowthreshold,
              deveui: value.Deveui,
              type: value.Type,
            }
            request('http://159.138.89.74:5001/api/Threshold/threshold', {
              method: 'post',
              data: data,
            })
              .then(() => {
                /* when creation of sensor is successful */
                /* Notification to show that it is successful */
                // console.log("created",response)
                message.success(' Threshold has been added')
                props.getSensorSource()
              })
              .catch((error) => {
                if (error.response.status == 409) {
                  message.error('Threshold already exists with the same deveui and type.')
                } else {
                  message.error('Threshold has not been added')
                }
              })
          }
          props.setIsSensorConfigVisible(false)
          form.resetFields()
        })
      }}
      onCancel={() => {
        props.setIsSensorConfigVisible(false)
        form.resetFields()
      }}
    >
      <Form form={form}>
        {(props.selectedOption == 'createsensor' || props.selectedOption == 'updatesensor') && (
          <>
            {props.selectedOption == 'createsensor' && (
              <Form.Item
                name='Deveui'
                label='Deveui'
                rules={[{ required: true, message: 'Deveui is required' }]}
              >
                <Input />
              </Form.Item>
            )}
            {props.selectedOption == 'updatesensor' && (
              <Form.Item
                name='Deveui'
                label='Deveui'
                rules={[{ required: true, message: 'Deveui is required' }]}
              >
                <Select
                  style={{ width: 300 }}
                  onChange={e => {
                    setSelectSensor(e)
                  }}
                >
                  {props.sensorSource.length > 0 &&
                    props.sensorSource.map((sensor, index) => (
                      <Select.Option key={index} value={sensor.deveui}>
                        {sensor.deveui}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item
              name='Location'
              label='Location'
              rules={[{ required: true, message: 'Location is required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name='Level' label='Level' value={selectLevel}>
              <Select
                style={{ width: 300 }}
                onChange={e => {
                  setSelectLevel(e)
                }}
              >
                {levelList.length > 0 &&
                  levelList.map((level, index) => (
                    <Select.Option key={index} value={level.levelid}>
                      {level.buildingName}, Level {level.buildingLevel}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </>
        )}
        {(props.selectedOption == 'createsensortype' ||
          props.selectedOption == 'updatesensortype') && (
          <>
            {props.selectedOption == 'createsensortype' && (
              <Form.Item
                name='Type'
                label='Sensor Type'
                rules={[{ required: true, message: 'Sensor Type is required' }]}
              >
                <Input />
              </Form.Item>
            )}

            {props.selectedOption == 'updatesensortype' && (
              <Form.Item
                name='Type'
                label='Sensor Type'
                rules={[{ required: true, message: 'Deveui is required' }]}
              >
                <Select
                  style={{ width: 300 }}
                  onChange={e => {
                    setSelectType(e)
                  }}
                >
                  {props.sortedGraphList.length > 0 &&
                    props.sortedGraphList.map((type, index) => (
                      <Select.Option key={index} value={type.type}>
                        {type.type}
                      </Select.Option>
                    ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item name='Description' label='Description'>
              <Input />
            </Form.Item>
            <Form.Item name='Format' label='Format'>
              <Input />
            </Form.Item>
          </>
        )}
        {(props.selectedOption == 'createthreshold' ||
          props.selectedOption == 'updatethreshold') && (
          <>
            <Form.Item
              name='Lowthreshold'
              label='Lower Threshold'
              rules={[{ required: true, message: 'Lower Threshold is required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='Upthreshold'
              label='Upper Threshold'
              rules={[{ required: true, message: 'Upper Threshold is required' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name='Deveui'
              label='Deveui'
              rules={[{ required: true, message: 'Deveui is required' }]}
            >
              <Select
                style={{ width: 300 }}
                onChange={e => {
                  setSelectSensor(e)
                }}
              >
                {props.sensorSource.length > 0 &&
                  props.sensorSource.map((sensor, index) => (
                    <Select.Option key={index} value={sensor.deveui}>
                      {sensor.deveui}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item
              name='Type'
              label='Type'
              rules={[{ required: true, message: 'Type is required' }]}
            >
              <Select
                style={{ width: 300 }}
                onChange={e => {
                  setSelectType(e)
                }}
              >
                {props.sortedGraphList.length > 0 &&
                  props.sortedGraphList.map((type, index) => (
                    <Select.Option key={index} value={type.type}>
                      {type.type}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  )
}

export default SensorConfig

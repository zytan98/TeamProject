import { useState, useRef, useEffect } from 'react'
import { Modal, Select, Form, InputNumber, Row, Col } from 'antd'
import request from 'umi-request'

const MaintenanceSettingModal = props => {
  const [isConfirmVisible, setisConfirmVisible] = useState(false)
  const [newPreset, setnewPreset] = useState({ value: '', length: '' })
  const [maxDurationValue, setMaxDurationvalue] = useState(12)
  const [worksiteId, setworksiteId] = useState(0)
  const [configId, setconfigId] = useState(0)
  const [presetInfo, setPresetInfo] = useState()
  const [form] = Form.useForm()
  let ConfigValueArray = ''
  var project = props.selectProject
  //gets the necessary information in order to post the new maintenance preset value
  const getInfo = () => {
    request('https://localhost:5001/api/MaintenanceConfig', {
      method: 'get',
      suffix: '/preset/' + project,
    })
      .then(response => {
        setworksiteId(response.worksiteId)
        setconfigId(response.maintenanceConfigId)
        setPresetInfo(response.maintenanceConfigValue)
      })
      .catch(error => {
        setconfigId(0)
        setPresetInfo()
        setworksiteId(0)
        form.resetFields()
      })
  }
  useEffect(() => {
    if (presetInfo) {
      ConfigValueArray = presetInfo.split(' ')
      if (ConfigValueArray[1] == 'Day') {
        setMaxDurationvalue(31)
      } else if (ConfigValueArray[1] == 'Month') {
        setMaxDurationvalue(12)
      } else {
        setMaxDurationvalue(10)
      }
      form.setFieldsValue({ number: parseInt(ConfigValueArray[0]), time: ConfigValueArray[1] })
    }
  }, [presetInfo])
  useEffect(() => {
    if (props.selectProject) {
      getInfo()
    }
  }, [props.selectProject])
  return (
    <>
      <Modal
        forceRender={true}
        title='Next Maintenance Duration'
        width={450}
        visible={props.isMaintenanceSettingModal}
        onCancel={() => {
          props.setIsMaintenanceSettingModal(false)
        }}
        onOk={() => {
          form.validateFields().then(values => {
            setnewPreset({ value: values.number, length: values.time })
            if (configId != 0) {
              request('https://localhost:5001/api/MaintenanceConfig', {
                method: 'put',
                suffix: '/' + configId,
                data: {
                  maintenanceConfigId: configId,
                  MaintenanceConfigValue: values.number + ' ' + values.time,
                  worksiteId: worksiteId,
                },
              })
            } else {
              request('https://localhost:5001/api/MaintenanceConfig', {
                method: 'post',
                data: {
                  MaintenanceConfigValue: values.number + ' ' + values.time,
                  worksiteId: props.selectProject,
                },
              })
            }
            props.setIsMaintenanceSettingModal(false)
            setisConfirmVisible(true)
            form.resetFields()
          })
        }}
      >
        <Form
          form={form}
          layout='horizontal'
          onValuesChange={value => {
            if (value.time !== undefined) {
              if (value.time == 'Day') {
                setMaxDurationvalue(31)
              } else if (value.time == 'Month') {
                setMaxDurationvalue(12)
              } else {
                setMaxDurationvalue(10)
              }
            } else {
              void 0
            }
          }}
        >
          <Row>
            <Col style={{ paddingRight: 30 }}>
              <Form.Item
                name='number'
                rules={[{ required: true, message: 'Please enter a value!' }]}
              >
                <InputNumber width='xs' min={1} max={maxDurationValue} placeholder='e.g. 5' />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name='time'
                rules={[{ required: true, message: 'Please select your type!' }]}
              >
                <Select style={{ width: 120 }} placeholder='Time'>
                  <Select.Option value='Day'>Day(s)</Select.Option>
                  <Select.Option value='Month'>Month(s)</Select.Option>
                  <Select.Option value='Year'>Year(s)</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
      <Modal
        title='New Preset Maintenance set'
        visible={isConfirmVisible}
        onOk={() => {
          setisConfirmVisible(false)
          getInfo()
          props.settingPresetInfo()
        }}
        onCancel={() => {
          setisConfirmVisible(false)
          getInfo()
          props.settingPresetInfo()
        }}
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        The new Preset for next maintenance will be {newPreset.value} {newPreset.length}(s)
      </Modal>
    </>
  )
}

export default MaintenanceSettingModal

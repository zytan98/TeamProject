import { useState, useRef } from 'react'

import { message } from 'antd'

import ProForm, { ModalForm, ProFormRadio, ProFormSelect, ProFormDigit } from '@ant-design/pro-form'

const SensorControl = props => {
  const restFormRef = useRef()
  const formRef = useRef()
  const [freqType, setfreqType] = useState('')
  const reset = () => {
    restFormRef.current === void 0 ? void 0 : restFormRef.current.resetFields()
  }
  return (
    <ModalForm
      onValuesChange={value => {
        value.frequency !== undefined ? setfreqType(value.frequency) : void 0
      }}
      title={props.sensorID}
      formRef={restFormRef}
      visible={props.isControlVisible}
      onFinish={() => {
        message.success('Sumbitted!')
        props.setisControlVisible(false)
        reset()
      }}
      modalProps={{
        okText: 'Confirm',
        cancelText: 'Cancel',
        onCancel: () => {
          props.setisControlVisible(false)
          reset()
        },
        centered: 'true',
      }}
      width={450}
      initialValues={{ status: true }}
      requiredMark='optional'
    >
      <ProForm.Group title='Status'>
        <ProFormRadio.Group
          name='status'
          options={[
            { label: 'On', value: true },
            { label: 'Off', value: false },
          ]}
        />
      </ProForm.Group>
      <ProForm.Group title='Sample Rate'>
        <ProFormDigit
          name='number'
          placeholder='Value'
          label='Frequency'
          width='xs'
          min={1}
          max={freqType == 'Hours' ? 24 : 60}
          rules={[{ required: true, message: 'Please enter a value!' }]}
        />
        <ProFormSelect
          width='sm'
          name='frequency'
          label='Frequency type'
          placeholder='Select frequency type'
          valueEnum={{
            Hours: 'Hours',
            Minutes: 'Minutes',
            Seconds: 'Seconds',
          }}
          rules={[{ required: true, message: 'Please select your frequency!' }]}
        />
      </ProForm.Group>
    </ModalForm>
  )
}

export default SensorControl

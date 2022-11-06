import React from 'react'

import { Modal, Select } from 'antd'
import { useState } from 'react'
import SensorConfig from './SensorConfig'

const SensorConfiguration = props => {
  const [selectedOption, setselectedOption] = useState('createsensor')
  const [isSensorConfigVisible, setIsSensorConfigVisible] = useState(false)

  function onChange (option) {
    setselectedOption(option)
  }
  return (
    <>
      <Modal
        visible={props.isSensorConfigurationVisible}
        title='Sensor Configurations'
        onOk={() => {
          setIsSensorConfigVisible(true)
        }}
        onCancel={() => {
          props.setIsSensorConfigurationVisible(false)
        }}
      >
        <Select style={{ width: 200 }} onChange={onChange} value={selectedOption}>
          <Select.Option value='createsensor'>Create Sensor</Select.Option>
          <Select.Option value='updatesensor'>Update Sensor</Select.Option>
          <Select.Option value='createsensortype'>Create Sensor Type</Select.Option>
          <Select.Option value='updatesensortype'>Update Sensor Type</Select.Option>
          <Select.Option value='createthreshold'>Assign Type To Sensor</Select.Option>
        </Select>
      </Modal>
      <SensorConfig
        isSensorConfigVisible={isSensorConfigVisible}
        setIsSensorConfigVisible={setIsSensorConfigVisible}
        selectedOption={selectedOption}
        selectWorksite={props.selectWorksite}
        sortedGraphList={props.sortedGraphList}
        sensorSource={props.sensorSource}
        getSensorSource={props.getSensorSource}
        getSensorConfigDetails={props.getSensorConfigDetails}
      />
    </>
  )
}

export default SensorConfiguration

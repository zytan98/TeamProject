import request from 'umi-request';
import { Modal, Form, InputNumber, message } from 'antd';
import { useState, useEffect } from 'react';

const SensorThresholdModal = (props) => {
  const [sensorThresholds, setSensorThresholds] = useState([]);
  const [initialValues, setInitialValues] = useState({ '1lower': 5 });
  const [form] = Form.useForm();
  useEffect(() => {
    if (props.sensorSelected) {
      request('https://localhost:5001/api/Threshold/sensorid/', {
        suffix: props.sensorSelected,
        method: 'get',
      }).then((response) => {
        setSensorThresholds(response);
      });
    }
  }, [props.isThresholdModalVisible]);
  useEffect(() => {
    if (sensorThresholds) {
      getInitialValues();
    }
  }, [sensorThresholds]);

  //set threshold values for display
  function getInitialValues() {
    var initialValuesTemp = { lower1: 0, lower2: 0 };
    sensorThresholds.forEach((threshold) => {
      var lowerName = 'lower' + threshold.thresholdid;
      var upperName = 'upper' + threshold.thresholdid;
      initialValuesTemp[lowerName] = threshold.lowerthreshold;
      initialValuesTemp[upperName] = threshold.upperthreshold;
    });
    setInitialValues(initialValuesTemp);
  }
  useEffect(() => {
    if (form) {
      form.resetFields();
    }
  }, [initialValues]);
  return (
    <Modal
      forceRender
      title="Sensor Threshold Settings"
      visible={props.isThresholdModalVisible}
      onOk={() =>
        form.validateFields().then((values) => {
          sensorThresholds.forEach((threshold) => {
            var lowerThreshold = values['lower' + threshold.thresholdid];
            var upperThreshold = values['upper' + threshold.thresholdid];
            //update threshold values
            request('https://localhost:5001/api/Threshold/', {
              suffix: threshold.thresholdid,
              method: 'put',
              data: {
                thresholdid: threshold.thresholdid,
                upperThreshold: upperThreshold,
                lowerThreshold: lowerThreshold,
                typeid: threshold.typeid,
                sensorid: threshold.sensorid,
              },
            });
          });
          message.success('successfully updated sensor thresholds');
          props.setIsThresholdModalVisible(false);
        })
      }
      onCancel={() => props.setIsThresholdModalVisible(false)}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
        initialValues={initialValues}
      >
        {sensorThresholds.length > 0 &&
          sensorThresholds.map((threshold, index) => (
            <Form.Item
              key={index}
              label={`${threshold.typeDescription}`}
              style={{ marginBottom: 0 }}
            >
              <Form.Item
                style={{ display: 'inline-block' }}
                name={`lower${threshold.thresholdid}`}
                rules={[{ required: true }]}
              >
                <InputNumber placeholder="Minimum" min={0} />
              </Form.Item>
              <Form.Item
                style={{ display: 'inline-block' }}
                name={`upper${threshold.thresholdid}`}
                rules={[{ required: true }]}
              >
                <InputNumber placeholder="Minimum" min={0} />
              </Form.Item>
            </Form.Item>
          ))}
      </Form>
    </Modal>
  );
};

export default SensorThresholdModal;

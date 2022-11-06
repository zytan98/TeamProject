import SensorControl from '../modals/SensorSettingsModal';
import SensorThresholdModal from '../modals/SensorThresholdModal';
import ProTable from '@ant-design/pro-table';
import { useEffect, useState } from 'react/cjs/react.development';
import { SettingOutlined } from '@ant-design/icons';

const SensorTable = (props) => {
  const [isControlVisible, setisControlVisible] = useState(false);
  const [sensorID, setsensorID] = useState();

  const [sensorSelected, SetSensorSelected] = useState(null);
  const [isThresholdModalVisible, setIsThresholdModalVisible] = useState(false);
  const sensorcolumns = [
    {
      title: 'Deveui',
      dataIndex: 'deveui',
      key: 'deveui',
    },
    {
      title: 'Building',
      dataIndex: 'buildingName',
      key: 'buildingName',
      sorter: (a, b) => a.building.localeCompare(b.building),
    },
    {
      title: 'Level',
      dataIndex: 'buildingLevel',
      key: 'buildingLevel',
      sorter: (a, b) => a.level - b.level,
    },
    {
      title: 'Type',
      dataIndex: 'sensorTypeString',
      key: 'sensorTypeString',
    },
    {
      title: 'Threshold',
      dataIndex: 'sensorid',
      key: 'sensorid',
      render: (sensorid, sensor) => {
        if (sensor.sensorTypeString.length > 0) {
          return (
            <SettingOutlined
              onClick={() => {
                SetSensorSelected(sensorid);
                setIsThresholdModalVisible(true);
              }}
              style={{
                fontSize: 20,
              }}
            />
          );
        } else {
          return '-';
        }
      },
    },
  ];

  const [tabContainerHeight, setTabContainerHeight] = useState();
  const [newHeight, setNewHeight] = useState();

  useEffect(() => {
    setTabContainerHeight(props.tabContainerHeight);
    const newHeight = tabContainerHeight - 150;
    setNewHeight(newHeight);
  });
  return (
    <div>
      <ProTable
        search={false}
        toolBarRender={false}
        dataSource={props.sensorSource}
        columns={sensorcolumns}
        pagination={{
          pageSize: tabContainerHeight ? Math.floor(newHeight / 60) : 6,
          simple: true,
        }}
        rowKey="deveui"
      />
      <SensorControl
        isControlVisible={isControlVisible}
        setisControlVisible={setisControlVisible}
        sensorID={`Sensor ${sensorID}`}
      />
      <SensorThresholdModal
        sensorSelected={sensorSelected}
        isThresholdModalVisible={isThresholdModalVisible}
        setIsThresholdModalVisible={setIsThresholdModalVisible}
      />
    </div>
  );
};

export default SensorTable;

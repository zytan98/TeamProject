import { ModalForm } from '@ant-design/pro-form';
import SensorsTable from '../SensorTable/SensorTable';

const SensorTableModal = (props) => {
  return (
    <div>
      <ModalForm
        title="Sensors"
        visible={props.isSensorVisible}
        modalProps={{
          onCancel: () => {
            props.setisSensorVisible(false);
          },
        }}
        submitter={false}
        width={1200}
      >
        <SensorsTable sensorSource={props.sensorSource} />
      </ModalForm>
    </div>
  );
};

export default SensorTableModal;

import { Modal } from 'antd';
import WorkersTable from '../WorkerTable/WorkerTable';

const WorkerTableModal = (props) => {
  return (
    <Modal
      title="Workers"
      visible={props.isWorkerVisible}
      width={1000}
      onOk={() => {
        props.setisWorkerVisible(false);
      }}
      onCancel={() => {
        props.setisWorkerVisible(false);
      }}
    >
      <WorkersTable isWorkerVisible={props.isWorkerVisible} buildingId={props.buildingId} />
    </Modal>
  );
};

export default WorkerTableModal;

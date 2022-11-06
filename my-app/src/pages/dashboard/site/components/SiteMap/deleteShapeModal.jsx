import React, { useState } from 'react';
import { Modal, Button, message } from 'antd';
import request from 'umi-request';

const DeleteShapeModal = (props) => {
  const [isDeleteShapeModalVisible, setIsDeleteShapeModalVisible] = useState(false);

  return (
    <>
      <Button
        onClick={() => {
          if (props.buildingClicked.building == '-') {
            message.error('Please select a building');
          } else {
            setIsDeleteShapeModalVisible(true);
          }
        }}
      >
        Delete
      </Button>
      <Modal
        title="Confirmation"
        visible={isDeleteShapeModalVisible}
        onOk={() => {
          request('https://localhost:5001/api/ShapePoint/bybuildingid/', {
            suffix: props.buildingClicked.buildingId,
            method: 'delete',
          }).then(() => {
            message.success("Successfully Deleted Building Shape")
            props.setIsDeleteCurrentShape(true);
            setIsDeleteShapeModalVisible(false);
          });
        }}
        onCancel={() => {
          setIsDeleteShapeModalVisible(false);
        }}
        okText="Delete"
      >
        <p>Are you sure you want to delete {props.buildingClicked.building}</p>
      </Modal>
    </>
  );
};
export default DeleteShapeModal;

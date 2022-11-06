import { Radio, Card, Modal, Form, Select } from 'antd';

import { useEffect, useRef, useState } from 'react';
import request from 'umi-request';

const Building = (props) => {
  const [buildingList, setBuildingList] = useState([]);
  const [restriction, setRestriction] = useState(false);
  const [selectedBuildingId, setSelectedBuildingId] = useState(null);
  const [form] = Form.useForm();
  const reset = () => {
    setRestriction(false);
    setSelectedBuildingId(null);
  };
  function getWorkSiteDetails() {
    request('https://localhost:5001/api/Building/nopoints/byworksiteid/', {
      suffix: props.selectWorksite,
      method: 'get',
    }).then((response) => {
      props.setNewShapeUpdated(false);
      setBuildingList(response);
    });
  }
  useEffect(() => {
    getWorkSiteDetails();
  }, [props.selectWorksite, props.newShapeUpdated, props.isDeleteCurrentShape]);
  return (
    <Modal
      title="Select Building"
      visible={props.isBuildingVisible}
      onOk={(event) => {
        props.setisBuildingVisible(false);
        props.setIsDrawing(true);
        var buildingSelected = buildingList.find((x) => x.buildingId == selectedBuildingId);
        props.setBuildingSelected({
          restriction: restriction,
          selectedBuildingId: selectedBuildingId,
          worksiteId: buildingSelected.worksiteId,
          buildingName: buildingSelected.buildingName,
        });
        reset();
      }}
      onCancel={() => {
        props.setisBuildingVisible(false);
        props.setIsDrawing(false);
        reset();
      }}
      width={500}
    >
      <Select
        style={{ width: 300 }}
        onChange={(e) => {
          setSelectedBuildingId(e);
        }}
        value={selectedBuildingId}
      >
        {buildingList.length > 0 &&
          buildingList.map((building, index) => (
            <Option key={index} value={building.buildingId}>
              {building.buildingName}
            </Option>
          ))}
      </Select>{' '}
      <Radio.Group
        style={{ paddingTop: '20px' }}
        onChange={(e) => setRestriction(e.target.value)}
        defaultValue={false}
        label="Access Level"
        name="access"
      >
        <Radio value={false}>Full Access</Radio>
        <Radio value={true}>Restricted</Radio>
      </Radio.Group>
    </Modal>
  );
};

export default Building;

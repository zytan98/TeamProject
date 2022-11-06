import { Modal, message } from 'antd';
import { useEffect, useState } from 'react';
import MultipleList from './multipleList';
import request from 'umi-request';
import Column from 'antd/lib/table/Column';

const GraphSettingModal = (props) => {
  const [ColumnsArray, setColumnsArray] = useState();
  return (
    <Modal
      onOk={() => {
        let arr = [];
        if (ColumnsArray['columnsShow'].items.length < 4) {
          message.error('Needs 4 variables in Show list');
        } else {
          for (var i = 0; i < ColumnsArray['columnsShow'].items.length; i++) {
            //update positive graph display settings
            const item = ColumnsArray['columnsShow'].items[i];
            request('https://localhost:5001/api/SensorType/', {
              method: 'put',
              suffix: item.typeid,
              data: {
                format: item.format,
                type: item.type,
                description: item.description,
                worksiteId: item.worksiteId,
                upperthreshold: item.upperthreshold,
                lowerthreshold: item.lowerthreshold,
                display: i + 1,
                typeid: item.typeid,
              },
            }).then(() => {
              var displayHideCount = -1;
              //update negative graph display settings
              for (var i = 0; i < ColumnsArray['columnsHide'].items.length; i++) {
                const item = ColumnsArray['columnsHide'].items[i];
                request('https://localhost:5001/api/SensorType/', {
                  method: 'put',
                  suffix: item.typeid,
                  data: {
                    format: item.format,
                    type: item.type,
                    description: item.description,
                    worksiteId: item.worksiteId,
                    upperthreshold: item.upperthreshold,
                    lowerthreshold: item.lowerthreshold,
                    display: displayHideCount,
                    typeid: item.typeid,
                  },
                }).then(() => {
                  props.setRefresh(true);
                });
                displayHideCount--;
              }
              // no negative
              if (i == 0) {
                props.setRefresh(true);
              }
            });
          }

          message.success('Successfully updated display order');
          props.setIsGraphSettingVisible(false);
        }
      }}
      onCancel={() => {
        props.setIsGraphSettingVisible(false);
      }}
      title="Graph Display Settings"
      visible={props.isGraphSettingVisible}
      okText="Confirm"
      cancelText="Cancel"
      width={500}
      centered="true"
    >
      <MultipleList setColumnsArray={setColumnsArray} sortedGraphList={props.sortedGraphList} />
    </Modal>
  );
};

export default GraphSettingModal;

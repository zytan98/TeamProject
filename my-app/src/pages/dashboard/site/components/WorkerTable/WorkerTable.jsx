import ProTable from '@ant-design/pro-table';
import { useEffect, useState } from 'react/cjs/react.development';
import { LightFilter, ProFormDatePicker } from '@ant-design/pro-form';
import moment from 'moment';
import request from 'umi-request';
import { message } from 'antd';
import './WorkerTable.css';

const WorkerTable = (props) => {
  const [workersSource, setWorkersSource] = useState('');
  const [checkInDate, setCheckInDate] = useState(moment().format('YYYY-MM-DD'));

  useEffect(() => {
    props.isWorkerVisible ? getWorkerListDashboard() : getWorkerListBuilding();
  }, [checkInDate, props.buildingId]);

  //retrieve workers that is checked in (default is today date) - for displaying in the dashboard worker table modal
  function getWorkerListDashboard() {
    const workerSource = [];

    for (var y = 0; y < props.buildingId.length; y++) {
      request('https://localhost:5001/api/Worker/CheckInOut', {
        method: 'get',
        params: {
          checkInDate: checkInDate,
          buildingId: props.buildingId[y],
        },
      })
        .then((response) => {
          if (response.length == 0) {
            setWorkersSource([]);
          }
          for (var i = 0; i < response.length; i++) {
            const name = response[i].name;
            const checkInTime = moment(response[i].checkInTime, 'HH:mm').format('HH:mm');
            const checkOutTime = moment(response[i].checkOutTime, 'HH:mm').format('HH:mm');
            if (checkOutTime == 'Invalid date' || null) {
              checkOutTime = '-';
            }
            const phoneNumber = response[i].phoneNumber;
            const company = response[i].companyName;
            workerSource.push({
              key: response[i].id,
              name: name,
              phoneNumber: phoneNumber,
              checkInTime: checkInTime,
              checkOutTime: checkOutTime,
              company: company,
            });
          }
          setWorkersSource([...workerSource]);
        })
        .catch((error) => {
          message.error('Error in getting workers check in and out');
        });
    }
  }

  //retrieve workers that is checked in (default is today date) - for displaying in the building details worker table
  function getWorkerListBuilding() {
    request('https://localhost:5001/api/Worker/CheckInOut', {
      method: 'get',
      params: {
        checkInDate: checkInDate,
        buildingId: props.buildingId,
      },
    })
      .then((response) => {
        const workerSource = [];
        for (var i = 0; i < response.length; i++) {
          const name = response[i].name;
          const checkInTime = moment(response[i].checkInTime).format('HH:mm');
          const checkOutTime = moment(response[i].checkOutTime).format('HH:mm');
          if (checkOutTime == 'Invalid date' || null) {
            checkOutTime = '-';
          }
          const phoneNumber = response[i].phoneNumber;
          const company = response[i].companyName;
          workerSource.push({
            name: name,
            phoneNumber: phoneNumber,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            company: company,
          });
        }
        setWorkersSource(workerSource);
      })
      .catch((error) => {
        message.error('Error in getting workers check in and out');
      });
  }

  const workerscolumns = [
    {
      title: 'Worker Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      search: false,
    },
    {
      title: 'Worker Company',
      dataIndex: 'company',
      key: 'company',
      sorter: (a, b) => a.company.localeCompare(b.company),
      search: false,
    },
    {
      title: 'Worker Number',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      sorter: (a, b) => a.number - b.number,
      search: false,
    },
    {
      title: 'Time In',
      dataIndex: 'checkInTime',
      key: 'checkInTime',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.checkInTime.localeCompare(b.checkInTime),
      search: false,
    },
    {
      title: 'Time Out',
      dataIndex: 'checkOutTime',
      key: 'checkOutTime',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.checkOutTime.localeCompare(b.checkOutTime),
      search: false,
    },
  ];

  const [tabContainerHeight, setTabContainerHeight] = useState();
  const [newHeight, setNewHeight] = useState();

  useEffect(() => {
    setTabContainerHeight(props.tabContainerHeight);
    const newHeight = tabContainerHeight - 150;
    setNewHeight(newHeight);
  });

  //get selected date
  function onChange(date, dateString) {
    setCheckInDate(moment(date._d).format('YYYY-MM-DD'));
  }

  return (
    <ProTable
      search={false}
      toolbar={{
        filter: (
          <LightFilter>
            <ProFormDatePicker
              format="DD/MM/YYYY"
              name="startdate"
              label="Date"
              initialValue={moment()}
              onChange={onChange}
              allowClear={false}
            />
          </LightFilter>
        ),
        settings: [],
      }}
      dataSource={workersSource}
      columns={workerscolumns}
      pagination={{
        pageSize: tabContainerHeight ? Math.floor(newHeight / 60) : 6,
        simple: true,
      }}
    />
  );
};

export default WorkerTable;

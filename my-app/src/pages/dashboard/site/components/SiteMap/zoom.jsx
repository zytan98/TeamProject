import { useEffect, useRef, useState } from 'react/cjs/react.development';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Button, Upload, message } from 'antd';
import SiteMap from './siteMap';
import './zoom.css';
import BuildingSetting from '../modals/DrawBuildingModal.jsx';
import DeleteShapeModal from './deleteShapeModal';
import { history } from 'umi';
import { EditOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import request from 'umi-request';

const Zoom = (props) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [isBuildingVisible, setisBuildingVisible] = useState(false);
  const [buildingSelected, setBuildingSelected] = useState({});
  const [buildingClicked, setBuildingClicked] = useState({ building: '-', access: false });
  const [isDeleteCurrentShape, setIsDeleteCurrentShape] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [update, setUpdate] = useState(false);
  const [newSiteImageId, setNewSiteImageId] = useState();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [siteImage, setSiteImage] = useState('');
  const [newShapeUpdated, setNewShapeUpdated] = useState(false);

  useEffect(() => {
    setSiteImage(props.siteImage);
  }, [props.siteImage, props.selectWorksite]);

  //get last siteimage id (use for updating the worksite table)
  function getLastWorksiteId() {
    request('https://localhost:5001/api/SiteImage/getHighestId', {
      method: 'get',
    }).then((response) => {
      setNewSiteImageId(response.siteimageid + 1);
    });
  }
  useEffect(() => {
    getLastWorksiteId();
  }, [props.selectWorksite]);
  useEffect(() => {
    getLastWorksiteId();
  }, []);

  //insert siteimage and update worksite with new siteimage id
  const updateSiteImage = () => {
    request('https://localhost:5001/api/SiteImage', {
      method: 'post',
      data: {
        SiteImage1: Buffer.from(
          imageUrl.substring(imageUrl.indexOf('base64,') + 7),
          'base64',
        ).toString('base64'),
      },
    }).then((response) => {
      message.success('Upload successfully');
      setUploadSuccess(true);
      setSiteImage(imageUrl);
      request('https://localhost:5001/api/Worksite', {
        method: 'put',
        suffix: '/' + props.selectWorksite + '/' + response.siteimageid,
      }).then((response) => {
        setUpdate(false);
      });
    });
  };

  //base64 image encoder
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  //set siteimage with base64 
  function handleChange(info) {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (imageUrl) => {
        setLoading(false);
        setImageUrl(imageUrl);
        setUpdate(true);
      });
    }
  }

  //image constraints
  function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  return (
    <div className="site-map-container">
      <BuildingSetting
        isBuildingVisible={isBuildingVisible}
        setisBuildingVisible={setisBuildingVisible}
        setNewShapeUpdated={setNewShapeUpdated}
        newShapeUpdated={newShapeUpdated}
        isDeleteCurrentShape={isDeleteCurrentShape}
        setIsDrawing={setIsDrawing}
        setBuildingSelected={setBuildingSelected}
        selectWorksite={props.selectWorksite}
      />
      {update ? (
        <div
          style={{
            backgroundColor: '#d9d9d9',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          {imageUrl ? (
            <div>
              <div className="update-container">
                <img src={imageUrl} alt="avatar" style={{ width: '500px', height: '50%' }} />
              </div>

              <div className="upload-image-btn-wrapper" style={{ margin: 'auto' }}>
                <Button
                  key="back"
                  onClick={() => {
                    setImageUrl('');
                    setUpdate(false);
                  }}
                >
                  Cancel
                </Button>
                <Button key="submit" type="primary" onClick={updateSiteImage}>
                  Upload
                </Button>
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>
      ) : (
        <div className="site-map-container">
          <div className="building-selected-wrapper">
            <h2>Building: {buildingClicked.building}</h2>
          </div>
          <TransformWrapper
            panning={{ disabled: isDrawing ? true : false }}
            centerOnInit={true}
            doubleClick={{ disabled: true }}
          >
            {({ zoomIn, zoomOut, resetTransform, ...rest }) => {
              return (
                <>
                  <TransformComponent pan={{ disabled: true }}>
                    <SiteMap
                      isDrawing={isDrawing}
                      setIsDrawing={setIsDrawing}
                      buildingSelected={buildingSelected}
                      buildingClicked={buildingClicked}
                      setBuildingClicked={setBuildingClicked}
                      isDeleteCurrentShape={isDeleteCurrentShape}
                      setIsDeleteCurrentShape={setIsDeleteCurrentShape}
                      siteImage={siteImage}
                      selectWorksite={props.selectWorksite}
                      setNewShapeUpdated={setNewShapeUpdated}
                    />
                  </TransformComponent>
                  <Upload beforeUpload={beforeUpload} onChange={handleChange}>
                    <Button icon={<EditOutlined />} className="btn-update"></Button>
                  </Upload>

                  <div className="zoom-control">
                    <Button onClick={() => zoomIn()}>+</Button>
                    <Button onClick={() => zoomOut()}>-</Button>
                    <Button onClick={() => resetTransform()}>Reset</Button>
                    <Button
                      type={isDrawing ? 'primary' : 'button'}
                      name="btn-draw"
                      onClick={() => {
                        if (!isDrawing) {
                          setisBuildingVisible(true);
                        } else {
                          setIsDrawing(false);
                        }
                      }}
                    >
                      <span style={{ fontSize: '14px' }}>Draw</span>
                    </Button>
                    <DeleteShapeModal
                      buildingClicked={buildingClicked}
                      setIsDeleteCurrentShape={setIsDeleteCurrentShape}
                    />
                  </div>
                </>
              );
            }}
          </TransformWrapper>
        </div>
      )}
    </div>
  );
};
export default Zoom;

import React, { useState, useEffect } from 'react';
import { Upload, Button, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import './uploadImage.css';
import request from 'umi-request';
import { indexOf } from 'lodash';
import SiteImage from './siteImage';
import Zoom from './zoom';

const UploadImage = (props) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [newSiteImageId, setNewSiteImageId] = useState();
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [siteImage, setSiteImage] = useState('');

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
  
  //insert siteimage and update worksite with new siteimage id
  const post = () => {
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
      setImageUrl('');
      setUploadSuccess(true);
      request('https://localhost:5001/api/Worksite', {
        method: 'put',
        suffix: '/' + props.selectWorksite + '/' + response.siteimageid,
      });
    });
  };

  //base64 image encoder
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
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
        setSiteImage(imageUrl);
      });
    }
  }
  return (
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
      {uploadSuccess ? (
        <Zoom
          siteImage={siteImage}
          siteImageId={newSiteImageId}
          selectWorksite={props.selectWorksite}
        />
      ) : (
        <Upload
          name="avatar"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? (
            <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
          ) : (
            <div>
              {loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          )}
        </Upload>
      )}

      {imageUrl ? (
        <div className="upload-image-btn-wrapper">
          <Button
            key="back"
            onClick={() => {
              setImageUrl('');
            }}
          >
            Cancel
          </Button>
          <Button key="submit" type="primary" onClick={post}>
            Upload
          </Button>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
};
export default UploadImage;

import { useEffect, useRef, useState } from 'react/cjs/react.development';
import { Button } from 'antd';
import request from 'umi-request';
import UploadImage from './uploadImage';
import Zoom from './zoom';

const SiteImage = (props) => {
  const [siteImageId, setSiteImageId] = useState();
  const [siteImage, setSiteImage] = useState('');

  useEffect(() => {
    //retrieve siteimage id according to selected worksite
    if (props.selectWorksite != null) {
      request('https://localhost:5001/api/Worksite', {
        method: 'get',
        suffix: '/siteImage' + '/' + props.selectWorksite,
      })
        .then((response) => {
          setSiteImageId(response.siteimageid);
        })
        .catch((error) => {
          console.log('error', error);
        });
    }
  }, [props.selectWorksite, siteImage]);

  //retrieve siteimage using siteimage id
  useEffect(() => {
    if (siteImageId == null) {
      setSiteImage('');
    } else {
      request('https://localhost:5001/api/SiteImage', {
        method: 'get',
        suffix: '/' + siteImageId,
      }).then((response) => {
        setSiteImage(response.siteimage1);
      });
    }
  }, [siteImageId, siteImage]);

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {siteImage ? (
        <Zoom
          siteImage={'data:image/png;base64,' + siteImage}
          siteImageId={siteImageId}
          selectWorksite={props.selectWorksite}
        />
      ) : (
        <UploadImage selectWorksite={props.selectWorksite} />
      )}
    </div>
  );
};
export default SiteImage;

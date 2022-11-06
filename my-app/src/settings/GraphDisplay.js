// import { Row, Modal, Col, Layout, Button } from 'antd'
// import { useState } from 'react'
// import './GraphDisplay.css'



// const GraphDisplay = props => {
//   const [isModalVisible, setModalVisible] = useState(false);

//   const showModal = () => {
//     setModalVisible(true);
//   }

//   const handleconfirm = () => {
//     setModalVisible(false);
//   }

//   const handlecancel = () => {
//     setModalVisible(false);
//   }
//   return (
//     <>
//     <Button type="primary" onClick={showModal}>
//       Open Modal
//     </Button>
//     <Modal bodyStyle={{ height: '350px',padding:'50'}} title="Graph Display Settings" visible={isModalVisible} onCancel={handlecancel} onConfirm={handleconfirm}>
//         <Row>
//             <p className="showcontainer">
//               Show
//             </p>
//         </Row>
//         <Row>
//           <Col>
//             <p className="hidecontainer">
//             Hide
//             </p>
//             </Col>
//          </Row> 
//       </Modal>
//     {/* <Modal
//       title='Graph Display Setting'
//       visible={props.isGraphVisible, isModalVisible}
//       okText='Confirm'
//       cancelText='Cancel'
//       onOk={() => {
//         props.setisGraphVisible(false)
//         handleconfirm(false)
//       }}
//       onCancel={() => {
//         props.setisGraphVisible(false)
//         handlecancel(false)
//       }}
//       zIndex='1'
//     >
//     </Modal> */}
//     </>
//   )
// }


// export default GraphDisplay
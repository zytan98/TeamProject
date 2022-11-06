// import React from 'react';
// import PropTypes from 'prop-types';
// import ListSort from './ListSort';
// import './GraphSort.css';
// import { Col, Row, InputNumber } from 'antd';

// function onChange(min) {
//   console.log('changed', min);
// }

// const dataArray = [
//   {
//     color: '#FF5500',
//     text: 'Temperature',
    
//   },
//   {
//     color: '#5FC296',
//     text: 'Humidity',
    
//   },
//   {
//     color: '#2DB7F5',
//     text: 'Rain',
    
//   },
//   {
//     color: '#FFAA00',
//     text: 'Noise',
    
//   },
//   {
//     color: '#FFAA00',
//     text: 'Wind',
    
//   }
// ];
// class GraphSort extends React.Component {
//   static propTypes = {
//     className: PropTypes.string,
//   };

//   static defaultProps = {
//     className: 'list-sort',
//   };

//   render = () => {
//     const childrenToRender = dataArray.map((item, i) => {
//       const {
//         text,
//       } = item;
//       return (
//         <div key={i} className={`${this.props.className}-list`}>
//           <Row justify = 'space-between'>
//           <Col span={4}>
//           <div className={`${this.props.className}-text`}>
//             <p>{text}</p>
//           </div>
//           </Col>
//           <Col span={1.5}>
//           <div className={`${this.props.className}-min`}>
//             <InputNumber size= "small" min={1} defaultValue={1} onChange={onChange}/>           
//           </div>
//           </Col>
//           <Col span={4}>
//           <div className={`${this.props.className}-max`}>
//             <InputNumber size= "small" min={1} defaultValue={1} onChange={onChange}/> 
//           </div>
//           </Col>
//           </Row>
//         </div>
//       );
//     });
  
//     return (
//       <div className={`${this.props.className}-wrapper`}>
//         <div className={this.props.className}>
//           <ListSort
//             dragClassName="list-drag-selected"
//             appearAnim={{ animConfig: { marginTop: [5, 30], opacity: [1, 0] } }}
//           >
//             {childrenToRender}
//           </ListSort>
//         </div>
//       </div>
//     );
//   }
// }

// export default GraphSort
import React, { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import './multipleList.css';

//sort drag and drop logic
const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removedFromSource] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removedFromSource);
    //can only show 4 graphs
    //move the last item in show table to hide table
    if (Object.keys(destItems).length > 4) {
      const [removedFromDest] = destItems.splice(Object.keys(destItems).length - 1, 1);
      sourceItems.splice(0, 0, removedFromDest);
    }
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

const MultipleList = (props) => {
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    props.setColumnsArray(columns);
  }, [columns]);
  useEffect(() => {
    //sort graph display into respective arrays (hide and show)
    var columnsHide = {};
    var columnsShow = {};
    var columnsHideTemp = [];
    var columnsShowTemp = [];
    for (var i = 0; i < props.sortedGraphList.length; i++) {
      if (props.sortedGraphList[i].display <= 0) {
        columnsHideTemp.push(props.sortedGraphList[i]);
      }
    }
    for (var i = 0; i < props.sortedGraphList.length; i++) {
      if (props.sortedGraphList[i].display > 0) {
        columnsShowTemp.push(props.sortedGraphList[i]);
      }
    }
    columnsHide = {
      name: 'Hide',
      items: columnsHideTemp,
      show: false,
    };
    columnsShow = {
      name: 'Show',
      items: columnsShowTemp.sort(function (a, b) {
        return a.display - b.display;
      }),
      show: true,
    };
    setColumns({ columnsShow, columnsHide });
  }, []);

  return (
    <div>
      <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
        {Object.entries(columns).map(([columnId, column], index) => {
          return (
            <div className="list-container" key={columnId}>
              <h3>{column.name}</h3>
              <Droppable droppableId={columnId} key={columnId}>
                {(provided, snapshot) => {
                  return (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="display-list-container"
                      style={{
                        background: snapshot.isDraggingOver ? 'grey' : 'lightgrey',
                      }}
                    >
                      {column.items.map((item, index) => {
                        return (
                          <Draggable
                            key={item.description}
                            draggableId={item.description}
                            index={index}
                          >
                            {(provided, snapshot) => {
                              return (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    userSelect: 'none',
                                    padding: 16,
                                    margin: '0 0 8px 0',
                                    height: '50px',
                                    backgroundColor: snapshot.isDragging ? 'lightgrey' : 'white',
                                    boxShadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px',
                                    ...provided.draggableProps.style,
                                  }}
                                >
                                  {item.description}
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
};

export default MultipleList;

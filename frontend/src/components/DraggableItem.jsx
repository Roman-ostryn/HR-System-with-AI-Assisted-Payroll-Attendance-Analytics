import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'ITEM',
    item,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        padding: '10px',
        margin: '5px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px',
        cursor: 'move',
        textAlign: 'center',
      }}
    >
      {item.name}
    </div>
  );
};

export default DraggableItem;

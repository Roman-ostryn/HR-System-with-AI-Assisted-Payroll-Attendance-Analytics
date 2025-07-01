import React from 'react';
import { useDrop } from 'react-dnd';

const DropZone = ({ onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'ITEM', // Tipo de elemento que acepta
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = isOver && canDrop;
  const backgroundColor = isActive ? '#d1ffd6' : canDrop ? '#f5f5f5' : '#ffffff';

  return (
    <div
      ref={drop}
      style={{
        height: '100px',
        border: '2px dashed gray',
        borderRadius: '5px',
        textAlign: 'center',
        lineHeight: '100px',
        backgroundColor,
        transition: 'background-color 0.3s',
      }}
    >
      {isActive ? '¡Suelta aquí!' : 'Arrastra un elemento aquí'}
    </div>
  );
};

export default DropZone;

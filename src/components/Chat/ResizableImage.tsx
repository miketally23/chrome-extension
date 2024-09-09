import React, { useRef } from 'react';
import { NodeViewWrapper } from '@tiptap/react';

const ResizableImage = ({ node, updateAttributes, selected }) => {
  const imgRef = useRef(null);

  const startResizing = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startWidth = imgRef.current.offsetWidth;

    const onMouseMove = (e) => {
      const newWidth = startWidth + e.clientX - startX;
      updateAttributes({ width: `${newWidth}px` });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <NodeViewWrapper
      as="div"
      className={`resizable-image ${selected ? 'selected' : ''}`}
      style={{
        display: 'inline-block',
        position: 'relative',
        userSelect: 'none', // Prevent selection to avoid interference with the text cursor
      }}
    >
      <img
        ref={imgRef}
        src={node.attrs.src}
        alt={node.attrs.alt || ''}
        title={node.attrs.title || ''}
        style={{ width: node.attrs.width || 'auto', display: 'block', margin: '0 auto' }}
        draggable={false} // Prevent image dragging
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          bottom: 0,
          width: '10px',
          height: '10px',
          backgroundColor: 'gray',
          cursor: 'nwse-resize',
          zIndex: 1, // Ensure the resize handle is above other content
        }}
        onMouseDown={startResizing}
      ></div>
    </NodeViewWrapper>
  );
};

export default ResizableImage;

import React, { useContext, useEffect, useRef } from 'react'
import { AppViewer } from './AppViewer'
import Frame from 'react-frame-component';
import { MyContext, isMobile } from '../../App';
import { subscribeToEvent, unsubscribeFromEvent } from '../../utils/events';

const AppViewerContainer = ({app, isSelected, hide}) => {
    const { rootHeight } = useContext(MyContext);
    const frameRef = useRef(null);

  
  
  return (
    <Frame  id={`browser-iframe-${app?.tabId}` }      ref={frameRef} head={
        <>
          {/* Inject styles directly into the iframe */}
          <style>
            {`
              body {
                margin: 0;
                padding: 0;
              }
              /* Hide scrollbars for all elements */
              * {
                -ms-overflow-style: none;  /* IE and Edge */
                scrollbar-width: none;  /* Firefox */
              }
              *::-webkit-scrollbar {
                display: none;  /* Chrome, Safari, Opera */
              }
              .frame-content {
                overflow: hidden;
                height: ${!isMobile ? '100vh' :  `calc(${rootHeight} - 60px - 45px )`};
              }
            `}
          </style>
        </>
      } style={{
          height: !isMobile ? '100vh' :  `calc(${rootHeight} - 60px - 45px )`,
          border: 'none',
          width: '100%',
          overflow: 'hidden',
          display: (!isSelected || hide) && 'none'
        }} ><AppViewer app={app}  /></Frame>
  )
}

export default AppViewerContainer
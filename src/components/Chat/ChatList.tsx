import React, { useCallback, useState, useEffect, useRef, useMemo } from 'react';
import { List, AutoSizer, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import { MessageItem } from './MessageItem';

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 50,
});

export const ChatList = ({ initialMessages, myAddress, tempMessages }) => {
 
  const hasLoadedInitialRef = useRef(false);
  const listRef = useRef();
  const [messages, setMessages] = useState(initialMessages);
  const [showScrollButton, setShowScrollButton] = useState(false);
 
  
  useEffect(() => {
    cache.clearAll();
  }, []);

  const handleMessageSeen = useCallback(() => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => ({
        ...msg,
        unread: false,
      }))
    );
  }, []);

  const handleScroll = ({ scrollTop, scrollHeight, clientHeight }) => {
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
    const hasUnreadMessages = messages.some((msg) => msg.unread);
    if(isAtBottom){
      handleMessageSeen()
    }
    setShowScrollButton(!isAtBottom && hasUnreadMessages);
  };

  const debounce = (func, delay) => {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, delay);
    };
  };

  const handleScrollDebounced = debounce(handleScroll, 100);

  const scrollToBottom = (initialmsgs) => {
    if (listRef.current) {
      const msgs = initialmsgs?.length ? initialmsgs : messages
   
      listRef.current?.recomputeRowHeights();

      listRef.current.scrollToRow(msgs.length - 1);
      setTimeout(() => {
      
        listRef.current.scrollToRow(msgs.length - 1);
      }, 100);
      setShowScrollButton(false);
    }
  };

  const recomputeListHeights = () => {
    if (listRef.current) {
      listRef.current.recomputeRowHeights();
    }
  };

 

  const rowRenderer = ({ index, key, parent, style }) => {
    let message = messages[index];
    const isLargeMessage = message.text?.length > 200; // Adjust based on your message size threshold

    if(message?.message && message?.groupDirectId){
      message = {
        ...(message?.message || {}),
        isTemp: true,
        unread:  false
      }
    }
    return (
      <CellMeasurer
        key={key}
        cache={cache}
        parent={parent}
        columnIndex={0}
        rowIndex={index}
      >
        {({ measure }) => (
          <div style={style}>
            <div
              onLoad={() => {
                if (isLargeMessage) {
                  measure(); // Ensure large messages are properly measured
                }
              }}
              style={{
                marginBottom: '10px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <MessageItem
                isLast={index === messages.length - 1}
                message={message}
                onSeen={handleMessageSeen}
                isTemp={!!message?.isTemp}
              />
            </div>
          </div>
        )}
      </CellMeasurer>
    );
  };

  useEffect(() => {
    
    const totalMessages = [...initialMessages, ...(tempMessages || [])]
    if(totalMessages.length === 0) return
    setMessages(totalMessages);
    // cache.clearAll(); // Clear cache so the list can properly re-render with new messages
    setTimeout(() => {
      if (listRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = listRef.current.Grid._scrollingContainer;
        handleScroll({ scrollTop, scrollHeight, clientHeight });
        recomputeListHeights(); // Ensure heights are recomputed on message load
        setTimeout(() => {
          if(!hasLoadedInitialRef.current){
            scrollToBottom(totalMessages);
            hasLoadedInitialRef.current = true
          }
        }, 100);
      }
    }, 500);
  }, [tempMessages, initialMessages]);

  // useEffect(() => {
  //   // Scroll to the bottom on initial load or when messages change
  //   if (listRef.current && messages.length > 0 && !hasLoadedInitialRef.current) {
  //     scrollToBottom();
  //     hasLoadedInitialRef.current = true;
  //   } else if (messages.length > 0 && messages[messages.length - 1].sender === myAddress) {
  //     scrollToBottom();
  //   }
  // }, [messages, myAddress]);

  return (
    <div style={{ position: 'relative', flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', flexShrink: 1 }}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            ref={listRef}
            width={width}
            height={height}
            rowCount={messages.length}
            rowHeight={cache.rowHeight}
            rowRenderer={rowRenderer}
            onScroll={handleScrollDebounced}
            deferredMeasurementCache={cache}
            onRowsRendered={recomputeListHeights} // Force recompute on render
            overscanRowCount={10} // For performance: pre-render some rows
          />
        )}
      </AutoSizer>
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: '#ff5a5f',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            zIndex: 10,
          }}
        >
          Scroll to Unread Messages
        </button>
        
      )}
     
    </div>
  );
};
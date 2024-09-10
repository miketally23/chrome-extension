import React, { useCallback, useState, useEffect, useRef } from 'react';
import { List, AutoSizer, CellMeasurerCache, CellMeasurer } from 'react-virtualized';
import { MessageItem } from './MessageItem';

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 50,
});

export const ChatList = ({ initialMessages, myAddress }) => {
  const hasLoadedInitialRef = useRef(false);
  const listRef = useRef();
  const [messages, setMessages] = useState(initialMessages);
  const [showScrollButton, setShowScrollButton] = useState(false);


  useEffect(()=> {
    cache.clearAll();
  }, [])
  const handleMessageSeen = useCallback((messageId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => {
        return { ...msg, unread: false } 
      }
        
      )
    );
  }, []);

  const handleScroll = ({ scrollTop, scrollHeight, clientHeight }) => {
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
    const hasUnreadMessages = messages.some((msg) => msg.unread);

    if (!isAtBottom && hasUnreadMessages) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
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

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current?.recomputeRowHeights();
      listRef.current.scrollToRow(messages.length - 1);
      setTimeout(() => {
        listRef.current?.recomputeRowHeights();
      listRef.current.scrollToRow(messages.length - 1);
      }, 100);
  
     
      setShowScrollButton(false);
    }
  };

  const preserveScrollPosition = (callback) => {
    if (listRef.current) {
      const scrollContainer = listRef.current.Grid._scrollingContainer;
      const currentScrollTop = scrollContainer.scrollTop; // Get current scroll position
  
      callback(); // Perform the action that could change the layout (e.g., recompute row heights)
  
      // Restore the scroll position after the layout change
      setTimeout(() => {
        scrollContainer.scrollTop = currentScrollTop;
      }, 0);
    }
  };
  

  const rowRenderer = ({ index, key, parent, style }) => {
    const message = messages[index];

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
        onLoad={() => preserveScrollPosition(measure)} // Prevent jumps while measuring
        style={{
          marginBottom: '10px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <MessageItem isLast={index === messages.length - 1} message={message} onSeen={handleMessageSeen} />
      </div>
    </div>
  )}
</CellMeasurer>
    );
  };

  useEffect(() => {
    setMessages(initialMessages);
    setTimeout(() => {
      if (listRef.current) {
       // Accessing scrollTop, scrollHeight, clientHeight from List's methods
      const scrollTop = listRef.current.Grid._scrollingContainer.scrollTop;
      const scrollHeight = listRef.current.Grid._scrollingContainer.scrollHeight;
      const clientHeight = listRef.current.Grid._scrollingContainer.clientHeight;

      handleScroll({ scrollTop, scrollHeight, clientHeight });
      }
    }, 100);
  }, [initialMessages]);

  useEffect(() => {
    // Scroll to the bottom on initial load or when messages change
    if (listRef.current && messages.length > 0 && hasLoadedInitialRef.current === false) {
      scrollToBottom();
      hasLoadedInitialRef.current = true;
    } else if (messages.length > 0 && messages[messages.length - 1].sender === myAddress) {
      scrollToBottom();
    }
  }, [messages, myAddress]);

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

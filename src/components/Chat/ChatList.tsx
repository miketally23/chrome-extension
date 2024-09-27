import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { MessageItem } from './MessageItem';
import { subscribeToEvent, unsubscribeFromEvent } from '../../utils/events';

export const ChatList = ({ initialMessages, myAddress, tempMessages, chatId, onReply, handleReaction, chatReferences, tempChatReferences }) => {
  const virtuosoRef = useRef();
  const [messages, setMessages] = useState(initialMessages);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const hasLoadedInitialRef = useRef(false);
  const isAtBottomRef = useRef(true);  //
  // Update message list with unique signatures and tempMessages
  useEffect(() => {
    let uniqueInitialMessagesMap = new Map();

    initialMessages.forEach((message) => {
      uniqueInitialMessagesMap.set(message.signature, message);
    });

    const uniqueInitialMessages = Array.from(uniqueInitialMessagesMap.values()).sort(
      (a, b) => a.timestamp - b.timestamp
    );
    const totalMessages = [...uniqueInitialMessages, ...(tempMessages || [])];

    if (totalMessages.length === 0) return;

    setMessages(totalMessages);

    setTimeout(() => {
      const hasUnreadMessages = totalMessages.some((msg) => msg.unread && !msg?.chatReference);

      if (virtuosoRef.current) {


        if (virtuosoRef.current && !isAtBottomRef.current && hasUnreadMessages) {

   
    

    setShowScrollButton(hasUnreadMessages);
        } else {
          handleMessageSeen();

        }
       

      }
      if (!hasLoadedInitialRef.current) {
        scrollToBottom(totalMessages);
        hasLoadedInitialRef.current = true;
      }
    }, 500);
  }, [initialMessages, tempMessages]);

  

  const handleMessageSeen = useCallback(() => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) => ({
        ...msg,
        unread: false,
      }))
    );
  }, []);

  const scrollToItem = useCallback((index) => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({ index, behavior: 'smooth' });
    }
  }, []);

  const scrollToBottom = (initialMsgs) => {
    
    const index = initialMsgs ? initialMsgs.length - 1 : messages.length - 1
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({ index});
    }
  };

  
  const handleScroll = (scrollState) => {
    const { scrollTop, scrollHeight, clientHeight } = scrollState;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
    const hasUnreadMessages = messages.some((msg) => msg.unread);

    if (isAtBottom) {
      handleMessageSeen();
    }

    setShowScrollButton(!isAtBottom && hasUnreadMessages);
  };

  const sentNewMessageGroupFunc = useCallback(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    subscribeToEvent('sent-new-message-group', sentNewMessageGroupFunc);
    return () => {
      unsubscribeFromEvent('sent-new-message-group', sentNewMessageGroupFunc);
    };
  }, [sentNewMessageGroupFunc]);

  const rowRenderer = (index) => {
    let message = messages[index];
    let replyIndex = messages.findIndex((msg)=> msg?.signature === message?.repliedTo)
    let reply
    let reactions = null
    if(message?.repliedTo && replyIndex !== -1){
      reply = messages[replyIndex]
    }
    if(message?.message && message?.groupDirectId){
       replyIndex = messages.findIndex((msg)=> msg?.signature === message?.message?.repliedTo)
     reply
    if(message?.message?.repliedTo && replyIndex !== -1){
      reply = messages[replyIndex]
    }
      message = {
        ...(message?.message || {}),
        isTemp: true,
        unread:  false
      }
    }

    if(chatReferences && chatReferences[message?.signature]){
      if(chatReferences[message.signature]?.reactions){
        reactions = chatReferences[message.signature]?.reactions
      }
    }
    let isUpdating = false
    if(tempChatReferences && tempChatReferences?.find((item)=> item?.chatReference === message?.signature)){
      isUpdating = true
    }

    return (
      <div style={{ padding: '10px 0', display: 'flex', justifyContent: 'center', width: '100%', minHeight: '50px' ,  overscrollBehavior: "none"}}>
        <MessageItem
          isLast={index === messages.length - 1}
          message={message}
          onSeen={handleMessageSeen}
          isTemp={!!message?.isTemp}
          myAddress={myAddress}
          onReply={onReply}
          reply={reply}
          replyIndex={replyIndex}
          scrollToItem={scrollToItem}
          handleReaction={handleReaction}
          reactions={reactions}
          isUpdating={isUpdating}
        />
      </div>
    );
  };

  const handleAtBottomStateChange = (atBottom) => {
    isAtBottomRef.current = atBottom;
    if(atBottom){
      handleMessageSeen();
      setShowScrollButton(false)
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Virtuoso
        ref={virtuosoRef}
        data={messages}
        itemContent={rowRenderer}
        atBottomThreshold={50}
        followOutput="smooth"
        atBottomStateChange={handleAtBottomStateChange}  // Detect bottom status
        increaseViewportBy={3000}
        
      />

      {showScrollButton && (
        <button
          onClick={()=> scrollToBottom()}
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

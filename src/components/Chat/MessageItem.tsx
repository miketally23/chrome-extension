import { Message } from "@chatscope/chat-ui-kit-react";
import React, { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { MessageDisplay } from "./MessageDisplay";
import { Avatar, Box, Typography } from "@mui/material";
import { formatTimestamp } from "../../utils/time";
import { getBaseApi } from "../../background";
import { getBaseApiReact } from "../../App";

export const MessageItem = ({ message, onSeen, isLast, isTemp }) => {

  const { ref, inView } = useInView({
    threshold: 0.7, // Fully visible
    triggerOnce: true, // Only trigger once when it becomes visible
  });

  useEffect(() => {
    if (inView && message.unread) {
      onSeen(message.id);
    }
  }, [inView, message.id, message.unread, onSeen]);

  return (
    <div
      ref={isLast ? ref : null}
      style={{
        padding: "10px",
        backgroundColor: "#232428",
        borderRadius: "7px",
        width: "95%",
        display: "flex",
        gap: '7px',
        opacity: isTemp ? 0.5 : 1
      }}
    >
      <Avatar
      sx={{
        backgroundColor: '#27282c',
        color: 'white'
      }}
        alt={message?.senderName}
        src={`${getBaseApiReact()}/arbitrary/THUMBNAIL/${message?.senderName}/qortal_avatar?async=true`}
      >
        {message?.senderName?.charAt(0)}
      </Avatar>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "7px",
          width: '100%'
        }}
      >
        <Typography
          sx={{
            fontWight: 600,
            fontFamily: "Inter",
            color: "cadetBlue",
          }}
        >
          {message?.senderName || message?.sender}
        </Typography>
        {message?.text?.type === "notification" ? (
          <MessageDisplay htmlContent={message.text?.data?.message} />
        ) : (
          <MessageDisplay htmlContent={message.text} />
        )}
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%',

        }}>
          {isTemp ? (
              <Typography sx={{
                fontSize: '14px',
                color: 'gray',
                fontFamily: 'Inter'
              }}>Sending...</Typography>
          ): (
            <Typography sx={{
              fontSize: '14px',
              color: 'gray',
              fontFamily: 'Inter'
            }}>{formatTimestamp(message.timestamp)}</Typography>
          ) }
        
        </Box>
      </Box>

      {/* <Message
      model={{
        direction: 'incoming',
        message: message.text,
        position: 'single',
        sender: message.senderName,
        sentTime: message.timestamp
      }}
      
    ></Message> */}
      {/* {!message.unread && <span style={{ color: 'green' }}> Seen</span>} */}
    </div>
  );
};

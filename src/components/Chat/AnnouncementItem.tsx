import { Message } from "@chatscope/chat-ui-kit-react";
import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { MessageDisplay } from "./MessageDisplay";
import { Avatar, Box, Typography } from "@mui/material";
import { formatTimestamp } from "../../utils/time";
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { getBaseApi } from "../../background";
import { requestQueueCommentCount } from "./GroupAnnouncements";
import { CustomLoader } from "../../common/CustomLoader";
import { getBaseApiReact } from "../../App";
export const AnnouncementItem = ({ message, messageData, setSelectedAnnouncement, disableComment }) => {

  const [commentLength, setCommentLength] = useState(0)
  const getNumberOfComments = React.useCallback(
    async () => {
      try {
        const offset = 0;

        // dispatch(setIsLoadingGlobal(true))
        const identifier = `cm-${message.identifier}`;
        const url = `${getBaseApiReact()}/arbitrary/resources/search?mode=ALL&service=DOCUMENT&identifier=${identifier}&limit=0&includemetadata=false&offset=${offset}&reverse=true`;
       
        const response =  await requestQueueCommentCount.enqueue(() => { 
          return fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
        })
        const responseData = await response.json();

        setCommentLength(responseData?.length);
        
      } catch (error) {
      } finally {
        // dispatch(setIsLoadingGlobal(false))
      }
    },
    []
  );
  useEffect(()=> {
    if(disableComment) return
    getNumberOfComments()
  }, [])
  return (
    <div
      style={{
        padding: "10px",
        backgroundColor: "#232428",
        borderRadius: "7px",
        width: "95%",
        display: "flex",
        gap: '7px',
        flexDirection: 'column'
      }}
    >
      <Box sx={{
         display: "flex",
         gap: '7px',
         width: '100%',
         wordBreak: 'break-word'
      }}>
         <Avatar
      sx={{
        backgroundColor: '#27282c',
        color: 'white'
      }}
        alt={message?.name}
        src={`${getBaseApiReact()}/arbitrary/THUMBNAIL/${message?.name}/qortal_avatar?async=true`}
      >
        {message?.name?.charAt(0)}
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
          {message?.name}
        </Typography>
        {!messageData?.decryptedData && (
          <Box sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}>
          <CustomLoader />
          </Box>
        )}
        {messageData?.decryptedData?.message && (
          <>
           {messageData?.type === "notification" ? (
          <MessageDisplay htmlContent={messageData?.decryptedData?.message} />
        ) : (
          <MessageDisplay htmlContent={messageData?.decryptedData?.message} />
        )}
          </>
        )}

       
        <Box sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          width: '100%'
        }}>
          <Typography sx={{
            fontSize: '14px',
            color: 'gray',
            fontFamily: 'Inter'
          }}>{formatTimestamp(message.created)}</Typography>
        </Box>
      </Box>
      </Box>
     {!disableComment && (
      <Box sx={{
        display: 'flex',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px',
        cursor: 'pointer',
        opacity: 0.4,
        borderTop: '1px solid white',
    
      }} onClick={()=> setSelectedAnnouncement(message)}>
        
        <Box sx={{
        display: 'flex',
        width: '100%',
        gap: '25px',
        alignItems: 'center',
      
      }}>
        <ChatBubbleIcon sx={{
          fontSize: '20px'
        }} />
        {commentLength ? (
               <Typography sx={{
                fontSize: '14px'
              }}>{`${commentLength > 1 ? `${commentLength} comments` : `${commentLength} comment`}`}</Typography>
        ) : (
               <Typography sx={{
                fontSize: '14px'
              }}>Leave comment</Typography>
        )}
     
        </Box>
        <ArrowForwardIosIcon sx={{
          fontSize: '20px'
        }} />
      </Box>
     )}
      
    </div>
  );
};

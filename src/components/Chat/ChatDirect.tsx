import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import {  objectToBase64 } from '../../qdn/encryption/group-encryption'
import { ChatList } from './ChatList'
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Tiptap from './TipTap'
import { CustomButton } from '../../App-styles'
import CircularProgress from '@mui/material/CircularProgress';
import { Input } from '@mui/material';
import { LoadingSnackbar } from '../Snackbar/LoadingSnackbar';
import { getNameInfo } from '../Group/Group';
import { Spacer } from '../../common/Spacer';
import { CustomizedSnackbars } from '../Snackbar/Snackbar';
import { getBaseApiReactSocket } from '../../App';





export const ChatDirect = ({ myAddress, isNewChat, selectedDirect, setSelectedDirect, setNewChat, getTimestampEnterChat, myName}) => {
  const [messages, setMessages] = useState([])
  const [isSending, setIsSending] = useState(false)
  const [directToValue, setDirectToValue] = useState('')
  const hasInitialized = useRef(false)
  const [isLoading, setIsLoading] = useState(false)
  const [openSnack, setOpenSnack] = React.useState(false);
  const [infoSnack, setInfoSnack] = React.useState(null);
  const hasInitializedWebsocket = useRef(false)
  const editorRef = useRef(null);
  const setEditorRef = (editorInstance) => {
    editorRef.current = editorInstance;
  };

   

 

  

    const decryptMessages = (encryptedMessages: any[])=> {
      try {
        return new Promise((res, rej)=> {
          chrome.runtime.sendMessage({ action: "decryptDirect", payload: {
            data: encryptedMessages,
            involvingAddress: selectedDirect?.address
        }}, (response) => {
        
            if (!response?.error) {
              res(response)
              if(hasInitialized.current){
          
                const formatted = response.map((item: any)=> {
                  return {
                    ...item,
                    id: item.signature,
                    text: item.message,
                    unread:  true
                  }
                } )
                setMessages((prev)=> [...prev, ...formatted])
              } else {
                const formatted = response.map((item: any)=> {
                  return {
                    ...item,
                    id: item.signature,
                    text: item.message,
                    unread: false
                  }
                } )
                setMessages(formatted)
                hasInitialized.current = true

              }
            }
            rej(response.error)
          });
        })  
      } catch (error) {
          
      }
    }

    const initWebsocketMessageGroup = () => {
      let timeoutId
      let groupSocketTimeout

      let socketTimeout: any
      let socketLink = `${getBaseApiReactSocket()}/websockets/chat/messages?involving=${selectedDirect?.address}&involving=${myAddress}&encoding=BASE64&limit=100`
      const socket = new WebSocket(socketLink)

      const pingGroupSocket = () => {
        socket.send('ping')
        timeoutId = setTimeout(() => {
          socket.close()
          clearTimeout(groupSocketTimeout)
        }, 5000) // Close the WebSocket connection if no pong message is received within 5 seconds.
      }
      socket.onopen = () => {
     
        setTimeout(pingGroupSocket, 50)
      }
      socket.onmessage = (e) => {
        try {
          if (e.data === 'pong') {
          
            clearTimeout(timeoutId)
            groupSocketTimeout = setTimeout(pingGroupSocket, 45000)
            return
          } else {
          decryptMessages(JSON.parse(e.data))
          setIsLoading(false)
          }
          
        } catch (error) {
          
        }
      
      }
      socket.onclose = () => {
        console.log('closed')
        clearTimeout(socketTimeout)
				setTimeout(() => initWebsocketMessageGroup(), 50)
      
      }
      socket.onerror = (e) => {
        clearTimeout(groupSocketTimeout)
				socket.close()
      }
    }


  
    useEffect(()=> {
      if(hasInitializedWebsocket.current) return
      setIsLoading(true)
        initWebsocketMessageGroup()
        hasInitializedWebsocket.current = true
    }, [])
  



const sendChatDirect = async ({ chatReference = undefined, messageText}: any)=> {
  try {
    const directTo = isNewChat ? directToValue : selectedDirect.address
 
    if(!directTo) return
    return new Promise((res, rej)=> {
      chrome.runtime.sendMessage({ action: "sendChatDirect", payload: {
        directTo,  chatReference, messageText
    }}, async (response) => {
    
        if (!response?.error) {
          if(isNewChat){
            
            let getRecipientName = null
            try {
              getRecipientName = await getNameInfo(response.recipient)
            } catch (error) {
              
            }
            setSelectedDirect({
              "address": response.recipient,
              "name": getRecipientName,
              "timestamp": Date.now(),
              "sender": myAddress,
              "senderName": myName
          })
          setNewChat(null)
          chrome.runtime.sendMessage({
            action: "addTimestampEnterChat",
            payload: {
              timestamp: Date.now(),
              groupId: response.recipient,
            },
          });
          setTimeout(() => {
            getTimestampEnterChat()
          }, 400);
          }
          res(response)
          return
        }
        rej(response.error)
      });
    })  
  } catch (error) {
      throw new Error(error)
  }
}
const clearEditorContent = () => {
  if (editorRef.current) {
    editorRef.current.chain().focus().clearContent().run();
  }
};


    const sendMessage = async ()=> {
      try {
        if(isSending) return
        if (editorRef.current) {
          const htmlContent = editorRef.current.getHTML();
     
          if(!htmlContent?.trim() || htmlContent?.trim() === '<p></p>') return
          setIsSending(true)
        const message = JSON.stringify(htmlContent)
       
        const res = await sendChatDirect({ messageText: htmlContent})
        clearEditorContent()
        }
        // send chat message
      } catch (error) {
        setInfoSnack({
          type: "error",
          message: error,
        });
        setOpenSnack(true);
        console.error(error)
      } finally {
        setIsSending(false)
      }
    }


    
 
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      width: '100%'
    }}>
      {isNewChat && (
        <>
        <Spacer height="30px" />
                <Input sx={{
                  fontSize: '18px'
                }} placeholder='Name or address' value={directToValue} onChange={(e)=> setDirectToValue(e.target.value)} />

        </>
      )}
      
              <ChatList initialMessages={messages} myAddress={myAddress}/>

   
      <div style={{
        // position: 'fixed',
        // bottom: '0px',
        backgroundColor: "#232428",
        minHeight: '150px',
        maxHeight: '400px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        width: '100%',
        boxSizing: 'border-box',
        padding: '20px'
      }}>
      <div style={{
            display: 'flex',
            flexDirection: 'column',
            // height: '100%',
            overflow: 'auto'
      }}>

     
      <Tiptap setEditorRef={setEditorRef} onEnter={sendMessage} isChat />
      </div>
      <CustomButton
              onClick={()=> {
                if(isSending) return
                sendMessage()
              }}
              style={{
                marginTop: 'auto',
                alignSelf: 'center',
                cursor: isSending ? 'default' : 'pointer',
                background: isSending && 'rgba(0, 0, 0, 0.8)',
                flexShrink: 0
              }}
            >
              {isSending && (
                <CircularProgress
                size={18}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
                  color: 'white'
                }}
              />
              )}
              {` Send`}
            </CustomButton>
      </div>
      <LoadingSnackbar open={isLoading} info={{
        message: "Loading chat... please wait."
      }} />
       <CustomizedSnackbars open={openSnack} setOpen={setOpenSnack} info={infoSnack} setInfo={setInfoSnack}  />
    </div>
  )
}

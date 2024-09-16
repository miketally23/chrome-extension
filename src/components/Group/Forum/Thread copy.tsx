import React, {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import {
  Box,

  Skeleton,

} from '@mui/material'
import { ShowMessage } from './ShowMessageWithoutModal'
// import {
//   setIsLoadingCustom,
// } from '../../state/features/globalSlice'
import { ComposeP, GroupContainer, GroupNameP, MailIconImg, ShowMessageReturnButton, SingleThreadParent, ThreadContainer, ThreadContainerFullWidth } from './Mail-styles'
import { Spacer } from '../../../common/Spacer'
import { threadIdentifier } from './GroupMail'
import LazyLoad from '../../../common/LazyLoad'
import ReturnSVG from '../../../assets/svgs/Return.svg'
import { NewThread } from './NewThread'
import { decryptPublishes } from '../../Chat/GroupAnnouncements'
import { getBaseApi } from '../../../background'
import { getArbitraryEndpointReact, getBaseApiReact } from '../../../App'
interface ThreadProps {
  currentThread: any
  groupInfo: any
  closeThread: () => void
  members: any
}

const getEncryptedResource = async ({name, identifier, secretKey})=> {
 
  const res = await fetch(
    `${getBaseApiReact()}/arbitrary/DOCUMENT/${name}/${identifier}?encoding=base64`
  );
  const data = await res.text();
  const response = await decryptPublishes([{ data }], secretKey);
  const messageData = response[0];
  return messageData.decryptedData

}

export const Thread = ({
  currentThread,
  groupInfo,
  closeThread,
  members,
  userInfo,
  secretKey,
  getSecretKey
}: ThreadProps) => {
  const [messages, setMessages] = useState<any[]>([])
  const [hashMapMailMessages, setHashMapMailMessages] = useState({}) 
  const secretKeyRef = useRef(null)


  useEffect(() => {
    secretKeyRef.current = secretKey;
  }, [secretKey]);
  const getIndividualMsg = async (message: any) => {
    try {
      const responseDataMessage = await getEncryptedResource({identifier: message.identifier, name: message.name, secretKey})
     

      const fullObject = {
        ...message,
        ...(responseDataMessage || {}),
        id: message.identifier
      }
      setHashMapMailMessages((prev)=> {
       return {
        ...prev,
        [message.identifier]: fullObject
       }
      })
    } catch (error) {}
  }
  
  const getMailMessages = React.useCallback(
    async (groupInfo: any, reset?: boolean, hideAlert?: boolean) => {
      try {
        if(!hideAlert){
          // dispatch(setIsLoadingCustom('Loading messages'))

        }
        let threadId = groupInfo.threadId
      
        const offset = messages.length
        const identifier = `thmsg-${threadId}`
        const url = `${getBaseApiReact()}${getArbitraryEndpointReact()}?mode=ALL&service=${threadIdentifier}&identifier=${identifier}&limit=20&includemetadata=false&offset=${offset}&reverse=true&prefix=true`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const responseData = await response.json()
        let fullArrayMsg = reset ? [] : [...messages]
        let newMessages: any[] = []
        for (const message of responseData) {
          const index = fullArrayMsg.findIndex(
            (p) => p.identifier === message.identifier
          )
          if (index !== -1) {
            fullArrayMsg[index] = message
          } else {
            fullArrayMsg.push(message)
            getIndividualMsg(message)
          }
        }
        setMessages(fullArrayMsg)
      } catch (error) {
      } finally {
        if(!hideAlert){
        // dispatch(setIsLoadingCustom(null))
        }
      }
    },
    [messages, secretKey]
  )
  const getMessages = React.useCallback(async () => {
    if (!currentThread || !secretKey) return
    await getMailMessages(currentThread, true)
  }, [getMailMessages, currentThread, secretKey])
  const firstMount = useRef(false)

  const saveTimestamp = useCallback((currentThread: any, username?: string)=> {
    if(!currentThread?.threadData?.groupId || !currentThread?.threadId || !username) return
    const threadIdForLocalStorage = `qmail_threads_${currentThread?.threadData?.groupId}_${currentThread?.threadId}`
    const threads = JSON.parse(
      localStorage.getItem(`qmail_threads_viewedtimestamp_${username}`) || "{}"
    );
    // Convert to an array of objects with identifier and all fields
    let dataArray = Object.entries(threads).map(([identifier, value]) => ({
      identifier,
      ...(value as any),
    }));

    // Sort the array based on timestamp in descending order
    dataArray.sort((a, b) => b.timestamp - a.timestamp);

    // Slice the array to keep only the first 500 elements
    let latest500 = dataArray.slice(0, 500);

    // Convert back to the original object format
    let latest500Data: any = {};
    latest500.forEach(item => {
      const { identifier, ...rest } = item;
      latest500Data[identifier] = rest;
    });
    latest500Data[threadIdForLocalStorage] = {
      timestamp: Date.now(),
    }
    localStorage.setItem(
      `qmail_threads_viewedtimestamp_${username}`,
      JSON.stringify(latest500Data)
    );
  }, [])
  useEffect(() => {
    if (currentThread && secretKey) {
      getMessages()
      firstMount.current = true
      // saveTimestamp(currentThread, user.name)
    }
  }, [ currentThread, secretKey])
  const messageCallback = useCallback((msg: any) => {
    // dispatch(addToHashMapMail(msg))
    setMessages((prev) => [msg, ...prev])
  }, [])

  const interval = useRef<any>(null)

  const checkNewMessages = React.useCallback(
    async (groupInfo: any) => {
      try {
        let threadId = groupInfo.threadId
      
        const identifier = `thmsg-${threadId}`
        const url = `${getBaseApiReact()}${getArbitraryEndpointReact()}?mode=ALL&service=${threadIdentifier}&identifier=${identifier}&limit=20&includemetadata=false&offset=${0}&reverse=true&prefix=true`
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const responseData = await response.json()
        const latestMessage = messages[0]
        if (!latestMessage) return
        const findMessage = responseData?.findIndex(
          (item: any) => item?.identifier === latestMessage?.identifier
        )
        let sliceLength = responseData.length
        if (findMessage !== -1) {
          sliceLength = findMessage
        }
        const newArray = responseData.slice(0, findMessage).reverse()
        let fullArrayMsg = [...messages]
        for (const message of newArray) {
          try {
          
            const responseDataMessage = await getEncryptedResource({identifier: message.identifier, name: message.name, secretKey: secretKeyRef.current})

            const fullObject = {
              ...message,
              ...(responseDataMessage || {}),
              id: message.identifier
            }
            setHashMapMailMessages((prev)=> {
              return {
               ...prev,
               [message.identifier]: fullObject
              }
             })
            const index = messages.findIndex(
              (p) => p.identifier === fullObject.identifier
            )
            if (index !== -1) {
              fullArrayMsg[index] = fullObject
            } else {
              fullArrayMsg.unshift(fullObject)
            }
          } catch (error) {}
        }
        setMessages(fullArrayMsg)
      } catch (error) {
      } finally {
      }
    },
    [messages]
  )

  const checkNewMessagesFunc = useCallback(() => {
    let isCalling = false
    interval.current = setInterval(async () => {
      if (isCalling) return
      isCalling = true
      const res = await checkNewMessages(currentThread)
      isCalling = false
    }, 8000)
  }, [checkNewMessages,  currentThread])

  useEffect(() => {
    checkNewMessagesFunc()
    return () => {
      if (interval?.current) {
        clearInterval(interval.current)
      }
    }
  }, [checkNewMessagesFunc])



  if (!currentThread) return null
  return (
    <GroupContainer
      sx={{
        position: "relative",
        overflow: 'auto',
        width: '100%'
      }}
    >
      
       <NewThread
          groupInfo={groupInfo}
          isMessage={true}
          currentThread={currentThread}
          messageCallback={messageCallback}
          members={members}
          userInfo={userInfo}
          getSecretKey={getSecretKey}
        />
      <ThreadContainerFullWidth>
      <ThreadContainer>
      <Spacer height="30px" />
          <Box sx={{
            width: '100%',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
          <GroupNameP>{currentThread?.threadData?.title}</GroupNameP>

          <ShowMessageReturnButton onClick={() => {
                    setMessages([])
                    closeThread()
                  }}>
                    <MailIconImg src={ReturnSVG} />
                    <ComposeP>Return to Threads</ComposeP>
                  </ShowMessageReturnButton>
          </Box>
          <Spacer height="60px" />
          {messages.map((message) => {
        let fullMessage = message

        if (hashMapMailMessages[message?.identifier]) {
          fullMessage = hashMapMailMessages[message.identifier]
          return <ShowMessage key={message?.identifier} message={fullMessage} />
        }

        return (
          <SingleThreadParent>
            
              <Skeleton
                variant="rectangular"
                style={{
                  width: '100%',
                  height: 60,
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              />
           
            </SingleThreadParent>
        )
      })}
    </ThreadContainer>
      </ThreadContainerFullWidth>
      {messages.length >= 20 && (
              <LazyLoad onLoadMore={()=> getMailMessages(currentThread, false, true)}></LazyLoad>

      )}
     
    </GroupContainer>
  )
}

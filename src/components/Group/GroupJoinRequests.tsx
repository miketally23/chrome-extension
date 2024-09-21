import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Comment";
import InfoIcon from "@mui/icons-material/Info";
import { RequestQueueWithPromise } from "../../utils/queue/queue";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { executeEvent } from "../../utils/events";
import { Box, Typography } from "@mui/material";
import { Spacer } from "../../common/Spacer";
import { CustomLoader } from "../../common/CustomLoader";
import { getBaseApi } from "../../background";
import { getBaseApiReact, isMobile } from "../../App";
export const requestQueueGroupJoinRequests = new RequestQueueWithPromise(2)

export const GroupJoinRequests = ({ myAddress, groups, setOpenManageMembers, getTimestampEnterChat, setSelectedGroup, setGroupSection, setMobileViewMode }) => {
  const [groupsWithJoinRequests, setGroupsWithJoinRequests] = React.useState([])
  const [loading, setLoading] = React.useState(true)



  const getJoinRequests = async ()=> {
    try {
      setLoading(true)
   
      let groupsAsAdmin = []
      const getAllGroupsAsAdmin = groups.map(async (group)=> {
   
        const isAdminResponse = await requestQueueGroupJoinRequests.enqueue(()=> {
          return fetch(
            `${getBaseApiReact()}/groups/members/${group.groupId}?limit=0&onlyAdmins=true`
          );
        }) 
        const isAdminData = await isAdminResponse.json()
   

        const findMyself = isAdminData?.members?.find((member)=> member.member === myAddress)
      
        if(findMyself){
          groupsAsAdmin.push(group)
        }
        return true
      })

      // const getJoinGroupRequests = groupsAsAdmin.map(async (group)=> {
      //   console.log('getJoinGroupRequests', group)
      //   const joinRequestResponse = await requestQueueGroupJoinRequests.enqueue(()=> {
      //     return  fetch(
      //       `${getBaseApiReact()}/groups/joinrequests/${group.groupId}`
      //     );
      //   }) 

      //   const joinRequestData = await joinRequestResponse.json()
      //   return {
      //     group,
      //     data: joinRequestData
      //   }
      // })
      await Promise.all(getAllGroupsAsAdmin)
     const res = await Promise.all(groupsAsAdmin.map(async (group)=> {

      const joinRequestResponse = await requestQueueGroupJoinRequests.enqueue(()=> {
        return  fetch(
          `${getBaseApiReact()}/groups/joinrequests/${group.groupId}`
        );
      }) 

      const joinRequestData = await joinRequestResponse.json()
      return {
        group,
        data: joinRequestData
      }
    }))
     setGroupsWithJoinRequests(res)
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (myAddress && groups.length > 0) {
      getJoinRequests()
    } else {
      setLoading(false)
    }
  }, [myAddress, groups]);

  console.log('groupsWithJoinRequests', groupsWithJoinRequests)

  return (
    <Box sx={{
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: 'center'
    }}>
      <Box
        sx={{
          width: "322px",
          display: "flex",
          flexDirection: "column",
          padding: '0px 20px',

        }}
      >
        <Typography
          sx={{
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          Join Requests:
        </Typography>
        <Spacer height="10px" /> 
      </Box>

      <Box
        sx={{
          width: "322px",
          height: isMobile ? "165px" : "250px",

          display: "flex",
          flexDirection: "column",
          bgcolor: "background.paper",
          padding: "20px",
          borderRadius: '19px'
        }}
      >
    {loading && groupsWithJoinRequests.length === 0 && (
       <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>
      <CustomLoader />
      </Box>
    )}
    {!loading && (groupsWithJoinRequests.length === 0 || groupsWithJoinRequests?.filter((group)=> group?.data?.length > 0).length === 0) && (
    <Box
    sx={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      alignItems: 'center',
      height: '100%',
   
    }}
  >
    <Typography
      sx={{
        fontSize: "11px",
        fontWeight: 400,
        color: 'rgba(255, 255, 255, 0.2)'
      }}
    >
      Nothing to display
    </Typography>
  </Box>
    )}
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", maxHeight: '300px', overflow: 'auto' }}>
      {groupsWithJoinRequests?.map((group)=> {
        if(group?.data?.length === 0) return null
        return (
          <ListItem
          key={group?.groupId}
          onClick={()=> {
            setSelectedGroup(group?.group)
            setMobileViewMode('group')
            getTimestampEnterChat()
            setGroupSection("announcement")
            setOpenManageMembers(true)
            setTimeout(() => {
              executeEvent("openGroupJoinRequest", {});

            }, 300);
          }}
          sx={{
            marginBottom: '20px'
          }}
          disablePadding
          secondaryAction={
            <IconButton edge="end" aria-label="comments">
              <GroupAddIcon
                sx={{
                  color: "white",
                  fontSize: '18px'
                }}
              />
            </IconButton>
          }
        >
          <ListItemButton  sx={{
                padding: "0px",
              }} disableRipple role={undefined} dense>
            
            <ListItemText  sx={{
                  "& .MuiTypography-root": {
                    fontSize: "13px",
                    fontWeight: 400,
                  },
                }} primary={`${group?.group?.groupName} has ${group?.data?.length} pending join requests.`} />
          </ListItemButton>
        </ListItem>
        )

      })}
     
     
      
    </List>
    </Box>
    </Box>
  );
};

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
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { executeEvent } from "../../utils/events";
import { Box, Typography } from "@mui/material";
import { Spacer } from "../../common/Spacer";
import { getGroupNames } from "./UserListOfInvites";
import { CustomLoader } from "../../common/CustomLoader";
import { getBaseApiReact } from "../../App";

export const GroupInvites = ({ myAddress, setOpenAddGroup }) => {
  const [groupsWithJoinRequests, setGroupsWithJoinRequests] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const getJoinRequests = async ()=> {
    try {
      setLoading(true)
      const response = await fetch(`${getBaseApiReact()}/groups/invites/${myAddress}/?limit=0`);
      const data = await response.json();
      const resMoreData = await getGroupNames(data)

     setGroupsWithJoinRequests(resMoreData)
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    if (myAddress) {
      getJoinRequests()
    }
  }, [myAddress]);


  return (
     <Box sx={{
      width: '360px',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: "background.paper",
      padding: '20px'
    }}>
    <Typography sx={{
      fontSize: '14px'
    }}>Group Invites</Typography>
    <Spacer height="10px" />
    {loading && groupsWithJoinRequests.length === 0 && (
       <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>
      <CustomLoader />
      </Box>
    )}
    {!loading && groupsWithJoinRequests.length === 0 && (
      <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>
       <Typography sx={{
        fontSize: '12px'
      }}>No invites</Typography>
      </Box>
    )}
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", maxHeight: '300px', overflow: 'auto' }}>
      {groupsWithJoinRequests?.map((group)=> {
        return (
          <ListItem
          key={group?.groupId}
          onClick={()=> {            
            setOpenAddGroup(true)
            setTimeout(() => {
              executeEvent("openGroupInvitesRequest", {});

            }, 300);
          }}
          disablePadding
          secondaryAction={
            <IconButton edge="end" aria-label="comments">
              <GroupAddIcon
                sx={{
                  color: "white",
                }}
              />
            </IconButton>
          }
        >
          <ListItemButton disableRipple role={undefined} dense>
            
            <ListItemText primary={`${group?.groupName} has invited you`} />
          </ListItemButton>
        </ListItem>
        )

      })}
     
     
      
    </List>
    </Box>
  );
};

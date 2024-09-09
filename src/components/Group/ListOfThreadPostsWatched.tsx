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
import VisibilityIcon from '@mui/icons-material/Visibility';

export const ListOfThreadPostsWatched = () => {
  const [posts, setPosts] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  const getPosts = async ()=> {
    try {
      await new Promise((res, rej) => {
        chrome.runtime.sendMessage(
          {
            action: "getThreadActivity",
            payload: {
              
            },
          },
          (response) => {
         
            if (!response?.error) {
              if(!response) {
                res(null)
                return
              }
              const uniquePosts = response.reduce((acc, current) => {
                const x = acc.find(item => item?.thread?.threadId === current?.thread?.threadId);
                if (!x) {
                  return acc.concat([current]);
                } else {
                  return acc;
                }
              }, []);
              setPosts(uniquePosts)
              res(uniquePosts);
              return
            }
            rej(response.error);
          }
        );
      });
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {

      getPosts()
    
  }, []);



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
    }}>New Thread Posts</Typography>
    <Spacer height="10px" />
    {loading && posts.length === 0 && (
       <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>
      <CustomLoader />
      </Box>
    )}
    {!loading && posts.length === 0 && (
      <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>
       <Typography sx={{
        fontSize: '12px'
      }}>No thread post notifications</Typography>
      </Box>
    )}
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper", maxHeight: '300px', overflow: 'auto' }}>
      {posts?.map((post)=> {
        return (
          <ListItem
          key={post?.thread?.threadId}
          onClick={()=> {            
            executeEvent("openThreadNewPost", {
              data: post
            });
          }}
          disablePadding
          secondaryAction={
            <IconButton edge="end" aria-label="comments">
              <VisibilityIcon
                sx={{
                  color: "red",
                }}
              />
            </IconButton>
          }
        >
          <ListItemButton disableRipple role={undefined} dense>
            
            <ListItemText primary={`New post in ${post?.thread?.threadData?.title}`} />
          </ListItemButton>
        </ListItem>
        )

      })}
     
     
      
    </List>
    </Box>
  );
};

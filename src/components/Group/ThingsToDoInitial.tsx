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
import { Box, Typography } from "@mui/material";
import { Spacer } from "../../common/Spacer";

export const ThingsToDoInitial = ({ myAddress, name, hasGroups, balance }) => {
  const [checked1, setChecked1] = React.useState(false);
  const [checked2, setChecked2] = React.useState(false);
  const [checked3, setChecked3] = React.useState(false);

//   const getAddressInfo = async (address) => {
//     const response = await fetch(getBaseApiReact() + "/addresses/" + address);
//     const data = await response.json();
//     if (data.error && data.error === 124) {
//       setChecked1(false);
//     } else if (data.address) {
//       setChecked1(true);
//     }
//   };

//   const checkInfo = async () => {
//     try {
//       getAddressInfo(myAddress);
//     } catch (error) {}
//   };

    

  React.useEffect(() => {
    if (balance && +balance >= 6) {
      setChecked1(true)
    }
  }, [balance]);

  React.useEffect(()=> {
    if(hasGroups) setChecked3(true)
  }, [hasGroups])

  React.useEffect(()=> {
    if(name) setChecked2(true)
  }, [name])

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
    }}>Suggestion: Complete the following</Typography>
    <Spacer height="10px" />
    <List sx={{ width: "100%", maxWidth: 360 }}>
      <ListItem
        // secondaryAction={
        //   <IconButton edge="end" aria-label="comments">
        //     <InfoIcon
        //       sx={{
        //         color: "white",
        //       }}
        //     />
        //   </IconButton>
        // }
        disablePadding
      >
        <ListItemButton disableRipple role={undefined} dense>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={checked1}
              tabIndex={-1}
              disableRipple
              disabled={true}
              sx={{
                "&.Mui-checked": {
                  color: "white", // Customize the color when checked
                },
                "& .MuiSvgIcon-root": {
                  color: "white",
                },
              }}
            />
          </ListItemIcon>
          <ListItemText primary={`Have at least 6 QORT in your wallet`} />
        </ListItemButton>
      </ListItem>
      <ListItem
        //  secondaryAction={
        //     <IconButton edge="end" aria-label="comments">
        //       <InfoIcon
        //         sx={{
        //           color: "white",
        //         }}
        //       />
        //     </IconButton>
        //   }
        disablePadding
      >
        <ListItemButton disableRipple role={undefined} dense>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={checked2}
              tabIndex={-1}
              disableRipple
              disabled={true}
              sx={{
                "&.Mui-checked": {
                  color: "white", // Customize the color when checked
                },
                "& .MuiSvgIcon-root": {
                  color: "white",
                },
              }}
            />
          </ListItemIcon>
          <ListItemText primary={`Register a name`} />
        </ListItemButton>
      </ListItem>
      <ListItem
        //  secondaryAction={
        //     <IconButton edge="end" aria-label="comments">
        //       <InfoIcon
        //         sx={{
        //           color: "white",
        //         }}
        //       />
        //     </IconButton>
        //   }
        disablePadding
      >
        <ListItemButton disableRipple role={undefined} dense>
          <ListItemIcon>
            <Checkbox
              edge="start"
              checked={checked3}
              tabIndex={-1}
              disableRipple
              disabled={true}
              sx={{
                "&.Mui-checked": {
                  color: "white", // Customize the color when checked
                },
                "& .MuiSvgIcon-root": {
                  color: "white",
                },
              }}
            />
          </ListItemIcon>
          <ListItemText primary={`Join a group`} />
        </ListItemButton>
      </ListItem>
    </List>
    </Box>
  );
};

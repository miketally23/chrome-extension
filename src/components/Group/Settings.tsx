import * as React from "react";
import { useCallback, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import ListOfMembers from "./ListOfMembers";
import { InviteMember } from "./InviteMember";
import { ListOfInvites } from "./ListOfInvites";
import { ListOfBans } from "./ListOfBans";
import { ListOfJoinRequests } from "./ListOfJoinRequests";
import { Box, FormControlLabel, Switch, Tab, Tabs, styled } from "@mui/material";
import { CustomizedSnackbars } from "../Snackbar/Snackbar";
import { MyContext, isMobile } from "../../App";
import { getGroupMembers, getNames } from "./Group";
import { LoadingSnackbar } from "../Snackbar/LoadingSnackbar";
import { getFee } from "../../background";
import { LoadingButton } from "@mui/lab";
import { executeEvent, subscribeToEvent, unsubscribeFromEvent } from "../../utils/events";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const LocalNodeSwitch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export const Settings = ({
  address,
  open,
  setOpen,
}) => {
  const [checked, setChecked] = React.useState(false);
  const [generalChatEnabled, setGeneralChatEnabled] = useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    chrome?.runtime?.sendMessage(
      {
        action: "addUserSettings",
        payload: {
          keyValue: {
              key: 'disable-push-notifications',
              value: event.target.checked
          },
        },
      }
    );
  };

  const handleGeneralChatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextEnabled = event.target.checked;
    setGeneralChatEnabled(nextEnabled);
    // Store as disable flag
    new Promise((resolve, reject) => {
      chrome?.runtime?.sendMessage(
        {
          action: "addUserSettings",
          payload: {
            keyValue: {
              key: "disable-general-chat",
              value: !nextEnabled,
            },
          },
        },
        (response) => {
          if (!response?.error) {
            resolve(response);
            return;
          }
          reject(response.error);
        }
      );
    }).catch((error) => {
      console.error(
        "Failed to add user settings:",
        error?.message || error || "An error occurred"
      );
    });
    // Notify the app to update visibility immediately
    executeEvent('generalChatVisibilityChanged', { disabled: !nextEnabled });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getUserSettings = useCallback(async () => {
    try {
      return new Promise((res, rej) => {
        chrome?.runtime?.sendMessage(
          {
            action: "getUserSettings",
            payload: {
              key: "disable-push-notifications",
            },
          },
          (response) => {
            if (!response?.error) {
              setChecked(response || false);
              res(response);
              return;
            }
            rej(response.error);
          }
        );
      });
    } catch (error) {
      console.log("error", error);
    }
  }, [setChecked]);

  const getGeneralChatSetting = useCallback(async () => {
    try {
      return new Promise((res, rej) => {
        chrome?.runtime?.sendMessage(
          {
            action: "getUserSettings",
            payload: {
              key: "disable-general-chat",
            },
          },
          (response) => {
            if (!response?.error) {
              setGeneralChatEnabled(!(response || false));
              res(response);
              return;
            }
            rej(response.error);
          }
        );
      });
    } catch (error) {
      console.log('error', error);
    }
  }, [setGeneralChatEnabled]);

  React.useEffect(() => {
    getUserSettings();
    getGeneralChatSetting();
  }, [getUserSettings, getGeneralChatSetting]);

 

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", bgcolor: "#232428" }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              General Settings
            </Typography>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            bgcolor: "#27282c",
            flexGrow: 1,
            overflowY: "auto",
            color: "white",
            padding: '20px'
          }}
        >

          <FormControlLabel
            sx={{
              color: 'white'
            }}
            control={<LocalNodeSwitch checked={checked}
              onChange={handleChange} />}
            label="Disable all push notifications"
          />

          <FormControlLabel
            sx={{
              color: 'white',
            }}
            control={
              <LocalNodeSwitch
                checked={generalChatEnabled}
                onChange={handleGeneralChatChange}
              />
            }
            label="General chat"
          />

        </Box>

      </Dialog>

    </React.Fragment>
  );
};

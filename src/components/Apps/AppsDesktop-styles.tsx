import {
    AppBar,
    Button,
    Toolbar,
    Typography,
    Box,
    TextField,
    InputLabel,
    ButtonBase,
  } from "@mui/material";
  import { styled } from "@mui/system";
  
  export const AppsDesktopLibraryHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: 'column',
    flexShrink: 0,
    width: '100%'
  }));
  export const AppsDesktopLibraryBody = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: 'column',
    flexGrow: 1,
    width: '100%'
  }));
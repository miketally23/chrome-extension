import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, MenuItem, Select, ButtonBase } from '@mui/material';
import { HomeIcon } from '../../assets/Icons/HomeIcon';
import { LogoutIcon } from '../../assets/Icons/LogoutIcon';
import { NotificationIcon } from '../../assets/Icons/NotificationIcon';
import { ArrowDownIcon } from '../../assets/Icons/ArrowDownIcon';
import { MessagingIcon } from '../../assets/Icons/MessagingIcon';

const Header = ({
  logoutFunc,
  goToHome,
  setIsOpenDrawerProfile,
  isThin,
  setMobileViewModeKeepOpen
  // selectedGroup,
  // onHomeClick,
  // onLogoutClick,
  // onGroupChange,
  // onWalletClick,
  // onNotificationClick,
}) => {
  if(isThin){


    return (
      <AppBar position="static" sx={{ backgroundColor: 'background: rgba(0, 0, 0, 0.2)', boxShadow: 'none' }}>
      <Toolbar sx={{ justifyContent: 'space-between', padding: '0 16px', height: '30px', minHeight: '30px' }}>
        {/* Left Home Icon */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          width: '75px'
        }}>
        <IconButton edge="start" color="inherit" aria-label="home" 
onClick={()=> {
  setMobileViewModeKeepOpen('')
  goToHome()
}}
        // onClick={onHomeClick}
        >
          <HomeIcon height={16} width={18}  color="rgba(145, 145, 147, 1)" />
        </IconButton>
        <IconButton edge="start" color="inherit" aria-label="home" 
onClick={()=> {
  setMobileViewModeKeepOpen()
  goToHome()
}}
        // onClick={onHomeClick}
        >
          <NotificationIcon   color="rgba(145, 145, 147, 1)" />
        </IconButton>
        </Box>
       

        {/* Center Title */}
        <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 1)', fontWeight: 700, letterSpacing: '2px' , fontSize: '13px'}}>
          QORTAL
        </Typography>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          width: '75px',
          justifyContent: 'flex-end'
        }}>
        {/* Right Logout Icon */}
        
        <IconButton onClick={()=> {
          setMobileViewModeKeepOpen('messaging')
        }} edge="end" color="inherit" aria-label="logout" 

// onClick={onLogoutClick}
>
  <MessagingIcon height={16} width={16} color="rgba(145, 145, 147, 1)" />
</IconButton>
        <IconButton onClick={logoutFunc} edge="end" color="inherit" aria-label="logout" 

        // onClick={onLogoutClick}
        >
          <LogoutIcon height={16} width={14} color="rgba(145, 145, 147, 1)" />
        </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
    )
  }
  return (
    <>
      {/* Main Header */}
      <AppBar position="static" sx={{ backgroundColor: 'var(--bg-primary)', boxShadow: 'none' }}>
        <Toolbar sx={{ justifyContent: 'space-between', padding: '0 16px', height: '60px' }}>
          {/* Left Home Icon */}
          <IconButton edge="start" color="inherit" aria-label="home" 
  onClick={goToHome}
          // onClick={onHomeClick}
          >
            <HomeIcon  color="rgba(145, 145, 147, 1)" />
          </IconButton>

          {/* Center Title */}
          <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 1)', fontWeight: 700, letterSpacing: '2px' , fontSize: '13px'}}>
            QORTAL
          </Typography>

          {/* Right Logout Icon */}
          <IconButton onClick={logoutFunc} edge="end" color="inherit" aria-label="logout" 

          // onClick={onLogoutClick}
          >
            <LogoutIcon color="rgba(145, 145, 147, 1)" />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Secondary Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--bg-3)',
          padding: '8px 16px',
          position: 'relative',
          height: '27px'
        }}
      >
    
        <Box sx={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          userSelect: 'none'
        }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 1)', fontWeight: 400,  fontSize: '11px'}}>
            Palmas
          </Typography>
{/* 
          <ArrowDownIcon /> */}
        </Box>
        
      

        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translate(-50%, 50%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 500,
            width: '30px', // Adjust as needed
            height: '30px', // Adjust as needed
            backgroundColor: '#232428', // Circle background
            borderRadius: '50%',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)', // Optional shadow for the circle
          }}
        >
          <IconButton color="inherit">
            <NotificationIcon color="rgba(255, 255, 255, 1)" />
          </IconButton>
        </Box>

        {/* Right Dropdown */}
        <ButtonBase onClick={()=> {
          setIsOpenDrawerProfile(true)
        }}>
        <Box sx={{
          display: 'flex',
          gap: '10px',
          alignItems: 'center'
        }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 1)', fontWeight: 400,  fontSize: '11px'}}>
            View Wallet
          </Typography>

          <ArrowDownIcon />
        </Box>
        </ButtonBase>
      </Box>
    </>
  );
};

export default Header;

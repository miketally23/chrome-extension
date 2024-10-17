import React, { useMemo, useState } from 'react'
import { AppCircle, AppCircleContainer, AppCircleLabel, AppsContainer, AppsParent } from './Apps-styles'
import { Avatar, ButtonBase } from '@mui/material'
import { Add } from '@mui/icons-material'
import { getBaseApiReact } from '../../App'
import LogoSelected from "../../assets/svgs/LogoSelected.svg";

export const AppsHome = ({downloadedQapps, setMode}) => {
   
  
  return (
    <AppsParent>
        <AppsContainer>
            <ButtonBase onClick={()=> {
                setMode('library')
            }}>
            <AppCircleContainer>
            <AppCircle>
                <Add>+</Add>
            </AppCircle>
            <AppCircleLabel>Add</AppCircleLabel>
            </AppCircleContainer>
            </ButtonBase>
            {downloadedQapps?.map((qapp)=> {
                return (
                    <ButtonBase sx={{
                        height: '80px',
                        width: '60px'
                    }}>
                    <AppCircleContainer>
                    <AppCircle sx={{
                        border: 'none'
                    }}>
                        <Avatar
            sx={{
              height: "31px",
              width: "31px",
            }}
            alt={qapp?.name}
        src={`${getBaseApiReact()}/arbitrary/THUMBNAIL/${qapp?.name}/qortal_avatar?async=true`}
          >
             <img style={{
                width: '31px',
                height: 'auto'
             }} src={LogoSelected} alt="center-icon"  />
          </Avatar>
                    </AppCircle>
                    <AppCircleLabel>{qapp?.metadata?.title || qapp?.name}</AppCircleLabel>
                    </AppCircleContainer>
                    </ButtonBase>
                )
            })}
            </AppsContainer>
    </AppsParent>
  )
}

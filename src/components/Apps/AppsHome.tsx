import React, { useMemo, useState } from "react";
import {
  AppCircle,
  AppCircleContainer,
  AppCircleLabel,
  AppsContainer,
  AppsParent,
} from "./Apps-styles";
import { Avatar, ButtonBase } from "@mui/material";
import { Add } from "@mui/icons-material";
import { getBaseApiReact } from "../../App";
import LogoSelected from "../../assets/svgs/LogoSelected.svg";
import { executeEvent } from "../../utils/events";

export const AppsHome = ({ downloadedQapps, setMode, myApp, myWebsite, myName }) => {
  return (
      <AppsContainer>
        <ButtonBase
          onClick={() => {
            setMode("library");
          }}
        >
          <AppCircleContainer>
            <AppCircle>
              <Add>+</Add>
            </AppCircle>
            <AppCircleLabel>Add</AppCircleLabel>
          </AppCircleContainer>
        </ButtonBase>
        {myApp &&(
            <ButtonBase
            sx={{
              height: "80px",
              width: "60px",
            }}
            onClick={()=> {
              executeEvent("addTab", {
                data: myApp
              })
            }}
          >
            <AppCircleContainer>
              <AppCircle
                sx={{
                  border: "none",
                }}
              >
                <Avatar
                  sx={{
                    height: "31px",
                    width: "31px",
                    '& img': { 
                      objectFit: 'fill',
                    }
                  }}
                  alt={myApp?.name}
                  src={`${getBaseApiReact()}/arbitrary/THUMBNAIL/${
                    myApp?.name
                  }/qortal_avatar?async=true`}
                >
                  <img
                    style={{
                      width: "31px",
                      height: "auto",
                    }}
                    src={LogoSelected}
                    alt="center-icon"
                  />
                </Avatar>
              </AppCircle>
              <AppCircleLabel>
                {myApp?.name}
              </AppCircleLabel>
            </AppCircleContainer>
          </ButtonBase>
        )}
        {myWebsite &&(
            <ButtonBase
            sx={{
              height: "80px",
              width: "60px",
            }}
            onClick={()=> {
              executeEvent("addTab", {
                data: myWebsite
              })
            }}
          >
            <AppCircleContainer>
              <AppCircle
                sx={{
                  border: "none",
                }}
              >
                <Avatar
                  sx={{
                    height: "31px",
                    width: "31px",
                    '& img': { 
                      objectFit: 'fill',
                    }
                  }}
                  alt={myWebsite?.name}
                  src={`${getBaseApiReact()}/arbitrary/THUMBNAIL/${
                    myWebsite?.name
                  }/qortal_avatar?async=true`}
                >
                  <img
                    style={{
                      width: "31px",
                      height: "auto",
                    }}
                    src={LogoSelected}
                    alt="center-icon"
                  />
                </Avatar>
              </AppCircle>
              <AppCircleLabel>
                {myWebsite?.name}
              </AppCircleLabel>
            </AppCircleContainer>
          </ButtonBase>
        )}
        {downloadedQapps?.filter((item)=> item?.name !== myName).map((app) => {
          return (
            <ButtonBase
              sx={{
                height: "80px",
                width: "60px",
              }}
              onClick={()=> {
                executeEvent("addTab", {
                  data: app
                })
              }}
            >
              <AppCircleContainer>
                <AppCircle
                  sx={{
                    border: "none",
                  }}
                >
                  <Avatar
                    sx={{
                      height: "31px",
                      width: "31px",
                      '& img': { 
                        objectFit: 'fill',
                      }
                    }}
                    alt={app?.name}
                    src={`${getBaseApiReact()}/arbitrary/THUMBNAIL/${
                      app?.name
                    }/qortal_avatar?async=true`}
                  >
                    <img
                      style={{
                        width: "31px",
                        height: "auto",
                      }}
                      src={LogoSelected}
                      alt="center-icon"
                    />
                  </Avatar>
                </AppCircle>
                <AppCircleLabel>
                  {app?.name}
                </AppCircleLabel>
              </AppCircleContainer>
            </ButtonBase>
          );
        })}
      </AppsContainer>
  );
};

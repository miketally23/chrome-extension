import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  AppCircle,
  AppCircleContainer,
  AppCircleLabel,
  AppLibrarySubTitle,
  AppsContainer,
  AppsLibraryContainer,
  AppsParent,
  AppsSearchContainer,
  AppsSearchLeft,
  AppsSearchRight,
  AppsWidthLimiter,
  PublishQAppCTAButton,
  PublishQAppCTALeft,
  PublishQAppCTAParent,
  PublishQAppCTARight,
  PublishQAppDotsBG,
} from "./Apps-styles";
import { Avatar, Box, ButtonBase, InputBase, styled } from "@mui/material";
import { Add } from "@mui/icons-material";
import { MyContext, getBaseApiReact } from "../../App";
import LogoSelected from "../../assets/svgs/LogoSelected.svg";
import IconSearch from "../../assets/svgs/Search.svg";
import IconClearInput from "../../assets/svgs/ClearInput.svg";
import qappDevelopText from "../../assets/svgs/qappDevelopText.svg";
import qappDots from "../../assets/svgs/qappDots.svg";

import { Spacer } from "../../common/Spacer";
import { AppInfoSnippet } from "./AppInfoSnippet";
import { Virtuoso } from "react-virtuoso";
import { executeEvent } from "../../utils/events";
const officialAppList = [
  "q-tube",
  "q-blog",
  "q-share",
  "q-support",
  "q-mail",
  "qombo",
  "q-fund",
  "q-shop",
];

const ScrollerStyled = styled('div')({
    // Hide scrollbar for WebKit browsers (Chrome, Safari)
    "::-webkit-scrollbar": {
      width: "0px",
      height: "0px",
    },
    
    // Hide scrollbar for Firefox
    scrollbarWidth: "none",
  
    // Hide scrollbar for IE and older Edge
    "-ms-overflow-style": "none",
  });
  
  const StyledVirtuosoContainer = styled('div')({
    position: 'relative',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    
    // Hide scrollbar for WebKit browsers (Chrome, Safari)
    "::-webkit-scrollbar": {
      width: "0px",
      height: "0px",
    },
    
    // Hide scrollbar for Firefox
    scrollbarWidth: "none",
  
    // Hide scrollbar for IE and older Edge
    "-ms-overflow-style": "none",
  });

export const AppsLibrary = ({  availableQapps, setMode, myName, hasPublishApp, isShow }) => {
  const [searchValue, setSearchValue] = useState("");
  const virtuosoRef = useRef();
  const { rootHeight } = useContext(MyContext);
  const [appStates, setAppStates] = useState({});

  const handleStateChange = (appId, newState) => {
    setAppStates((prevState) => ({
      ...prevState,
      [appId]: {
        ...(prevState[appId] || {}), // Preserve existing state for the app
        ...newState,         // Merge in the new state properties
      },
    }));
  };
  
  console.log('appStates', appStates)
  const officialApps = useMemo(() => {
    return availableQapps.filter(
      (app) =>
        app.service === "APP" &&
        officialAppList.includes(app?.name?.toLowerCase())
    );
  }, [availableQapps]);

  const [debouncedValue, setDebouncedValue] = useState(""); // Debounced value

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, 350);

    // Cleanup timeout if searchValue changes before the timeout completes
    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]); // Runs effect when searchValue changes

  // Example: Perform search or other actions based on debouncedValue

  const searchedList = useMemo(() => {
    if (!debouncedValue) return [];
    return availableQapps.filter((app) =>
      app.name.toLowerCase().includes(debouncedValue.toLowerCase())
    );
  }, [debouncedValue]);
  console.log("officialApps", searchedList);

  const rowRenderer = (index) => {
   
    let app = searchedList[index];
    console.log('appi', app)
    return <AppInfoSnippet key={`${app?.service}-${app?.name}`} app={app} myName={myName} />;
  };



  return (
      <AppsLibraryContainer sx={{
        display: !isShow && 'none'
      }}>
        <AppsWidthLimiter>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <AppsSearchContainer>
            <AppsSearchLeft>
              <img src={IconSearch} />
              <InputBase
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search for apps"
                inputProps={{
                  "aria-label": "Search for apps",
                  fontSize: "16px",
                  fontWeight: 400,
                }}
              />
            </AppsSearchLeft>
            <AppsSearchRight>
              {searchValue && (
                <ButtonBase
                  onClick={() => {
                    setSearchValue("");
                  }}
                >
                  <img src={IconClearInput} />
                </ButtonBase>
              )}
            </AppsSearchRight>
          </AppsSearchContainer>
        </Box>
        </AppsWidthLimiter>
        <Spacer height="25px" />
        {searchedList?.length > 0 ? (
           <AppsWidthLimiter>
          <StyledVirtuosoContainer sx={{
            height: rootHeight
          }}>
            <Virtuoso
              ref={virtuosoRef}
              data={searchedList}
              itemContent={rowRenderer}
              atBottomThreshold={50}
              followOutput="smooth"
              components={{
                Scroller: ScrollerStyled // Use the styled scroller component
              }}
            />
          </StyledVirtuosoContainer>
          </AppsWidthLimiter>
        ) : (
          <>
            <AppsWidthLimiter>
            <AppLibrarySubTitle>Official Apps</AppLibrarySubTitle>
            <Spacer height="18px" />
            <AppsContainer>
              {officialApps?.map((qapp) => {
                return (
                  <ButtonBase
                    sx={{
                      height: "80px",
                      width: "60px",
                    }}
                    onClick={()=> {
                      executeEvent("addTab", {
                        data: qapp
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
                          }}
                          alt={qapp?.name}
                          src={`${getBaseApiReact()}/arbitrary/THUMBNAIL/${
                            qapp?.name
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
                        {qapp?.metadata?.title || qapp?.name}
                      </AppCircleLabel>
                    </AppCircleContainer>
                  </ButtonBase>
                );
              })}
            </AppsContainer>
            <Spacer height="30px" />
            <AppLibrarySubTitle>{hasPublishApp ? 'Update Apps!' : 'Create Apps!'}</AppLibrarySubTitle>
            <Spacer height="18px" />
            </AppsWidthLimiter>
            <PublishQAppCTAParent>
              <PublishQAppCTALeft>
                <PublishQAppDotsBG>

              <img src={qappDots} />
              </PublishQAppDotsBG>
                <Spacer width="29px" />
              <img src={qappDevelopText} />
              </PublishQAppCTALeft>
              <PublishQAppCTARight onClick={()=> {
                setMode('publish')
              }}>
                <PublishQAppCTAButton>
                  {hasPublishApp ? 'Update' : 'Publish'}
                </PublishQAppCTAButton>
                <Spacer width="20px" />
                </PublishQAppCTARight>
            </PublishQAppCTAParent>
            <AppsWidthLimiter>
           
            <Spacer height="18px" />
            <AppLibrarySubTitle>Categories</AppLibrarySubTitle>
            </AppsWidthLimiter>
          </>
        )}
      </AppsLibraryContainer>
  );
};

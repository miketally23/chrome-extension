import React, { useEffect, useMemo, useState } from "react";
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
} from "./Apps-styles";
import { Avatar, Box, ButtonBase, InputBase } from "@mui/material";
import { Add } from "@mui/icons-material";
import { getBaseApiReact } from "../../App";
import LogoSelected from "../../assets/svgs/LogoSelected.svg";
import IconSearch from "../../assets/svgs/Search.svg";
import IconClearInput from "../../assets/svgs/ClearInput.svg";

import { Spacer } from "../../common/Spacer";
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

export const AppsLibrary = ({ downloadedQapps, availableQapps }) => {
    const [searchValue, setSearchValue] = useState('')
  const officialApps = useMemo(() => {
    return availableQapps.filter((app) => app.service === 'APP' &&
      officialAppList.includes(app?.name?.toLowerCase())
    );
  }, [availableQapps]);

  const [debouncedValue, setDebouncedValue] = useState(''); // Debounced value

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchValue); // Update debounced value after delay
    }, 500); // 500ms debounce time (adjustable)

    // Cleanup timeout if searchValue changes before the timeout completes
    return () => {
      clearTimeout(handler);
    };
  }, [searchValue]); // Runs effect when searchValue changes

  // Example: Perform search or other actions based on debouncedValue
  
  const searchedList = useMemo(()=> {
    if(!debouncedValue) return []
    return availableQapps.filter((app)=> app.name.toLowerCase().includes(debouncedValue.toLowerCase()))
  }, [debouncedValue])
  console.log('officialApps', searchedList)
  
  
  return (
    <AppsParent>
      <AppsLibraryContainer>
        <Box sx={{
            display: 'flex',
            width: '100%',
            justifyContent: 'center'
        }}>
    <AppsSearchContainer>
        <AppsSearchLeft>
            <img src={IconSearch} />
            <InputBase
            value={searchValue}
            onChange={(e)=> setSearchValue(e.target.value)}
                    sx={{ ml: 1, flex: 1 }}
        placeholder="Search for apps"
        inputProps={{ 'aria-label': 'Search for apps', fontSize: '16px', fontWeight: 400 }}
      />
        </AppsSearchLeft>
        <AppsSearchRight>
            {searchValue && (
                  <ButtonBase onClick={()=> {
                    setSearchValue('')
                  }}>
                  <img src={IconClearInput} />
                  </ButtonBase>
            )}
      
        </AppsSearchRight>
    </AppsSearchContainer>
    </Box>
      <Spacer height="25px" />
        {searchedList?.length > 0 ? (
            <>
            {searchedList.map((app)=> {

                return (
                    <AppInfo app={app} />
                )
            })}
            </>
        ) : (
            <>
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
        <Spacer height="18px" />
        <AppLibrarySubTitle>Featured</AppLibrarySubTitle>

        <Spacer height="18px" />
        <AppLibrarySubTitle>Categories</AppLibrarySubTitle>
            </>
        )}
      
      </AppsLibraryContainer>
    </AppsParent>
  );
};

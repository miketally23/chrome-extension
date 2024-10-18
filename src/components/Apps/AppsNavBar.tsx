import React, { useEffect, useRef, useState } from "react";
import {
  AppsNavBarLeft,
  AppsNavBarParent,
  AppsNavBarRight,
} from "./Apps-styles";
import NavBack from "../../assets/svgs/NavBack.svg";
import NavAdd from "../../assets/svgs/NavAdd.svg";
import NavMoreMenu from "../../assets/svgs/NavMoreMenu.svg";
import { ButtonBase, Tab, Tabs } from "@mui/material";
import { executeEvent, subscribeToEvent, unsubscribeFromEvent } from "../../utils/events";
import TabComponent from "./TabComponent";

export const AppsNavBar = () => {
  const [tabs, setTabs] = useState([])
  const [selectedTab, setSelectedTab] = useState([])

  const tabsRef = useRef(null);

  useEffect(() => {
    // Scroll to the last tab whenever the tabs array changes (e.g., when a new tab is added)
    if (tabsRef.current) {
      const tabElements = tabsRef.current.querySelectorAll('.MuiTab-root');
      console.log('tabElements', tabElements)
      if (tabElements.length > 0) {
        const lastTab = tabElements[tabElements.length - 1];
        lastTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' });
      }
    }
  }, [tabs.length]); // Dependency on the number of tabs

  const setTabsToNav = (e) => {
    const {tabs, selectedTab} = e.detail?.data;
   
    setTabs([...tabs])
    setSelectedTab({...selectedTab})
  };

  useEffect(() => {
    subscribeToEvent("setTabsToNav", setTabsToNav);

    return () => {
      unsubscribeFromEvent("setTabsToNav", setTabsToNav);
    };
  }, []);
  return (
    <AppsNavBarParent>
      <AppsNavBarLeft>
        <ButtonBase  onClick={()=> {
          executeEvent("navigateBack", {
          });
        }}>
          <img src={NavBack} />
        </ButtonBase>
        <Tabs
        ref={tabsRef}
      aria-label="basic tabs example"
      variant="scrollable"  // Make tabs scrollable
      scrollButtons={false}
      sx={{
        "& .MuiTabs-indicator": {
          backgroundColor: "white",
        },
        maxWidth: `calc(100vw - 150px)`,  // Ensure the tabs container fits within the available space
        overflow: 'hidden', // Prevents overflow on small screens
      }}
    >
      {tabs?.map((tab) => (
        <Tab
          key={tab.tabId}
          label={<TabComponent isSelected={tab?.tabId === selectedTab?.tabId} app={tab} />} // Pass custom component
          sx={{
            "&.Mui-selected": {
              color: "white",
            },
           padding: '0px',
           margin: '0px',
           minWidth: '0px',
           width: '50px'
          }}
        />
      ))}
    </Tabs>
      </AppsNavBarLeft>
      <AppsNavBarRight sx={{
        gap: '10px'
      }}>
        <ButtonBase onClick={()=> {
          executeEvent("newTabWindow", {
          });
        }}>
          <img style={{
            height: '40px',
            width: '40px'
          }} src={NavAdd} />
        </ButtonBase>
        <ButtonBase>
          <img style={{
            height: '34px',
            width: '34px'
          }} src={NavMoreMenu} />
        </ButtonBase>
      </AppsNavBarRight>
    </AppsNavBarParent>
  );
};

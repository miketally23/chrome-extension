import React from "react";
import {
  AppsNavBarLeft,
  AppsNavBarParent,
  AppsNavBarRight,
} from "./Apps-styles";
import NavBack from "../../assets/svgs/NavBack.svg";
import NavCloseTab from "../../assets/svgs/NavCloseTab.svg";
import NavAdd from "../../assets/svgs/NavAdd.svg";
import NavMoreMenu from "../../assets/svgs/NavMoreMenu.svg";
import { ButtonBase } from "@mui/material";
import { executeEvent } from "../../utils/events";

export const AppsNavBar = () => {
  return (
    <AppsNavBarParent>
      <AppsNavBarLeft>
        <ButtonBase  onClick={()=> {
          executeEvent("navigateBack", {
          });
        }}>
          <img src={NavBack} />
        </ButtonBase>
      </AppsNavBarLeft>
      <AppsNavBarRight sx={{
        gap: '10px'
      }}>
        <ButtonBase>
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

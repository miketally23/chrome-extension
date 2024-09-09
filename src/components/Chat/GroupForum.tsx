import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { GroupMail } from "../Group/Forum/GroupMail";






export const GroupForum = ({
  selectedGroup,
  userInfo,
  secretKey,
  getSecretKey,
  isAdmin,
  myAddress,
  hide,
  defaultThread, 
  setDefaultThread
}) => {
  const [isMoved, setIsMoved] = useState(false);
  useEffect(() => {
    if (hide) {
      setTimeout(() => setIsMoved(true), 300); // Wait for the fade-out to complete before moving
    } else {
      setIsMoved(false); // Reset the position immediately when showing
    }
  }, [hide]);

  return (
    <div
    style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      width: "100%",
      opacity: hide ? 0 : 1,
      visibility: hide && 'hidden',
      position: hide ? 'fixed' : 'relative',
    left: hide && '-1000px'
    }}
  >
   <GroupMail getSecretKey={getSecretKey} selectedGroup={selectedGroup} userInfo={userInfo} secretKey={secretKey} defaultThread={defaultThread} setDefaultThread={setDefaultThread} />

   </div>
  );
};

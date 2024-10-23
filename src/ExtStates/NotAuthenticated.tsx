import React, { useCallback, useEffect, useState } from "react";
import { Spacer } from "../common/Spacer";
import { CustomButton, TextItalic, TextP, TextSpan } from "../App-styles";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import Logo1 from "../assets/svgs/Logo1.svg";
import Logo1Dark from "../assets/svgs/Logo1Dark.svg";
import Info from "../assets/svgs/Info.svg";
import { CustomizedSnackbars } from "../components/Snackbar/Snackbar";

export const NotAuthenticated = ({
  getRootProps,
  getInputProps,
  setExtstate,
  setOpenAdvancedSettings,
  openAdvancedSettings,
  handleFileChangeApiKey,
  apiKey,
  setApiKey,
  globalApiKey,
  handleSetGlobalApikey,
}) => {
  console.log("apiKey", apiKey);
  const [isValidApiKey, setIsValidApiKey] = useState<boolean | null>(null);
  const [hasLocalNode, setHasLocalNode] = useState<boolean | null>(null);
  const [useLocalNode, setUseLocalNode] = useState(false);
  const [openSnack, setOpenSnack] = React.useState(false);
  const [infoSnack, setInfoSnack] = React.useState(null);

  const checkIfUserHasLocalNode = useCallback(async () => {
    try {
      const url = `http://127.0.0.1:12391/admin/status`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data?.syncPercent) {
        setHasLocalNode(true);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    checkIfUserHasLocalNode();
  }, []);

  const validateApiKey = useCallback(async (key) => {
    try {
      const url = `http://127.0.0.1:12391/admin/apikey/test`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          accept: "text/plain",
          "X-API-KEY": key, // Include the API key here
        },
      });

      // Assuming the response is in plain text and will be 'true' or 'false'
      const data = await response.text();
      console.log("data", data);
      if (data === "true") {
        const payload = key;
        chrome?.runtime?.sendMessage(
          { action: "setApiKey", payload },
          (response) => {
            console.log("setApiKey", response);
            if (response) {
              handleSetGlobalApikey(payload);
              setIsValidApiKey(true);
              setUseLocalNode(true);
            }
          }
        );
      } else {
        setIsValidApiKey(false);
        setUseLocalNode(false);
        setInfoSnack({
          type: "error",
          message: "Select a valid apikey",
        });
        setOpenSnack(true);
      }
    } catch (error) {
      setIsValidApiKey(false);
      setUseLocalNode(false);
      setInfoSnack({
        type: "error",
        message: "Select a valid apikey",
      });
      console.error("Error validating API key:", error);
    }
  }, []);

  useEffect(() => {
    if (apiKey) {
      validateApiKey(apiKey);
    }
  }, [apiKey]);

  return (
    <>
      <Spacer height="48px" />
      <div
        className="image-container"
        style={{
          width: "136px",
          height: "154px",
        }}
      >
        <img src={Logo1} className="base-image" />
        <img src={Logo1Dark} className="hover-image" />
      </div>
      <Spacer height="38px" />
      <TextP
        sx={{
          textAlign: "center",
          lineHeight: "15px",
        }}
      >
        WELCOME TO <TextItalic>YOUR</TextItalic> <br></br>
        <TextSpan> QORTAL WALLET</TextSpan>
      </TextP>
      <Spacer height="38px" />
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginLeft: "28px",
        }}
      >
        <CustomButton {...getRootProps()}>
          <input {...getInputProps()} />
          Authenticate
        </CustomButton>
        <Tooltip title="Authenticate by importing your Qortal JSON file" arrow>
          <img src={Info} />
        </Tooltip>
      </Box>

      <Spacer height="6px" />
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          marginLeft: "28px",
        }}
      >
        <CustomButton
          onClick={() => {
            setExtstate("create-wallet");
          }}
        >
          Create account
        </CustomButton>

        <img
          src={Info}
          style={{
            visibility: "hidden",
          }}
        />
      </Box>

      <>
        <Spacer height="15px" />
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <>
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#5EB049', 
                    },
                   
                  }}
                    checked={useLocalNode}
                    onChange={(event) => {
                      if (event.target.checked) {
                        validateApiKey(apiKey);
                      } else {
                        setUseLocalNode(false);
                        const payload = null;
                        chrome?.runtime?.sendMessage(
                          { action: "setApiKey", payload },
                          (response) => {
                            console.log("setApiKey", response);
                            if (response) {
                              globalApiKey = payload;
                              setApiKey(payload);
                              handleSetGlobalApikey(payload);
                              if (!globalApiKey) {
                                setUseLocalNode(false);
                                setOpenAdvancedSettings(false);
                                setApiKey("");
                                handleSetGlobalApikey(payload);
                              }
                            }
                          }
                        );
                      }
                    }}
                    disabled={false}
                    defaultChecked
                  />
                }
                label="Use Local Node"
              />
            </Box>

            <>
              <Button variant="contained" component="label">
                {apiKey ? "Change " : "Import "} apiKey.txt
                <input
                  type="file"
                  accept=".txt"
                  hidden
                  onChange={handleFileChangeApiKey} // File input handler
                />
              </Button>
              <Spacer height="5px" />

              <Spacer height="5px" />
              {apiKey && (
                <>
                  <Button
                    onClick={() => {
                      const payload = null;
                      chrome?.runtime?.sendMessage(
                        { action: "setApiKey", payload },
                        (response) => {
                          console.log("setApiKey", response);
                          if (response) {
                            globalApiKey = payload;
                            setApiKey(payload);
                            if (!globalApiKey) {
                              setUseLocalNode(false);
                              setOpenAdvancedSettings(false);
                              setApiKey("");
                            }
                          }
                        }
                      );
                    }}
                    variant="contained"
                    sx={{
                      color: "white",
                    }}
                  >
                    Clear Apikey
                  </Button>
                  <Typography
                    sx={{
                      fontSize: "12px",
                    }}
                  >
                    {"Apikey : "} {apiKey}
                  </Typography>
                </>
              )}
            </>
          </>
        </Box>
      </>
      <CustomizedSnackbars
        open={openSnack}
        setOpen={setOpenSnack}
        info={infoSnack}
        setInfo={setInfoSnack}
      />
    </>
  );
};

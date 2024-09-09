import { Box, Button, Typography } from '@mui/material'
import React, { useContext } from 'react'
import { CustomizedSnackbars } from '../Snackbar/Snackbar';
import { LoadingButton } from '@mui/lab';
import { MyContext } from '../../App';
import { getFee } from '../../background';

export const CreateCommonSecret = ({groupId, secretKey, isOwner, myAddress, secretKeyDetails, userInfo, noSecretKey}) => {
  const { show, setTxList } = useContext(MyContext);

  const [openSnack, setOpenSnack] = React.useState(false);
  const [infoSnack, setInfoSnack] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false)
    const createCommonSecret = async ()=> {
        try {
          const fee = await getFee('ARBITRARY')
          await show({
            message: "Would you like to perform an ARBITRARY transaction?" ,
            publishFee: fee.fee + ' QORT'
          })

          
          setIsLoading(true)
            chrome.runtime.sendMessage({ action: "encryptAndPublishSymmetricKeyGroupChat", payload: {
                groupId: groupId,
                previousData: secretKey
            } }, (response) => {
                if (!response?.error) {
                  setInfoSnack({
                    type: "success",
                    message: "Successfully re-encrypted secret key. It may take a couple of minutes for the changes to propagate. Refresh the group in 5mins",
                  });
                  setOpenSnack(true);
                  setTxList((prev)=> [{
                    ...response,
                    type: 'created-common-secret',
                    label: `Published secret key for group ${groupId}: awaiting confirmation`,
                    labelDone: `Published secret key for group ${groupId}: success!`,
                    done: false,
                    groupId,
                    
                  }, ...prev])
                }
                setIsLoading(false)
              });
        } catch (error) {
            
        }
    }


  return (
    <Box sx={{
      padding: '25px',
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
      maxWidth: '350px',
      background: '#4444'
    }}>
      <LoadingButton loading={isLoading} loadingPosition="start" color="warning" variant='contained' onClick={createCommonSecret}>Re-encyrpt key</LoadingButton>
      {noSecretKey ? (
         <Box>
         <Typography>There is no group secret key. Be the first admin to publish one!</Typography>
       </Box>
      ) : isOwner && secretKeyDetails && userInfo?.name && userInfo.name !== secretKeyDetails?.name  ? (
        <Box>
        <Typography>The latest group secret key was published by a non-owner. As the owner of the group please re-encrypt the key as a safeguard</Typography>
      </Box>
      ): (
        <Box>
        <Typography>The group member list has changed. Please re-encrypt the secret key.</Typography>
      </Box>
      )}
        <CustomizedSnackbars open={openSnack} setOpen={setOpenSnack} info={infoSnack} setInfo={setInfoSnack}  />
    </Box>
    
  )
}

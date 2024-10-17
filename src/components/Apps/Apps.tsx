import React, { useEffect, useState } from 'react'
import { AppsHome } from './AppsHome'
import { Spacer } from '../../common/Spacer'
import { getBaseApiReact } from '../../App'
import { AppsLibrary } from './AppsLibrary'

export const Apps = () => {
    const [mode, setMode] = useState('home')

    const [availableQapps, setAvailableQapps] = useState([])
    const [downloadedQapps, setDownloadedQapps] = useState([])

    const getQapps = React.useCallback(
        async () => {
          try {
            let apps = []
            let websites = []
            // dispatch(setIsLoadingGlobal(true))
            const url = `${getBaseApiReact()}/arbitrary/resources/search?service=APP&mode=ALL&includestatus=true&limit=0&includemetadata=true`;
           
            const response =  await fetch(url, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
            if(!response?.ok) return
            const responseData = await response.json();
            const urlWebsites = `${getBaseApiReact()}/arbitrary/resources/search?service=WEBSITE&mode=ALL&includestatus=true&limit=0&includemetadata=true`;
           
            const responseWebsites =  await fetch(urlWebsites, {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              });
            if(!responseWebsites?.ok) return
            const responseDataWebsites = await responseWebsites.json();
            apps = responseData
            websites = responseDataWebsites
            const combine = [...apps, ...websites] 
            setAvailableQapps(combine)
            setDownloadedQapps(combine.filter((qapp)=> qapp?.status?.status === 'READY'))
          } catch (error) {
          } finally {
            // dispatch(setIsLoadingGlobal(false))
          }
        },
        []
      );
    useEffect(()=> {
        getQapps()
    }, [getQapps])

  return (
    <>
    <Spacer height="30px" />
    {mode === 'home' && <AppsHome downloadedQapps={downloadedQapps} setMode={setMode} />}
    {mode === 'library' && <AppsLibrary downloadedQapps={downloadedQapps} availableQapps={availableQapps} />}
    </>
  )
}

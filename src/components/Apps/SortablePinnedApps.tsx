import React, { useEffect, useMemo, useRef, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable } from '@dnd-kit/sortable';
import { KeyboardSensor, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Avatar, ButtonBase } from '@mui/material';
import { AppCircle, AppCircleContainer, AppCircleLabel } from './Apps-styles';
import { getBaseApiReact } from '../../App';
import { executeEvent } from '../../utils/events';
import { settingsLocalLastUpdatedAtom, sortablePinnedAppsAtom } from '../../atoms/global';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { saveToLocalStorage } from './AppsNavBar';
import { ContextMenuPinnedApps } from '../ContextMenuPinnedApps';

const SortableItem = ({ id, name, app }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    console.log('namednd', name)
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '10px',
        border: '1px solid #ccc',
        marginBottom: '5px',
        borderRadius: '4px',
        backgroundColor: '#f9f9f9',
        cursor: 'grab',
        color: 'black'
    };

    return (
      <ContextMenuPinnedApps app={app}>
        <ButtonBase
        ref={setNodeRef} {...attributes} {...listeners}
              sx={{
                height: "80px",
                width: "60px",
                transform: CSS.Transform.toString(transform),
                transition,
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
                    alt={app?.metadata?.title || app?.name}
                    src={`${getBaseApiReact()}/arbitrary/THUMBNAIL/${
                      app?.name
                    }/qortal_avatar?async=true`}
                  >
                    <img
                      style={{
                        width: "31px",
                        height: "auto",
                      }}
                    //   src={LogoSelected}
                      alt="center-icon"
                    />
                  </Avatar>
                </AppCircle>
                <AppCircleLabel>
                  {app?.metadata?.title || app?.name}
                </AppCircleLabel>
              </AppCircleContainer>
            </ButtonBase>
            </ContextMenuPinnedApps>
    );
};

export const SortablePinnedApps = ({  myWebsite, myApp, availableQapps = [] }) => {
    const [pinnedApps, setPinnedApps] = useRecoilState(sortablePinnedAppsAtom);
    const setSettingsLocalLastUpdated = useSetRecoilState(settingsLocalLastUpdatedAtom);

    const transformPinnedApps = useMemo(()=> {
        console.log({myWebsite, myApp, availableQapps, pinnedApps})
        let pinned = [...pinnedApps]
        const findMyWebsite = pinned?.find((item)=> item?.service === myWebsite?.service && item?.name === myWebsite?.name)
        const findMyApp = pinned?.find((item)=> item?.service === myApp?.service && item?.name === myApp?.name)

        if(myWebsite && !findMyWebsite){
            pinned.unshift(myWebsite)
        }
        if(myApp && !findMyApp){
            pinned.unshift(myApp)
        }
        pinned = pinned.map((pin)=> {
            const findIndex = availableQapps?.findIndex((item)=> item?.service === pin?.service && item?.name === pin?.name)
            if(findIndex !== -1) return availableQapps[findIndex]

            return pin
        })
        return pinned
    }, [myApp, myWebsite, pinnedApps, availableQapps])
    console.log('transformPinnedApps', transformPinnedApps)
    // const hasSetPinned = useRef(false)
    // useEffect(() => {
    //     if (!apps || apps.length === 0) return;

    //     setPinnedApps((prevPinnedApps) => {
    //         // Create a map of the previous pinned apps for easy lookup
    //         const pinnedAppsMap = new Map(prevPinnedApps.map(app => [`${app?.service}-${app?.name}`, app]));

    //         // Update the pinnedApps list based on new apps
    //         const updatedPinnedApps = apps.map(app => {
    //             const id = `${app?.service}-${app?.name}`;
    //             // Keep the existing app from pinnedApps if it exists
    //             return pinnedAppsMap.get(id) || app;
    //         });

    //         return updatedPinnedApps;
    //     });
    // }, [apps]);

    console.log('dnd',{pinnedApps})
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10, // Set a distance to avoid triggering drag on small movements
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                distance: 10, // Also apply to touch
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (!over) return; // Make sure the drop target exists

        if (active.id !== over.id) {
            const oldIndex = transformPinnedApps.findIndex((item) => `${item?.service}-${item?.name}` === active.id);
            const newIndex = transformPinnedApps.findIndex((item) => `${item?.service}-${item?.name}` === over.id);

            const newOrder = arrayMove(transformPinnedApps, oldIndex, newIndex);
            setPinnedApps(newOrder);
            saveToLocalStorage('ext_saved_settings','sortablePinnedApps',  newOrder)
            setSettingsLocalLastUpdated(Date.now())
        }
    };
    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={transformPinnedApps.map((app) => `${app?.service}-${app?.name}`)}>
                {transformPinnedApps.map((app) => (
                    <SortableItem key={`${app?.service}-${app?.name}`} id={`${app?.service}-${app?.name}`} name={app?.name} app={app} />
                ))}
            </SortableContext>
        </DndContext>
    );
};


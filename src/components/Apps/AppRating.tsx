import { Rating } from '@mui/material'
import React, { useState } from 'react'

export const AppRating = () => {
    const [value, setValue] = useState(0)
  return (
    <div>
        <Rating value={value}
  onChange={(event, newValue) => {
   
  }} precision={0.1} />
    </div>
  )
}

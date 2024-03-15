import { Box } from '@mui/material'
import React from 'react'

const Logo = ({sx}) => {
    return (
        <Box
            component="img"
            src="https://summitsoft.com/wp-content/uploads/2020/05/Icon-graphic-ADVANTAGES.png"
            sx={{width:40,height:40,cursor:'pointer',...sx}}
        />
    )
}

export default Logo
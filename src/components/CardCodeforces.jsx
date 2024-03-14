import { Box, Card, Typography } from "@mui/material";
import React from "react";

const CardCodeforces = (props) => {
    const {userProfile} = props;
    return(
        <Card sx={{mt:2, maxWidth:400}}>
            <Box> 
            <Box style={{'display':'flex', 'flexDirection':'row'}}> <Typography>Handle:</Typography>  <Typography>{userProfile.handle}</Typography> </Box>
            <Box style={{'display':'flex', 'flexDirection':'row'}}> <Typography>Rank: </Typography><Typography>{userProfile.rank}</Typography></Box>
            <Box style={{'display':'flex', 'flexDirection':'row'}}> <Typography>Rating:</Typography> <Typography>{userProfile.rating}</Typography></Box>
            <Box style={{'display':'flex', 'flexDirection':'row'}}> <Typography>MaxRank: </Typography> <Typography>{userProfile.maxRank}</Typography></Box>
            <Box style={{'display':'flex', 'flexDirection':'row'}}> <Typography>MaxRating:</Typography> <Typography> {userProfile.maxRating}</Typography></Box>
            <Box style={{'display':'flex', 'flexDirection':'row'}}> <Typography>Friend:</Typography> <Typography> {userProfile.friends}</Typography></Box>
            <Box style={{'display':'flex', 'flexDirection':'row'}}> <Typography>Questions:</Typography> <Typography> {userProfile.questionSolved}</Typography></Box>
            </Box>
        </Card>
    )
}

export default CardCodeforces;

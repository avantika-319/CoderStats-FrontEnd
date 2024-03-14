import { Box, Card, Typography } from "@mui/material";
import React from "react";

const CardLeetcode = (props)=>{
    const {userProfile} = props;
    return(
    <Card sx={{mt:2, maxWidth:400}}>
          <Box style={{'display':'flex', 'flexDirection':'row'}}><Typography>Avatar:</Typography> <img src={userProfile.userAvatar} alt="avatar"/></Box>
          <Box style={{'display':'flex', 'flexDirection':'row'}}> <Typography>Handle:</Typography>  <Typography>{userProfile.username}</Typography> </Box>
          <Box style={{'display':'flex', 'flexDirection':'row'}}> <Typography>Rank: </Typography><Typography>{userProfile.ranking}</Typography></Box>
          <Box style={{'display':'flex', 'flexDirection':'row'}}> <Typography>Rating:</Typography> <Typography>{userProfile.rating}</Typography></Box>
          <Box style={{'display':'flex', 'flexDirection':'row'}}><Typography>Badge: </Typography> <Typography>{userProfile.badge?.name}</Typography></Box>
          <Box style={{'display':'flex', 'flexDirection':'row'}}><Typography>Contest Attended:</Typography> <Typography> {userProfile.attendedContestsCount}</Typography></Box>
          <Box><Typography>problemSolved</Typography></Box>
          <>
          {
            userProfile.languageProblemCount?.map((item,index)=>{
             return <Box key={index} style={{'display':'flex', 'flexDirection':'row'}}><Typography>{item.languageName} : </Typography> <Typography> {item.problemsSolved}</Typography></Box>
            })
          }
          </>
    </Card>
    )
}

export default CardLeetcode;
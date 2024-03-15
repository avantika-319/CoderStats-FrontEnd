import { Box, Typography } from "@mui/material";
import React from "react";
import codeforces_logo from '../assets/images/logo.png';
import { get_color} from "../utils/text_util";

const CardRow = (props) =>{
    const {heading, data} = props;
    return (
        <Box style={{'display':'flex', 'flexDirection':'row', 'justifyContent':'space-between'}}>
            <Typography variant="h6">{heading}:</Typography> <Typography variant="h6"> {data} </Typography>
        </Box>
    )
}

const CardCodeforces = (props) =>{
    const {userProfile} = props;
    const rankColor = get_color(userProfile?.rating)
    const maxRankColor = get_color(userProfile?.maxRating);
    return(
        <Box sx={{mt:2}}>
            <Box mb={1}> 
                <Box style={{'display':'flex', 'flexDirection':'row', 'alignItems' : 'center'}}>
                    <img src={codeforces_logo} alt="codeforce-icon" style={{height : 22, marginRight:10}}/> 
                    <Typography variant="h5" fontWeight="bold">{userProfile.handle}</Typography> 
                </Box>
                <Box style={{'display':'flex', 'flexDirection':'row'}}>
                    <Typography mr={1} fontWeight="bold" color={rankColor} variant="h6">{userProfile.rank}</Typography>
                    <Box style={{'display':'flex', 'flexDirection':'row'}}>
                        <Typography variant="h6">
                            (max:
                            <Typography fontWeight="bold" color={maxRankColor} variant="span"> {userProfile.maxRank}</Typography>
                            )
                        </Typography>
                    </Box>
                </Box>
            </Box>
            <Box>
                <CardRow heading='Contest Rating' data={userProfile.rating}/>
                <CardRow heading='Maximum Rating' data={userProfile.maxRating}/>
                <CardRow heading='Contests' data={userProfile.contests}/>
                <CardRow heading='Friends of' data={userProfile.friends}/>
                <CardRow heading='Questions Solved' data={userProfile.questionSolved}/>
            </Box>
        </Box>
    )
}

export default CardCodeforces;
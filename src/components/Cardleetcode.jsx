import { Box, Card, Chip, Typography } from "@mui/material";
import React from "react";
import leetcode_logo from '../assets/images/leetcode_logo.png'
import { Chart as ChartJS } from 'chart.js/auto'
import { Line } from "react-chartjs-2";

//icons : 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMedal, faRankingStar, faTrophy } from "@fortawesome/free-solid-svg-icons";

const CardRow = (props) =>{
  const {heading, data, variant, icon} = props;
  return (
      <Box style={{'display':'flex', 'flexDirection':'row', 'justifyContent':'space-between'}}>
          <Typography variant={variant}> <FontAwesomeIcon icon={icon}/> {heading}: </Typography> <Typography variant={variant}> {data} </Typography>
      </Box>
  )
}

const Graph = (props)=>{
  const {graphData} = props;
  return (
    <Box>
      <Line
        data={{
          labels: graphData.map((item, index) => index+1),//X -axis
          datasets : [
            {
              label : 'Contest Ranking',
              data : graphData.map((item) => item.rating), //Y-axis
              borderColor : 'black',
              borderWidth: 1
            }
          ]
        }}
        options={{  
            fill: false,
            interaction: {
                intersect: false
            },
            radius: 0,
            scales: {
                y: {
                  grid: {
                    color: 'grey'
                  }
                },
            }
        }}
      />
    </Box>
  )
}

const CardLeetCode = (props)=>{
    const {userProfile} = props;
    return(
        <Box sx={{mt:2, maxWidth:400}}>
          {/* <Box style={{'display':'flex', 'flexDirection':'row'}}><Typography>Avatar:</Typography> <img src={userProfile.userAvatar} alt="avatar"/></Box> */}
          <Box mb={1}> 
                <Box style={{'display':'flex', 'flexDirection':'row', 'alignItems' : 'center'}}>
                    <img src={leetcode_logo} alt="codeforce-icon" style={{height : 22, marginRight:10}}/> 
                    <Typography variant="h5" fontWeight="bold">{userProfile.username}</Typography> 
                </Box>
                {
                  userProfile.badge && 
                  <Box style={{'display':'flex', 'flexDirection':'row', 'alignItems' : 'center'}}>
                      <img src={`https://assets.leetcode.com/static_assets/public/images/badges/${userProfile.badge.name.toLowerCase()}.png`} alt="badge" style={{height : 22, marginRight:10}}/>
                      <Typography mr={1} fontWeight="bold" variant="h6">{userProfile.badge?.name}</Typography>
                  </Box>
                }
          </Box>
          <CardRow heading="Rank" data={userProfile.ranking} variant="h6" icon={faRankingStar}/>
          <CardRow heading="Rating" data={userProfile.rating|0} variant="h6" icon={faMedal}/>
          <CardRow heading="Contests" data={userProfile.attendedContestsCount} variant="h6" icon={faTrophy}/>
          <Graph graphData={userProfile.rankingHistory}/>
          <Card sx={{p:1, mt:1}}>
            <Typography variant="h6" mb={1}>Languages</Typography>
          <>
          {
            userProfile.languageProblemCount?.map((item,index)=>{
             return (
              <Box style={{display:'flex', flexDirection:'row', justifyContent:'space-between', marginBottom:3}}>
                  <Chip key={index} label = {item.languageName}/> <Typography variant='subtitle1'> {item.problemsSolved} </Typography>
              </Box>
             )}
            )
          }
          </>
          </Card>
        </Box>
    )

}

export default CardLeetCode;
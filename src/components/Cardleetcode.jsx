import { Box, Card, CircularProgress, Grid, LinearProgress, Typography } from "@mui/material";
import React, { useState } from "react";
import leetcode_logo from '../assets/images/leetcode_logo.png'
import { Chart as ChartJS } from 'chart.js/auto'
import { Line} from "react-chartjs-2";

import { grey } from "../theme/palette";

//icons : 
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faMedal, faRankingStar, faTrophy } from "@fortawesome/free-solid-svg-icons";
import { EmojiEventsOutlined, WorkspacePremiumOutlined} from "@mui/icons-material";

function CircularProgressWithLabel({ value, color, text}) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <Box 
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CircularProgress variant="determinate" value={100} size={100} style={{ color: grey[300] }} thickness={3}/>
      <CircularProgress variant="determinate" value={value} size={100} style={{position: 'absolute', top: 0, left: 0, borderRadius: '50%' }} color={color}/>
      <Typography 
        variant="h4" 
        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}
      >
        {isHovered ? `${value.toFixed(1)}%` : text}
      </Typography>
    </Box>
  );
}

function TotalSolved({ total, solved }) {
    const progress = (solved / total) * 100;
    return (
      <Grid item xs={12} sm={6} container justify="center" alignItems="center">
          <CircularProgressWithLabel value={progress} text={solved} color={"warning"}/>
      </Grid>
  );
}

function Solved({ total, solved }) {
  return (
    <Grid item xs={12} sm={6}>
      {total.map((problem, index) => {
        const col =
          problem.difficulty === "Medium"
            ? "warning"
            : problem.difficulty === "Hard"
            ? "error"
            : "success";
        return (
          problem.difficulty !== "All" && (
            <div key={index}>
              <Typography variant="span">{problem.difficulty}</Typography>
              <LinearProgress
                variant="determinate"
                value={(solved[index].count / problem.count) * 100}
                style={{ height: 8, borderRadius: 20 }}
                color={col} // Fixed color assignment
              />
              <Typography variant="body2" align="right">
                {`${solved[index].count} / ${problem.count}`}
              </Typography>
            </div>
          )
        );
      })}
    </Grid>
  );
}

const CardRow = (props) =>{
    const {heading, data,Icon} = props;
    return (
        <Box style={{'display':'flex', 'flexDirection':'row', 'justifyContent':'space-between', alignItems:'center'}}>
            <Typography variant="h6" style={{ display: 'flex', alignItems: 'center'}}>
              <Icon style={{marginRight : 10, color:'#1877F2'}}/>{heading}:
            </Typography> 
            <Typography variant="subtitle1"> 
              {data} 
            </Typography>
        </Box>
    )
}

const Graph = (props)=>{
  const {graphData} = props;
  return (
    <Box mt={3}>
      <Line
        data={{
          labels: graphData.map((item, index) => index+1),//X -axis
          datasets : [
            {
              label : 'Contest Ranking',
              data : graphData.map((item) => item.rating|0), //Y-axis
              borderColor : '#f0ad4e',
              borderWidth: 2
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
                    color: 'grey',
                    drawBorder: false,
                    display: false,
                  },
                },
                x: {
                  ticks: {
                    display: false,
                  },
            
                  // to remove the x-axis grid
                  grid: {
                    drawBorder: false,
                    display: false,
                  },
                },
            },
            plugins: {
              legend: {
                display: false
              }
            },
            tooltips: {
              callbacks: {
                label: function(tooltipItem, data) {
                    const dataset = data.datasets[tooltipItem.datasetIndex];
                    const value = dataset.data[tooltipItem.index];
                    const contestName = dataset.contestName;
                    const ranking = dataset.ranking;
                    return `${contestName} - Ranking: ${ranking} - Value: ${value}`;
                }
            }
          },
        }}
      />
    </Box>
  )
}

const CardLeetCode = (props)=>{
    const {userProfile} = props;
    const total = userProfile.allProblems[0].count; // Total number of problems
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
          <CardRow heading="Rating" data={userProfile.rating|0} variant="h6" Icon={WorkspacePremiumOutlined}/>
          <CardRow heading="Contests" data={userProfile.attendedContestsCount} variant="h6" Icon={EmojiEventsOutlined}/>

          <Card sx={{backgroundColor : grey[200], p:2, mt:2}}>
            <Grid container>
              <TotalSolved total={total} solved={userProfile.problemData[0].count} />
              <Solved total={userProfile.allProblems} solved={userProfile.problemData} />
            </Grid>
          </Card>

          <Graph graphData={userProfile.rankingHistory}/>
          
        </Box>
    )

}

export default CardLeetCode;
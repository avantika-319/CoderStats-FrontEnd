import { Box, Typography } from "@mui/material";
import React from "react";
import codeforces_logo from '../assets/images/logo.png';
import { get_color} from "../utils/text_util";
import { Chart as ChartJS } from 'chart.js/auto';
import { Line } from "react-chartjs-2";

//icons : 
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faMedal, faRankingStar, faTrophy, faUserGroup, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
// import WorkspacePremiumOutlinedIcon from '@mui/icons-material/WorkspacePremiumOutlined';
import { EmojiEventsOutlined, WorkspacePremiumOutlined, GroupOutlined, DoneAllOutlined, StarOutlineOutlined} from "@mui/icons-material";

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
                data : graphData.map((item) => item.newRating), //Y-axis
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
                    color: 'grey',
                    lineWidth: 0.3,
                  }
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
            }
          }}
        />
      </Box>
    )
  }

const CardCodeforces = (props) =>{
    const {userProfile} = props;
    const rankColor = get_color(userProfile?.rating)
    const maxRankColor = get_color(userProfile?.maxRating);
    return(
        <Box sx={{mt:2, maxWidth:400}}>
            <Box mb={1}> 
                <Box style={{'display':'flex', 'flexDirection':'row', 'alignItems' : 'center'}}>
                    <img src={codeforces_logo} alt="codeforce-icon" style={{height : 22, marginRight:10}}/> 
                    <Typography variant="h5" fontWeight="bold">{userProfile.handle}</Typography> 
                </Box>
                <Box style={{
                   display: 'flex',
                   flexDirection: 'row',
                   flexWrap: 'wrap',
                   '@media (min-width: 300px)': {
                       display: 'grid',
                       gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                       gap: '20px',
                   }
                }}>
                    <Box>
                      <Typography mr={1} fontWeight="bold" color={rankColor} variant="h6">{userProfile.rank}</Typography>
                    </Box>
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
                <CardRow heading='Contest Rating' data={userProfile.rating} Icon={WorkspacePremiumOutlined}/>
                <CardRow heading='Maximum Rating' data={userProfile.maxRating} Icon={StarOutlineOutlined}/>
                <CardRow heading='Contests' data={userProfile.contests} Icon={EmojiEventsOutlined}/>
                <CardRow heading='Friends of' data={userProfile.friends} Icon={GroupOutlined}/>
                <CardRow heading='Questions Solved' data={userProfile.questionSolved} Icon={DoneAllOutlined}/>
            </Box>
            <Graph graphData={userProfile.rankingHistory}/>
        </Box>
    )
}

export default CardCodeforces;
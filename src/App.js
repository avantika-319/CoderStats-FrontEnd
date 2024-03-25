
import { Box, Button, Card, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import CardCodeforces from "./components/CardCodeforces";
import CardLeetCode from "./components/Cardleetcode";
import Toast from "./components/Toast";
import { QueryStats } from "@mui/icons-material";

function App() {
  const URL = process.env.REACT_APP_SERVER_URL;
  const [platform, setPlatform] = useState(null); //which platform data to get
  const [userName, setUsername] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  //Toast states : 
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState('success');

  const handleToastOpen = (message, severity) => {
    setToastMessage(message);
    setToastSeverity(severity);
    setToastOpen(true);
  };

  const handleToastClose = () => {
      setToastOpen(false);
  };

  //null -> explicitly null memory entity
  //empty array -> [] != null
  //empty object -> {} != null

  const handleSelectChange = (event)=>{
    setUserProfile(null);
    setPlatform(event.target.value)
  }
  
  const handleInputChange = (event)=>{
    setUsername(event.target.value)
  }

  const fetchCodeforcesProfile = async()=>{
    try{
    const req_url = `${URL}/user/${platform}/${userName}`;
    const questionStatus_url = `${URL}/user/${platform}/${userName}/status`;
    const contest_url = `${URL}/user/${platform}/${userName}/rating`;

    const config={
      header:{
        "Content-Type" : "application/json",
      },
    };

    const response = await axios.get(req_url,config); 
    const response2 = await axios.get(questionStatus_url,config);
    const response3 = await axios.get(contest_url, config);

    const rankingHistory = response3.data.result;
    const contests = rankingHistory.length;

    const status= response2.data.result;

    const questionSet = new Set();
    for(let i=0; i<status.length; i++){
      if(status[i].verdict === "OK") questionSet.add(`${status[i].contestId}${status[i].problem.index}`)
    }

   const solved = (questionSet.size)
    const data = response.data;
    if(data.status === "OK"){
      const {friendOfCount, handle, maxRank, maxRating, rank, rating} = data.result[0];

      const userData = {
        handle, 
        maxRank,
        maxRating,
        rank,
        rating, 
        contests,
        friends : friendOfCount,
        questionSolved: solved,
        rankingHistory
      }
      setUserProfile(userData);
      // console.log(userProfile);
    }
    }catch(error)
    {
      handleToastOpen('Either platform or username is incorrect','error');
    }
    finally{
      setIsLoading(false);
    }
  }

  const fetchLeetcodeProfile = async()=>{
    try{
      const req_url = `${URL}/user/${platform}/${userName}`;
      const req_url2 = `${URL}/user/${platform}/${userName}/rating`;
      const req_url3 = `${URL}/user/${platform}/${userName}/solvedProblems`;

      const config={
        header:{
          "Content-Type" : "application/json",
        },
      };

      const response = await axios.get(req_url,config);
      const ratingRes = await axios.get(req_url2,config);
      const problemRes = await axios.get(req_url3,config);

      //general data
      const data = response.data.data.matchedUser;
      const {username, languageProblemCount,profile} = data;
      const {ranking, userAvatar} = profile;
     
      //rating/ranking data
      const ratingData = ratingRes.data.data;
      const {userContestRanking, userContestRankingHistory} = ratingData;
      const {attendedContestsCount, badge, rating} = userContestRanking;
      // console.log(attendedContestsCount, badge, rating);

      const rankingHistory = userContestRankingHistory.filter((item)=>{
        return item.attended === true;
      })

      //problems data
      const allProblems = problemRes.data.data.allQuestionsCount;
      const problemData = problemRes.data.data.matchedUser.submitStatsGlobal.acSubmissionNum;

      setUserProfile({attendedContestsCount,badge,rating,ranking,username,allProblems,problemData,rankingHistory})
  }catch(error)
  {
    handleToastOpen('Either platform or username is incorrect','error');
  }
  finally{
    setIsLoading(false);
  }
}

  const fetchProfile =()=>{
    setUserProfile(null);
    setIsLoading(true);
    if(platform === 'codeforces'){
      fetchCodeforcesProfile();
    }
    else if(platform === 'leetcode'){
      fetchLeetcodeProfile();
    }
    else{
      handleToastOpen('Select Platform','error');
      setIsLoading(false);
    }
  }

  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection:'column'}}>
      <Toast
        open={toastOpen}
        severity={toastSeverity}
        message={toastMessage}
        onClose={handleToastClose}
      />

      <Box style={{display:'flex', alignItems:'center', justifyContent:'center'}} my={3}>
      <Typography variant="h3" fontWeight={"bold"}>
        Coder Stats 
      </Typography>
      <QueryStats sx={{marginLeft:1, color:'#1877F2', fontSize: 30}} />
      </Box>
      <Card sx={{px:10, py:2, mb:5}}>
      <Grid sx={{my:2}} spacing={3}> 
        <FormControl sx={{minWidth : 120, mr:3}}>
          <InputLabel id="demo-simple-select-label">Platform</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={platform}
            label="Platform"
            onChange={handleSelectChange}
          >
            <MenuItem value="codeforces">Codeforces</MenuItem>
            <MenuItem value="leetcode">Leetcode</MenuItem>
          </Select>
        </FormControl>
        
        <TextField label="Username" variant="outlined" onChange={handleInputChange}/>
      </Grid>
      <Button variant="contained" onClick={fetchProfile} sx={{mt:1}}>GET</Button>
      {
        isLoading && 
        <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
          <CircularProgress/>
        </Box>
      }
      {
        (userProfile && platform === 'codeforces') && (
          <CardCodeforces userProfile={userProfile}/>
        )
      }

      {
        (userProfile && platform === 'leetcode') && (
        <CardLeetCode userProfile={userProfile}/>
        )
      } 
      </Card>
    </div>
  );
}

export default App;

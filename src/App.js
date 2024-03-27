
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
       <a
        href="https://github.com/avantika-319/CoderStats-FrontEnd"
        title="Fork me on GitHub"
        class="github-corner"
        target="_blank"
        rel="noreferrer"
      >
        <svg
          width="50"
          height="50"
          viewBox="0 0 250 250"
          className="relative z-20 h-20 w-20"
        >
          <title>Fork me on GitHub</title>
          <path d="M0 0h250v250"></path>
          <path
            d="M127.4 110c-14.6-9.2-9.4-19.5-9.4-19.5 3-7 1.5-11 1.5-11-1-6.2 3-2 3-2 4 4.7 2 11 2 11-2.2 10.4 5 14.8 9 16.2"
            fill="currentColor"
            style={{ transformOrigin: "130px 110px" }}
            class="octo-arm"
          ></path>
          <path
            d="M113.2 114.3s3.6 1.6 4.7.6l15-13.7c3-2.4 6-3 8.2-2.7-8-11.2-14-25 3-41 4.7-4.4 10.6-6.4 16.2-6.4.6-1.6 3.6-7.3 11.8-10.7 0 0 4.5 2.7 6.8 16.5 4.3 2.7 8.3 6 12 9.8 3.3 3.5 6.7 8 8.6 12.3 14 3 16.8 8 16.8 8-3.4 8-9.4 11-11.4 11 0 5.8-2.3 11-7.5 15.5-16.4 16-30 9-40 .2 0 3-1 7-5.2 11l-13.3 11c-1 1 .5 5.3.8 5z"
            fill="currentColor"
            class="octo-body"
          ></path>
        </svg>
      </a>
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

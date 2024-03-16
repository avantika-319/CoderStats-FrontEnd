
import { Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import CardCodeforces from "./components/CardCodeforces";
import CardLeetCode from "./components/CardLeetcode";
import Toast from "./components/Toast";

function App() {
  const URL = "https://coder-stats.vercel.app";
  const [platform, setPlatform] = useState(""); //which platform data to get
  const [userName, setUsername] = useState("");
  const [userProfile, setUserProfile] = useState(null);

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

    const contests = response3.data.result.length;

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
      }
      setUserProfile(userData);
      console.log(userProfile);
    }
    }catch(error)
    {
      handleToastOpen('Either platform or username is incorrect','error');
    }
  }

  const fetchLeetcodeProfile = async()=>{
    try{
      const req_url = `${URL}/user/${platform}/${userName}`;
      const req_url2 = `${URL}/user/${platform}/${userName}/rating`;
      const config={
        header:{
          "Content-Type" : "application/json",
        },
      };

      const response = await axios.get(req_url,config);
      const ratingRes = await axios.get(req_url2,config);

      //general data
      const data = response.data.data.matchedUser;
      const {username, languageProblemCount,profile} = data;
      const {ranking, userAvatar} = profile;
      console.log(username,languageProblemCount,ranking,userAvatar); 

      //rating/ranking dtaa
      const ratingData = ratingRes.data.data;
      const {userContestRanking} = ratingData;
      const {attendedContestsCount, badge, rating} = userContestRanking;
      // console.log(attendedContestsCount, badge, rating);

      setUserProfile({attendedContestsCount,badge,rating,ranking, userAvatar,username,languageProblemCount})
  }catch(error)
  {
    handleToastOpen('Either platform or username is incorrect','error');
  }
}

  const fetchProfile =()=>{
    setUserProfile(null);
    if(platform === 'codeforces'){
      fetchCodeforcesProfile();
    }
    else if(platform === 'leetcode'){
      fetchLeetcodeProfile();
    }
    else{
      setToastOpen('Select platform','error');
    }
  }

  return (
    <div className="App" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection:'column'}}>
      
      <Toast
        open={toastOpen}
        severity={toastSeverity}
        message={toastMessage}
        onClose={handleToastClose}
      />

      <Typography variant="h4" fontWeight={"bold"} sx={{ mb:4}}>
        Select Platform and user
      </Typography>
      <Card sx={{px:10, py:2}}>
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
            <MenuItem value="Select Platform">Select Platform</MenuItem>
            <MenuItem value="codeforces">Codeforces</MenuItem>
            <MenuItem value="leetcode">Leetcode</MenuItem>
          </Select>
        </FormControl>
        
        <TextField label="Username" variant="outlined" onChange={handleInputChange}/>
      </Grid>
      <Button variant="contained" onClick={fetchProfile} sx={{mt:1}}>GET</Button>
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

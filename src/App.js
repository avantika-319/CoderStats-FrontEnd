
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import CardCodeforces from "./components/CardCodeforces";
import CardLeetcode from "./components/CardLeetcode";

function App() {
  const URL = "https://coder-stats.vercel.app";
  const [platform, setPlatform] = useState(""); //which platform data to get
  const [userName, setUsername] = useState("");
  const [userProfile, setUserProfile] = useState(null);

  //null -> explicitly null memory entity
  //empty array -> [] != null
  //empty object -> {} != null

  const handleSelectChange = (event)=>{
    setPlatform(event.target.value)
  }
  
  const handleInputChange = (event)=>{
    setUsername(event.target.value)
  }

  const fetchCodeforcesProfile = async()=>{
    try{
    const req_url = `${URL}/user/${platform}/${userName}`;
    const url2= `${URL}/user/${platform}/${userName}/status`;

    const config={
      header:{
        "Content-Type" : "application/json",
      },
    };

    const response = await axios.get(req_url,config); 
    const response2 = await axios.get(url2,config); 
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
        friends : friendOfCount,
        questionSolved: solved,
      }
      setUserProfile(userData);
    }
    }catch(error)
    {
      console.log(error);
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

      //rating/ranking dtaa

      const ratingData = ratingRes.data.data;
      const {userContestRanking} = ratingData;
      const {attendedContestsCount, badge, rating} = userContestRanking;
      console.log(attendedContestsCount, badge, rating);

      //general data
      const data = response.data.data.matchedUser;
      const {username, languageProblemCount,profile} = data;
      const {ranking, userAvatar} = profile;
      console.log(username,languageProblemCount,ranking,userAvatar); 
      setUserProfile({attendedContestsCount,badge,rating,ranking, userAvatar,username,languageProblemCount})
  }catch(error)
  {
    console.log(error);
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
      alert('Select platform')
    }
  }

  return (
    <div className="App">
      {/* <select value={platform} onChange={handleSelectChange}>
        <option value="Select Platform">Select Platform</option>
        <option value="codeforces">codeforces</option>
        <option value="leetcode">leetcode</option>

      </select> */}
      <Box sx={{mt:2}}>
      <FormControl sx={{minWidth : 120}}>
        <InputLabel id="demo-simple-select-label">Platform</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={platform}
          label="Platform"
          onChange={handleSelectChange}
        >
          <MenuItem value="Select Platform">Select Platform</MenuItem>
          <MenuItem  value="codeforces">codeforces</MenuItem>
          <MenuItem value="leetcode">leetcode</MenuItem>
        </Select>
      </FormControl>
      </Box>
      
      {/* <p>{platform}</p> */}

      {/* <input 
        type="text"
        //value={username}
        placeholder="Enter username"
        onChange={handleInputChange}
      /> */}
      <Box sx={{mt:2}}>
      <TextField label="Username" variant="outlined" onChange={handleInputChange}/>
      </Box>

      {/* <p>{userName}</p> */}

      {/* <button onClick={fetchProfile}>GET</button> */}
      <Button variant="contained" onClick={fetchProfile} color="primary" sx={{mt:2}}>GET</Button>

      {
        (userProfile && platform === 'codeforces') && (
          <CardCodeforces userProfile={userProfile}/>
        )
      }
      {
        (userProfile && platform === 'leetcode') && (
          <CardLeetcode userProfile={userProfile}/>
        )
      } 
    </div>
  );
}

export default App;

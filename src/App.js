
import axios from "axios";
import { useState } from "react";

function App() {
  const URL = "https://coder-stats.vercel.app";
  const [platform, setPlatform] = useState(""); //which platform data to get
  const [userName, setUsername] = useState("");
  const [userProfile, setUserProfile] = useState({});

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
      <select value={platform} onChange={handleSelectChange}>
        <option value="Select Platform">Select Platform</option>
        <option value="codeforces">codeforces</option>
        <option value="leetcode">leetcode</option>

      </select>
      <p>{platform}</p>

      <input 
        type="text"
        //value={username}
        placeholder="Enter username"
        onChange={handleInputChange}
      />

      <p>{userName}</p>

      <button onClick={fetchProfile}>GET</button>

      {
        (userProfile && platform === 'codeforces') && (
          <div> 
          <div style={{'display':'flex', 'flexDirection':'row'}}> <h5>Handle:</h5>  <h5>{userProfile.handle}</h5> </div>
          <div style={{'display':'flex', 'flexDirection':'row'}}> <h5>Rank: </h5><h5>{userProfile.rank}</h5></div>
          <div style={{'display':'flex', 'flexDirection':'row'}}> <h5>Rating:</h5> <h5>{userProfile.rating}</h5></div>
          <div style={{'display':'flex', 'flexDirection':'row'}}><h5>MaxRank: </h5> <h5>{userProfile.maxRank}</h5></div>
          <div style={{'display':'flex', 'flexDirection':'row'}}><h5>MaxRating:</h5> <h5> {userProfile.maxRating}</h5></div>
          <div style={{'display':'flex', 'flexDirection':'row'}}><h5>Friend:</h5> <h5> {userProfile.friends}</h5></div>
          <div style={{'display':'flex', 'flexDirection':'row'}}><h5>Questions:</h5> <h5> {userProfile.questionSolved}</h5></div>
          </div>
        )
        }
        {
        (userProfile && platform === 'leetcode') && (
          <div>
          <div style={{'display':'flex', 'flexDirection':'row'}}><h5>Avatar:</h5> <img src={userProfile.userAvatar}/></div>
          <div style={{'display':'flex', 'flexDirection':'row'}}> <h5>Handle:</h5>  <h5>{userProfile.username}</h5> </div>
          <div style={{'display':'flex', 'flexDirection':'row'}}> <h5>Rank: </h5><h5>{userProfile.ranking}</h5></div>
          <div style={{'display':'flex', 'flexDirection':'row'}}> <h5>Rating:</h5> <h5>{userProfile.rating}</h5></div>
          <div style={{'display':'flex', 'flexDirection':'row'}}><h5>Badge: </h5> <h5>{userProfile.badge.name}</h5></div>
          <div style={{'display':'flex', 'flexDirection':'row'}}><h5>Contest Attended:</h5> <h5> {userProfile.attendedContestsCount}</h5></div>
          <div><h5>problemSolved</h5></div>
          <>
          {
            userProfile.languageProblemCount.map((item,index)=>{
             return <div key={index} style={{'display':'flex', 'flexDirection':'row'}}><h5>{item.languageName} : </h5> <h5> {item.problemsSolved}</h5></div>
            })
          }
          </>
        </div>
        )
      } 
    </div>
  );
}

export default App;

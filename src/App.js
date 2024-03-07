import axios from "axios";
import { useState } from "react";

function App() {

  const URL = "https://coder-stats.vercel.app"

  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [platform, setPlatform] = useState('');

  const handleSelectChange = (event)=>{
    setPlatform(event.target.value);
  }

  const handleInputChange = (event) =>{
    setUser(event.target.value);
  }

  const fetchData = async()=>{
    try {
      const config = {headers:{
        "Content-Type" : "application/json",
      }};
      console.log(`${URL}/user/${platform}/${user}`);
      const response = await axios.get(`${URL}/user/${platform}/${user}`, config);
      console.log(response);
      // Handle the response data
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors
    }
  }

  return (
    <div className="App">
      <select name="platform"value={platform} onChange={handleSelectChange}>
        <option value="">Select an option</option>
        <option value="leetcode">Leetcode</option>
        <option value="codeforces">Codeforces</option>
      </select>

      <p>{platform}</p>

      <input 
        type="text" 
        value={user} 
        onChange={handleInputChange} 
        placeholder="Enter username"
      />
      <p>{user}</p>
      <button onClick={fetchData}> get </button>
    </div>
  );
}

export default App;

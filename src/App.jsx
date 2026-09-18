
import DifficultyChart from "./Components/DifficultyChart";
import React, { useEffect, useState } from "react"
import SkillStats from "./Components/SkillStats";
import SummaryCard from "./Components/SummaryCard";
function App(){
  const [lcusername,setLCusername] = useState("");
  const [lcdata,setLcdata] = useState(null);
  
  const [cfusername,setCFusername] = useState("");
  const [cfdata,setCfdata] = useState(null);
   const [search,setSearch] = useState(0);

  function incount() {
    setSearch(search + 1);
  }
  

  useEffect(() => {
    if (!lcusername || search == 0) {
      return
    }
     async function fetchLcData() {
      try {
        const respone = await fetch(`https://alfa-leetcode-api.onrender.com/${lcusername}`);
      const data = await respone.json();
       
      console.log(data);
      setLcdata(data);
      } catch (error) {
        console.error("LC Fetch Failed", error)
      }
      
     }
     fetchLcData();
  },[search]);



  useEffect(() => {
    if(!cfusername || search == 0) return
     async function fetchCfData() {
      try {
        const response = await fetch(`https://codeforces.com/api/user.info?handles=${cfusername}`);
      const data = await response.json();

      console.log(data);

      setCfdata(data);
      } catch (error) {
        console.error("CF Fetch Failed",error);
      }
    }

    fetchCfData();
  },[search])
  
  return (
    <>
    <div>

<div>
      <h1>CP TRACKER</h1>
    </div>

    <div>
      <div>

        <label htmlFor="">Enter LC Username</label><br />
        <input type="text" aria-label="Enter LC Username" value={lcusername} onChange={(e) => setLCusername(e.target.value)}/>
      </div>

     
      <div>
        <label htmlFor="">Enter CF Username</label><br />
        <input type="text" value={cfusername} aria-label="Enter CF Username" onChange={(e) => setCFusername(e.target.value)} />
      </div>

      <button onClick={() => {
        

        incount();
      }}>SEARCH</button>
    </div>
       {
        cfdata && cfdata.Response !== "False" && (
         <div>
          <h2>{cfdata.result[0].handle}</h2>

          <div>
            <img src={cfdata.result[0].avatar} alt={cfdata.result[0].handle}/>
          </div>
         </div>
          
        )
       }
     {
      lcdata && lcdata.username !== "False" && (

        <div>
          <div><h2>{lcdata.name}</h2>
          </div>
          <div>
            <h2>{lcdata.username}</h2>
          </div>
          <div>
            <img src={lcdata.avatar} alt={lcdata.name}/>
          </div>

          <div>
            <p>Ranking : {lcdata.ranking}</p>
          </div>
        </div>
      )
     }
     <DifficultyChart name = {lcusername} search = {search}/>
     <SkillStats name={lcusername} search={search}/>
     <SummaryCard data1 = {lcdata} data2 = {cfdata}/>
    </div>

    </>
  )
}
export default App
import { useEffect,useState } from "react";

 const [cfusername,setCFusername] = useState("");
  const [cfdata,setCfdata] = useState(null);

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
    },[search]);

    export default CodeForces;
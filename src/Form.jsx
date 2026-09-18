import { useState,useEffect } from "react"
function Form(){
    
const [data,setData] = useState(null)

  useEffect(()=>{
    async function getData() {
    const info = await fetch("");
    const response = await info.json();
    console.log(info);
    setData(info)
  }
  },[])

    return(
        <div>

        </div>
    )
}
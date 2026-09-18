import React, { use, useEffect, useState } from "react";

function SkillStats({name,search}) {
   const [skill,setSkill] = useState(null);
   useEffect(() => {    
    if (!name || search === 0) return
    async function FetchSkill() {
        try {
           await new Promise(resolve => setTimeout(resolve, 2000)) // wait 2 seconds
        const response = await fetch(`https://alfa-leetcode-api.onrender.com/${name}/skill`)
        const data = await response.json()
        setSkill(data)

        setSkill(data);
        } catch (error) {
            console.error("Skills Cannot Be Fetched",error)
        }
    }
    FetchSkill();
   },[search])
     if(!skill) return null;

     const total = [...skill.fundamental,...skill.intermediate,...skill.advanced];
     const strongest = [...total].sort((a,b) => b.problemsSolved - a.problemsSolved).slice(0,5);
     const weakest = [...total].sort((a,b) => a.problemsSolved - b.problemsSolved).slice(0,5);



    return(
        <>
        <div>
            <h2>Strong Topics</h2>
            {strongest.map((topic, index) => {
    return (
        <div key={index}>
            <p>{topic.tagName}</p>
            <p>{topic.problemsSolved} solved</p>
        </div>
    );
})}

            <h2>Weakest Topic</h2>
            {weakest.map((topic,index) => {
                return (
                    <div key={index}>
                    <p>{topic.tagName}</p>
                    <p>{topic.problemsSolved} solved</p>
                </div>
                );
            })}
        </div>
        </>
    )
}

export default SkillStats
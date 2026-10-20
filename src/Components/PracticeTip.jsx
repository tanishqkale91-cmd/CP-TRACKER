import React from "react";
import { useState } from "react";
import { motion,AnimatePresence, keyframes } from "motion/react";
import { div, title } from "motion/react-client";
function PracticeTip() {
  const [tips,setTips] = useState(0);
  
 const Tips = [
     {
    title: "Focus on one pattern.",
    description: "Solve 2–3 two-pointer problems and understand why each pointer moves.",
  },
  {
    title: "Understand before coding.",
    description: "Trace one example by hand before writing your solution.",
  },
  {
    title: "Review your mistakes.",
    description: "Revisit one problem you struggled with and identify what you missed.",
  },
 ]
   function getTips() {
    setTips((prev) => (prev+1)%Tips.length);
   }
  return (
    <div>
        <motion.section
        initial = {{opacity:0,y:20}}
        animate = {{opacity:1,y:0}}
        transition={{duration:0.4}}
         whileHover={{
        y: -3,
        transition: { duration: 0.2 },
      }}
      className="chart-panel"
        >
            <h1>GET THE TIPS</h1>
            <p>DAILY PRACTICE</p>
           <AnimatePresence>
            <motion.div 
            initial = {{opacity:0,y:10}}
            animate = {{opacity:1,y:0}}
            exit={{
                opacity:0,y:10
            }}
            whileHover={{
                scale:1.02
            }}
            key={tips}>
                <h2>{Tips[tips].title}</h2>
            <p>{Tips[tips].description}</p>
            </motion.div>
           </AnimatePresence>
            <button className = "bg-zinc-900 text-red"
            onClick={getTips}>Next Tip</button>
        </motion.section>

    </div>
  )
}

export default PracticeTip
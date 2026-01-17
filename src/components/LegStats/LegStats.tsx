import React from 'react'
import "./LegStats.css";

interface LegStatsProps{
    isVisible: boolean
    timeBetweenStats: JSON
}

export default function LegStats({isVisible, timeBetweenStats}:LegStatsProps){
  if(isVisible){
    let avgTimeBetween = (timeBetweenStats as any)?.["mean_time"]    
    if(avgTimeBetween == undefined){
      avgTimeBetween = "unknown"
    }
    return( 
      <div className="legStats">
        <p>
            AVG TIME: {avgTimeBetween}
        </p>
      </div>)
  }
  return <React.Fragment/>
}
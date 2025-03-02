import React from 'react'
import "./LegStats.css";

interface LegStatsProps{
    isVisible: boolean
    timeBetweenStats: JSON
}

export default function LegStats({isVisible, timeBetweenStats}:LegStatsProps){
  if(isVisible){
    return( 
      <div className="legStats">
        <p>
            AVG TIME: {(timeBetweenStats as any)["mean_time"]}
        </p>
      </div>)
  }
  return <React.Fragment/>
}
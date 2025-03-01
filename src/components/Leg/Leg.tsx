import React from 'react'
import "./Leg.css";
import { TimeDuration } from '../../services/Duration';

interface LegProps{
  isVisible : boolean
  timeBetweenStats : JSON
  avgTimeBetweenStops : TimeDuration
  onLegClick: (item:string) => void
}

export default function Leg({isVisible, timeBetweenStats, avgTimeBetweenStops,  onLegClick}:LegProps){
  if(isVisible){
      let avgTimeBetween = (timeBetweenStats as any)["mean_time"]
      let timeDurationLegBetween = new TimeDuration(avgTimeBetween)

      const handleClick = () => {
        onLegClick("hello");
      };
  
      return( 
        <div 
          className="inbetween routeBlock" 
          style = {{color: timeDurationLegBetween.compare(avgTimeBetweenStops)<0 ? "green" : "red"}}
          onClick={handleClick}>
        </div>
      )
  }else{
      return <React.Fragment/>
  }
}
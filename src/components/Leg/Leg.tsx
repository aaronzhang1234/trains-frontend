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
      const handleClick = () => {
        onLegClick("hello");
      };

      let color = "gray"
      let avgTimeBetween = (timeBetweenStats as any)?.["mean_time"]

      if (avgTimeBetween !== undefined && avgTimeBetween!== null) {
        let timeDurationLegBetween = new TimeDuration(avgTimeBetween)
        color = timeDurationLegBetween.compare(avgTimeBetweenStops)<0 ? "green" : "red"
      }
   
      return( 
        <div 
          className="inbetween routeBlock" 
          style = {{color: color}}
          onClick={handleClick}>
        </div>
      )
  }else{
      return <React.Fragment/>
  }
}
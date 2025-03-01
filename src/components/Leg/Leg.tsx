import React from 'react'
import "./Leg.css";
import { TimeDuration } from '../../services/Duration';

interface LegProps{
  isVisible : boolean
  fullRouteStats : JSON
  timeBetweenStats : JSON
  avgTimeBetweenStops : TimeDuration
  onLegClick: (item:string) => void
}

export default function Leg({isVisible, fullRouteStats, timeBetweenStats, avgTimeBetweenStops,  onLegClick}:LegProps){
  if(isVisible){
      let avgTimeBetween = (timeBetweenStats as any)["mean_time"]
      let timeDurationLegBetween = new TimeDuration(avgTimeBetween)

      const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
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
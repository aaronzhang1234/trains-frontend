import {Component} from 'react'
import stations from '../../stations.json';
import Leg from '../Leg/Leg';
import LegStats from '../LegStats/LegStats';
import { TimeDuration } from '../../services/Duration';
import "./RouteBlock.css";

type RouteBlockState = {
  isLegStatsVisible : boolean
}

interface RouteBlockProps{
  stopId : string
  stopIdx : number
  trainResponse : Array<any>
  timeBetweenStats: JSON
  isLegVisible : boolean
  avgTimeBetweenStops : TimeDuration
  maxStationNameLen : number
}

class RouteBlock extends Component<RouteBlockProps, RouteBlockState>{
    constructor(props: RouteBlockProps){
      super(props);
      this.state = {
        isLegStatsVisible:false
      }
    }
    handleLegClick = () =>{
      this.setState({isLegStatsVisible: !this.state.isLegStatsVisible})
    }
    formatTime = (timestamp: string, showDate:boolean) => {
      const date = new Date(timestamp + 'Z'); // Assume UTC input
      const options : Intl.DateTimeFormatOptions={
        timeZone: 'America/Chicago',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }
      if (showDate){
        options.month='short'
        options.day='numeric'
      }

      return date.toLocaleString('en-US',options);
    }
    render(){
      return(
        <div className="routeBlock">
          <div className = "circle" ></div>
          <p className = "stationName" style={{width: `${this.props.maxStationNameLen}ch`}}>{(stations.station_dict as any)[this.props.stopId]}</p>
          {this.props.trainResponse.map((train:any,idx:number)=>{
            let time = ""
            if(train["stop_times"][this.props.stopIdx+1]!=null){
              time = this.formatTime(train["stop_times"][this.props.stopIdx+1], false)
            }
            return <p style={{width: '5em', gridRow:1, gridColumn:3+idx}}>{time}</p>
          })}
          <Leg 
            isVisible= {this.props.isLegVisible}
            timeBetweenStats={this.props.timeBetweenStats}
            avgTimeBetweenStops = {this.props.avgTimeBetweenStops}
            onLegClick = {this.handleLegClick}
          />
          <LegStats
            isVisible={this.state.isLegStatsVisible}
            timeBetweenStats={this.props.timeBetweenStats}
          />
        </div>
      )
    }
}

export default RouteBlock
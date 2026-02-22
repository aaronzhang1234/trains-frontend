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
  isLastStop : boolean
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
        <div className="routeBlock" style={{marginTop: this.props.isLastStop ? '-1.5em' : undefined}}>
          <div className = "circle" ></div>
          <p className = "stationName" style={{width: `${this.props.maxStationNameLen}ch`}}>{(stations.station_dict as any)[this.props.stopId]}</p>
          <Leg 
            isVisible= {!this.props.isLastStop}
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
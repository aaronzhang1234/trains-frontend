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
    render(){
      return(
        <div className="routeBlock">
          <div className = "circle" ></div>
          <p className = "stationName">{(stations.station_dict as any)[this.props.stopId]}</p>
          {this.props.trainResponse.map((train:any,idx:number)=>(
            <p style={{gridRow:1, gridColumn:3+idx}}>{train["stop_times"][this.props.stopIdx+1]}</p>
          ))}
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
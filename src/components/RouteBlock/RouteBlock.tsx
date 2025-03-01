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
  fullRouteStats : JSON
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
          <p className = "stationName">{(stations.station_dict as any)[this.props.stopId]}</p>
          <div className="travelBlock">
            <div className = "circle" ></div>
            <Leg 
              isVisible= {this.props.isLegVisible}
              timeBetweenStats={this.props.timeBetweenStats}
              avgTimeBetweenStops = {this.props.avgTimeBetweenStops}
              onLegClick = {this.handleLegClick}
            />
          </div>
          <LegStats
            isVisible={this.state.isLegStatsVisible}
            timeBetweenStats={this.props.timeBetweenStats}
          />
        </div>
      )
    }
}

export default RouteBlock
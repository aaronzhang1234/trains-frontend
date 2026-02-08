import {Component} from 'react'
import stations from '../../stations.json'
import './TrainsBlock.css'

type TrainsBlockState = {
  isTrainBlocksVisible : boolean
  isLegStatsVisible : boolean
}

interface TrainsBlockProps{
  trainsArray : Array<any> 
  route : string
}

class TrainsBlock extends Component<TrainsBlockProps, TrainsBlockState>{
    constructor(props: TrainsBlockProps){
      super(props);
      this.state = {
        isLegStatsVisible:false,
        isTrainBlocksVisible : false
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
    handleShowTrainsClick = () =>{
      this.setState({isTrainBlocksVisible: !this.state.isTrainBlocksVisible})
    }

    render(){
      let buttonText = this.state.isTrainBlocksVisible?"Hide Trains":"Show Trains"

      let station_routes = (stations.route_info as any)[this.props.route]["route_order"]
      return(
        <div className="trainBlock">
          <button onClick={this.handleShowTrainsClick}>{buttonText}</button>
          <table style={{display: this.state.isTrainBlocksVisible ? 'block' : 'none' }}>
              <thead>
                <tr>
                  <th scope="col" className='tableHeader'>Train #</th>
                  <th scope="col" className='tableHeader'style={{ whiteSpace: 'nowrap' }}>Start Time</th>
                  <th scope="col" className='tableHeader'style={{whiteSpace:'nowrap'}}>Total Time</th>
                  {station_routes.map((station_id:string)=>{
                    return <th scope="col" className='tableHeader'>{(stations.station_dict as any)[station_id]}</th>
                  })}
                </tr>
              </thead>
              <tbody>
                {this.props.trainsArray.map((train:any)=>(
                  <tr>
                    <th>{train["route_number"]}</th>
                    <th>{this.formatTime(train["start_time"], true)}</th>
                    <th>{train["total_time"]}</th>
                    {station_routes.map((_station_id:string, index:number)=>{
                      let time = ""
                      if(train["stop_times"][index]!=null){
                        time = this.formatTime(train["stop_times"][index], false)
                      }
                      return <th>{time}</th>
                    })
                    }
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      )
    }
}

export default TrainsBlock 
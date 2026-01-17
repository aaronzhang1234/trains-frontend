import {Component} from 'react'
import stations from '../../stations.json'

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
    removeMilliseconds = (timestamp: string) =>{
      return timestamp.split(".")[0]
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
                  <th scope="col">Train Number</th>
                  <th scope="col">Start Time</th>
                  <th scope="col">Total Time</th>
                  {station_routes.map((station_id:string, index:number)=>{
                    return <th scope="col">{(stations.station_dict as any)[station_id]}</th>
                  })}
                </tr>
              </thead>
              <tbody>
                {this.props.trainsArray.map((train:any)=>(
                  <tr>
                    <th>{train["route_number"]}</th>
                    <th>{this.removeMilliseconds(train["start_time"])}</th>
                    <th>{train["total_time"]}</th>
                    {station_routes.map((station_id:string, index:number)=>{
                      let time = ""
                      if(train["stop_times"][index]!=null){
                        time = this.removeMilliseconds((train["stop_times"][index]).split("T")[1])
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
import React, {Fragment, BaseSyntheticEvent, Component} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import axios from 'axios';
import stations from './stations.json';
import { string } from 'three/examples/jsm/nodes/Nodes.js';
import response from './response.json'


type AppState = {
  select_value?:string
  start_date?: Date
  end_date?: Date
  response: any
}

interface InbetweenCompProps{
  stopIdx: number
  isVisible: boolean
  route: string
  avg_times: JSON
}

function InbetweenComp({stopIdx, isVisible, route, avg_times}:InbetweenCompProps){
  if(isVisible){
    return <div className="inbetween routeBlock" onClick={()=>consoleOut(stopIdx, route, avg_times)}></div>
  }else{
    return <React.Fragment/>
  }
}

function consoleOut(stopIdx:number, route:string, avg_times:JSON){
  let station_routes = stations.route_order[route as keyof typeof string]
  let route_key = station_routes[stopIdx] + "-" + station_routes[stopIdx+1]
  console.log(avg_times[route_key as keyof typeof string])
}

class App extends Component<{}, AppState> {
  constructor(props: {}){
    super(props);
    this.state = {
      select_value: "brn-1",
      start_date: new Date(),
      end_date: undefined,
      response: {}
    }
  }
  onClick =(input:BaseSyntheticEvent) =>{
    let route = this.state.select_value
    let start_iso = this.state.start_date?.toISOString();
    let end_iso = this.state.end_date?.toISOString();
    console.log(route)
    const headers= {
      "Content-Type":"text/plain",
      "route": route,
      "start_time": start_iso,
      "end_time": end_iso,
      "show_trains": "false"
    }

    /*
    axios.get("https://ldchm3dr68.execute-api.us-east-1.amazonaws.com/Prod/trains", {headers, withCredentials:false} )
      .then(response=>this.setState({response:response.data}))    
    */

    this.setState({response:response})
  }
  updateRoute=(e:any)=>{
    this.setState({select_value:e.target.value})
  }
  drawRoute=(route:string, train_response:any)=>{
    let route_order = stations.route_order[route as keyof typeof string];
    if(train_response.hasOwnProperty("no_of_trains")){
      console.log(train_response)
      let full_route_stats = train_response["stats"]["full_route_stats"]
      return(
        <div id="routeContainer">
          <h2>{full_route_stats["fastest_train"]["total_time"]} - {full_route_stats["avg_total_time"]} - {full_route_stats["slowest_train"]["total_time"]}</h2>
          {route_order.map((stopId:string, index:number)=>(          
            <React.Fragment>
            <div className="routeBlock">
              <p className = "stationName">{stations.station_dict[stopId as keyof typeof string]}</p>
              <div className="travelBlock">
                <div className = "circle" ></div>
                <InbetweenComp 
                  stopIdx={index} 
                  isVisible={index!=route_order.length-1}
                  route={route}
                  avg_times={train_response["stats"]["time_between_stats"]}
                />
              </div>
            </div>
            </React.Fragment>
          ))}
        </div>
      )
    }
  }
  render() {
    return (
    <Fragment>
      {this.drawRoute(this.state.select_value!, this.state.response)}
      <select 
        value={this.state.select_value}
        onChange={this.updateRoute}
      >
        <option value="brn-1">Brown to Kimbal</option>
        <option value="brn-5">Brown to Loop</option>
        <option value="org-1">Orange to Loop</option>
        <option value="org-5">Orange to Midway</option>
        <option value="red-1">Red to Howard</option>
        <option value="red-5">Red to 95th</option>
        <option value="blue-1">Blue to O'Hare</option>
        <option value="blue-5">Blue to Forest Park</option>
        <option value="y-1">Yellow to Skokie</option>
        <option value="y-5">Yellow to Howard</option>
        <option value="p-1">Purple to Linden</option>
        <option value="p-5">Purple to Loop/Howard</option>
        <option value="pink-1">Pink to ???</option>
        <option value="pink-5">Pink to ???</option>
        <option value="g-1">Green to Harlem</option>
        <option value="g-5">Green to Ashland/Cottage Grove</option>
      </select>
      <DatePicker 
        selected={this.state.start_date} 
        startDate={this.state.start_date} 
        endDate={this.state.end_date}
        onChange={(date)=>this.setState({start_date: date!})} 
        dateFormat="MM/dd/yyyy h:mm aa"
        showTimeSelect selectsStart
      />
      <DatePicker 
        selected={this.state.end_date} 
        startDate={this.state.start_date} 
        endDate={this.state.end_date}
        minDate={this.state.start_date}
        onChange={(date)=>this.setState({end_date: date!})} 
        dateFormat="MM/dd/yyyy h:mm aa"
        showTimeSelect selectsEnd
      />
      <input type="submit" onClick={this.onClick}/>
    </Fragment>
    )
  }
}

export default App 

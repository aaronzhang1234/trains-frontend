import React, {Fragment, BaseSyntheticEvent, Component} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import axios from 'axios';
import stations from './stations.json';
import { string } from 'three/examples/jsm/nodes/Nodes.js';
import response from './apiresponse.json';



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
}

function InbetweenComp({stopIdx, isVisible, route}:InbetweenCompProps){
  if(isVisible){
    return <div className="inbetween" onClick={()=>consoleOut(stopIdx, route)}></div>
  }else{
    return <React.Fragment/>
  }
}

function consoleOut(stopIdx:number, route:string){
  let station_routes = stations.route_order[route as keyof typeof string]
  console.log(station_routes[stopIdx] +"-" +station_routes[stopIdx+1])
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
      "end_time": end_iso
    }
    this.setState({response: response})
    /*
    axios.get("https://ldchm3dr68.execute-api.us-east-1.amazonaws.com/Prod/trains", {headers, withCredentials:false} )
      .then(response=>this.setState({response:response.data}))
    */
  }
  /*
  update_trains(train_response:any){    
    if(train_response.hasOwnProperty("no_of_trains")){
      let trains = train_response["trains"]
      let tables:Array<any> = []
      let train_stops = train_response["stops"]
      for(var key in trains){        
        let train = trains[key]
        let table = (
          <table>
            <thead>
              <tr>
                <th>Stop</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {train_stops.map((stop_id:string, index:number)=>{
                let station_name = stations.station_dict[stop_id as keyof typeof string]
                let stop_time = train["stop_times"][index]
                return(<tr>
                    <td>{station_name}</td>
                    <td>{stop_time}</td>
                  </tr>)
              })}
            </tbody>
          </table>
        )
        tables.push(table)
      }
      return(
        <div>
          <h1>{train_response["no_of_trains"]}</h1>
          {tables}
        </div>
      )
    }
    return(
      <h1>!!!</h1>
    )
  }
    */
  updateRoute=(e:any)=>{
    this.setState({select_value:e.target.value})
  }
  drawRoute=(route:string, train_response:any)=>{
    let route_order = stations.route_order[route as keyof typeof string];
    if(train_response.hasOwnProperty("no_of_trains")){
      return(
        <div>
          {route_order.map((stopId:string, index:number)=>(          
            <React.Fragment>
            <div className="routeBlock">
              <div style={{textAlign:"left"}}>
                <div className={["inline", "circle"].join(' ')} ></div>
                <h3 className="stationName">{stations.station_dict[stopId as keyof typeof string]}</h3>
              </div>
            </div>
            <InbetweenComp 
              stopIdx={index} 
              isVisible={index!=route_order.length-1}
              route={route}
            />
            </React.Fragment>
          ))}
        </div>
      )
    }
  }
  consoleOut(stopId:string){
    console.log(stopId)
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

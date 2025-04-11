import {Fragment, Component, FormEvent} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import axios from 'axios';
import RouteBlock from './components/RouteBlock/RouteBlock';
import stations from './stations.json';
import { TimeDuration } from './services/Duration';
import response from './response.json'
import Header from './components/Header/Header';
import LoadingGif from './assets/loading.gif'
import React from 'react';


type AppState = {
  select_value:string
  start_date?: Date
  end_date?: Date
  response: any
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
  handleSubmit =(event:FormEvent<HTMLFormElement>) =>{
    event.preventDefault()
    let route = (event.target as HTMLFormElement).route.value

    if (this.state.start_date && this.state.end_date) {
      let start_iso = this.state.start_date.toISOString();
      let end_iso = this.state.end_date.toISOString();
      const oneWeekInMs = 7 * 24 * 60 * 60 * 1000
      const diff = Math.abs(this.state.start_date.getTime() - this.state.end_date.getTime())

      if(diff > oneWeekInMs){
        this.setState({response:{"error":"Please query only a week or less of data"}})        
        return 
      }

      const headers= {
        "Content-Type":"text/plain",
        "route": route,
        "start_time": start_iso,
        "end_time": end_iso,
        "show_trains": "false"
      }
      this.setState({response:{"loading":true}})
      axios.get("https://ldchm3dr68.execute-api.us-east-1.amazonaws.com/Prod/trains", {headers, withCredentials:false} )
        .then(response=>this.setState({response:response.data}))    
        .catch(error=>this.handleError(error))
    }
  }

  handleError=(error:any)=>{
    console.log(error)
    console.log(error.response.data)
    this.setState({response:{"error":error.response.data}})
  }

  updateRoute=(e:any)=>{
    this.setState({select_value:e.target.value})
  }

  getLegStats= (route:string, stopIdx: number, time_between_stats:JSON) =>{
    let station_routes = (stations.route_info as any)[route]["route_order"]
    let route_key = station_routes[stopIdx] + "-" + station_routes[stopIdx+1]
    return (time_between_stats as any)[route_key]
  }

  drawRoute=(train_response:any)=>{
    if(train_response.hasOwnProperty("no_of_trains")){
      let route = train_response["route"]
      let route_order = (stations.route_info as any)[route]["route_order"];
      let fullRouteStats = train_response["stats"]["full_route_stats"]
      let timeBetweenStats = train_response["stats"]["time_between_stats"]      
      let avgTimeBetweenStops = new TimeDuration(fullRouteStats["avg_total_time"]).divideBy(route_order.length)
      return(
        <React.Fragment>
        <div id="routeContainer">
          <h2>{fullRouteStats["fastest_train"]["total_time"]} - {fullRouteStats["avg_total_time"]} - {fullRouteStats["slowest_train"]["total_time"]}</h2>
          <div className="routeMap">
            {route_order.map((stopId:string, index:number)=>(          
              <RouteBlock
                stopId={stopId}
                fullRouteStats = {fullRouteStats}
                avgTimeBetweenStops = {avgTimeBetweenStops}
                timeBetweenStats={this.getLegStats(route, index, timeBetweenStats)}
                isLegVisible ={index!=route_order.length-1}
              />
            ))}
          </div>
        </div>
        {this.createForm()}
        </React.Fragment>
      )
    }else if(train_response.hasOwnProperty("loading")){
      return(
        <img id="loadingGif" src={LoadingGif}></img>
      )
    }else if(train_response.hasOwnProperty("error"))
    {
      return(
        <Fragment>
          {this.createForm()}
          <h1>{train_response["error"]}</h1>
        </Fragment>
      )
    }
    return(
      this.createForm()
    )
  }
  createForm=()=>{
    return(
      <form onSubmit={this.handleSubmit}>
      <select name="route">
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
      <input type="submit"/>
    </form> 
    )
  }
  render() {
    return (
    <Fragment>
      <Header/>
      {this.drawRoute(this.state.response)}
    </Fragment>
    )
  }
}

export default App 

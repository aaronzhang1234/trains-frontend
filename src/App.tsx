import {Fragment, Component, FormEvent} from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import axios from 'axios';
import RouteBlock from './components/RouteBlock/RouteBlock';
import stations from './stations.json';
import { TimeDuration } from './services/Duration';
import Header from './components/Header/Header';
import LoadingGif from './assets/loading.gif'
import React from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { Duration } from 'luxon';

Chart.register(...registerables);

type AppState = {
  select_value:string
  start_date?: Date
  end_date?: Date
  response: any
}

class App extends Component<{}, AppState> {
  private chartRef: React.RefObject<HTMLCanvasElement>;
  private chartInstance: Chart | null = null;
  constructor(props: {}){
    super(props);
    this.state = {
      select_value: "brn-1",
      start_date: new Date(),
      end_date: undefined,
      response: {}
    }
    this.chartRef = React.createRef();

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
        .then(response=>this.handleTrainSuccess(response))    
        .catch(error=>this.handleError(error))
    }
  }
  handleTrainSuccess=(response:any)=>{
    this.setState({response:response.data}) 
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

  // Method to create or update the chart
  createOrUpdateChart = (train_list: any) => {
    if (!this.chartRef.current) return;
    var time_map = new Map()
    train_list.map((train:any)=>{
      if(train["total_time"]!= null){
        let train_duration = new TimeDuration(train["total_time"])
        let train_time = train_duration.roundDown()
        if(time_map.has(train_time)){
          time_map.set(train_time, time_map.get(train_time)+1)
        }else{
          time_map.set(train_time, 1)
        }
      }
    })

    console.log(time_map)  

    // Convert to chart data
    const labels = Array.from(time_map.keys()).sort();
    let data = new Array()
    labels.map((time:string)=>{
      data.push(time_map.get(time))
    })


    const config: ChartConfiguration = {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: '# of Trains',
          data: data, 
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };

    if (this.chartInstance) {
      console.log('Destroying existing chart');
      this.chartInstance.destroy();
      this.chartInstance = null;
    }

    // Create new chart
    console.log('Creating new chart');
    this.chartInstance = new Chart(this.chartRef.current, config);
  }

  componentDidUpdate(prevProps: {}, prevState: AppState) {
    // Only create chart when we have new train data and canvas is ready
    if (this.state.response !== prevState.response && 
        this.state.response.trains && 
        this.chartRef.current) {
      console.log('Component updated, creating chart');
      this.createOrUpdateChart(this.state.response.trains);
    }
  }

  componentWillUnmount() {
    // Clean up chart when component unmounts
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }

  drawRoute=(train_response:any)=>{
    if(train_response.hasOwnProperty("no_of_trains")){
      console.log("rerender")
      let route = train_response["route"]
      let route_order = (stations.route_info as any)[route]["route_order"];
      let fullRouteStats = train_response["stats"]["full_route_stats"]
      let timeBetweenStats = train_response["stats"]["time_between_stats"]      
      let avgTimeBetweenStops = new TimeDuration(fullRouteStats["avg_total_time"]).divideBy(route_order.length)
      return(
        <React.Fragment>
        <div id="routeContainer">
          <h2>{fullRouteStats["fastest_train"]["total_time"]} - {fullRouteStats["avg_total_time"]} - {fullRouteStats["slowest_train"]["total_time"]}</h2>

          {/* Canvas for the chart */}
          <div style={{width: '400px', height: '300px', margin: '20px 0'}}>
            <canvas ref={this.chartRef}></canvas>
          </div>
          {/* Map of the route */}
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

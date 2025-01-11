import React, {BaseSyntheticEvent, Component } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"
import "./Reconciler.css"
import axios from 'axios';

type ReconcilerState = {
  start_date?: Date
  end_date?: Date
  response: any
}

const station_dict:any = {"40830": "18th", "41120": "35th-Bronzeville-IIT", "40120": "35th/Archer", "41270": "43rd", "41080": "47th (Green Line)", "41230": "47th (Red Line)", "40130": "51st", "40580": "54th/Cermak", "40910": "63rd", "40990": "69th", "40240": "79th", "41430": "87th", "40450": "95th", "40680": "Adams/Wabash", "41240": "Addison (Blue Line)", "41440": "Addison (Brown Line)", "41420": "Addison (Red Line)", "41200": "Argyle", "40660": "Armitage", "40290": "Ashland/63rd", "40170": "Ashland (Green, Pink Lines)", "41060": "Ashland (Orange Line)", "40010": "Austin (Blue Line)", "41260": "Austin (Green Line)", "41320": "Belmont (Red, Brown, Purple&nbsp;Lines)", "40060": "Belmont (Blue Line)", "40340": "Berwyn", "41380": "Bryn Mawr", "40440": "California (Pink Line)", "41360": "California (Green Line)", "40570": "California (Blue Line-O'Hare Branch)", "40780": "Central Park", "40280": "Central (Green Line)", "41250": "Central (Purple Line)", "41000": "Cermak-Chinatown", "41690": "Cermak-McCormick Place", "41410": "Chicago (Blue Line)", "40710": "Chicago (Brown Line)", "41450": "Chicago (Red Line)", "40420": "Cicero (Pink Line)", "40970": "Cicero (Blue Line-Forest Park Branch)", "40480": "Cicero (Green Line)", "40630": "Clark/Division", "40380": "Clark/Lake", "40430": "Clinton (Blue Line)", "41160": "Clinton (Green Line)", "41670": "Conservatory", "40230": "Cumberland", "40090": "Damen (Brown Line)", "40210": "Damen (Pink Line)", "40590": "Damen (Blue Line-O'Hare Branch)", "40050": "Davis", "40690": "Dempster", "40140": "Dempster-Skokie", "40530": "Diversey", "40320": "Division", "40720": "Cottage Grove", "40390": "Forest Park", "40520": "Foster", "40870": "Francisco", "41220": "Fullerton", "40510": "Garfield (Green Line)", "41170": "Garfield (Red Line)", "40490": "Grand (Blue Line)", "40330": "Grand (Red Line)", "40760": "Granville", "40940": "Halsted (Green Line)", "41130": "Halsted (Orange Line)", "40980": "Harlem (Blue Line-Forest Park Branch)", "40020": "Harlem (Green Line)", "40750": "Harlem (Blue Line-O'Hare Branch)", "40850": "Harold Washington Library-State/Van Buren", "41490": "Harrison", "40900": "Howard", "40810": "Illinois Medical District", "40300": "Indiana", "40550": "Irving Park (Blue Line)", "41460": "Irving Park (Brown Line)", "40070": "Jackson (Blue Line)", "40560": "Jackson (Red Line)", "41190": "Jarvis", "41280": "Jefferson Park", "41180": "Kedzie (Brown Line)", "41040": "Kedzie (Pink Line)", "41070": "Kedzie (Green Line)", "40250": "Kedzie-Homan (Blue Line)", "41150": "Kedzie (Orange Line)", "41290": "Kimball", "41140": "King Drive", "40600": "Kostner", "41660": "Lake", "40700": "Laramie", "41340": "LaSalle", "40160": "LaSalle/Van Buren", "40770": "Lawrence", "41050": "Linden", "41020": "Logan Square", "41300": "Loyola", "40270": "Main", "40930": "Midway", "40790": "Monroe (Blue Line)", "41090": "Monroe (Red Line)", "41330": "Montrose (Blue Line)", "41500": "Montrose (Brown Line)", "41510": "Morgan", "40100": "Morse", "40650": "North/Clybourn", "40400": "Noyes", "40180": "Oak Park (Blue Line)", "41350": "Oak Park (Green Line)", "41680": "Oakton-Skokie", "40890": "O'Hare", "41310": "Paulina", "41030": "Polk", "40150": "Pulaski (Pink Line)", "40920": "Pulaski (Blue Line-Forest Park Branch)", "40030": "Pulaski (Green Line)", "40960": "Pulaski (Orange Line)", "40040": "Quincy/Wells", "40470": "Racine", "40610": "Ridgeland", "41010": "Rockwell", "41400": "Roosevelt", "40820": "Rosemont", "40800": "Sedgwick", "40080": "Sheridan", "40840": "South Boulevard", "40360": "Southport", "40190": "Sox-35th", "40260": "State/Lake", "40880": "Thorndale", "40350": "UIC-Halsted", "41700": "Washington/Wabash", "40730": "Washington/Wells", "40370": "Washington (Blue Line)", "41210": "Wellington", "41480": "Western (Brown Line)", "40740": "Western (Pink Line)", "40220": "Western (Blue Line-Forest Park Branch)", "40670": "Western (Blue Line-O'Hare Branch)", "40310": "Western (Orange&nbsp;Line)", "40540": "Wilson", "40460": "Merchandise Mart"}


class Reconciler extends Component<{}, ReconcilerState> {
  constructor(props: {}){
    super(props);
    this.state = {
      start_date: new Date(),
      end_date: undefined,
      response: {}
    }
  }
  onClick =(input:BaseSyntheticEvent) =>{
    let start_iso = this.state.start_date?.toISOString();
    let end_iso = this.state.end_date?.toISOString();
    const headers= {
      "Content-Type":"text/plain",
      "route": "brn-5",
      "start_time": start_iso,
      "end_time": end_iso
    }
    axios.get("https://ldchm3dr68.execute-api.us-east-1.amazonaws.com/Prod/trains", {headers, withCredentials:false} )
      .then(response=>this.setState({response:response.data}))
  }
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
                let station_name = station_dict[stop_id]
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
  render() {
    return (
    <React.Fragment>
      <div className="center_div">
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
        {this.update_trains(this.state.response)}
      </div>
    </React.Fragment>
    )
  }
}

export default Reconciler

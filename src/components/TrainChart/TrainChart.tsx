import React, { Component } from 'react';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { TimeDuration } from '../../services/Duration';

Chart.register(...registerables);

interface TrainChartProps {
  trainList: any[];
}

type TrainChartState = {
  isVisible : boolean
}

class TrainChart extends Component<TrainChartProps, TrainChartState> {
  private chartRef: React.RefObject<HTMLCanvasElement>;
  private chartInstance: Chart | null = null;

  constructor(props: TrainChartProps) {
    super(props);
    this.chartRef = React.createRef();
    this.state = {
      isVisible: false
    };
  }

  createOrUpdateChart = (train_list: any[]) => {
    if (!this.chartRef.current) return;
    var time_map = new Map();
    train_list.map((train: any) => {
      if (train["total_time"] != null) {
        let train_duration = new TimeDuration(train["total_time"]);
        let train_time = train_duration.roundDown();
        if (time_map.has(train_time)) {
          time_map.set(train_time, time_map.get(train_time) + 1);
        } else {
          time_map.set(train_time, 1);
        }
      }
    });

    console.log(time_map);

    // Convert to chart data
    const labels = Array.from(time_map.keys()).sort();
    let data = new Array();
    labels.map((time: string) => {
      data.push(time_map.get(time));
    });

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

  componentDidMount() {
    if (this.props.trainList && this.props.trainList.length > 0) {
      this.createOrUpdateChart(this.props.trainList);
    }
  }

  componentDidUpdate(prevProps: TrainChartProps) {
    if (this.props.trainList !== prevProps.trainList &&
        this.props.trainList &&
        this.chartRef.current) {
      console.log('Component updated, creating chart');
      this.createOrUpdateChart(this.props.trainList);
    }
  }

  componentWillUnmount() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  }
  toggleVisibility = () =>{
    this.setState({isVisible: !this.state.isVisible})
  }

  render() {
    let buttonText = this.state.isVisible?"Hide States":"Show Stats"
    return ( 
      <React.Fragment>
        <button onClick={this.toggleVisibility}>{buttonText}</button>
        <div style={{ width: '400px', height: '300px', margin: '20px 0', display: this.state.isVisible ? 'block' : 'none' }}>
            <canvas ref={this.chartRef}></canvas>
        </div>
      </React.Fragment>
    );
  }
}

export default TrainChart;

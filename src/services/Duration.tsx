import { Duration } from "luxon";

export class TimeDuration {
    private duration: Duration;

    constructor(timeString: string) {
        // Parse the time string (HOUR:MINUTE:SECOND) into a Luxon Duration object
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        this.duration = Duration.fromObject({ hours, minutes, seconds });
    }

    // Method to add a Luxon Duration to the current duration and return a new Duration
    add(duration: TimeDuration): TimeDuration {
        let stringDuration = this.duration.plus(duration.duration).toFormat('hh:mm:ss');
        return new TimeDuration(stringDuration)
    }

    // Method to subtract a Luxon Duration from the current duration and return a new Duration
    subtract(duration: TimeDuration): TimeDuration {
        let stringDuration = this.duration.minus(duration.duration).toFormat('hh:mm:ss');
        return new TimeDuration(stringDuration)
    }

    // Method to convert the Luxon Duration object back to the original time format (HOUR:MINUTE:SECOND)
    toString(): string {
        return this.duration.toFormat('hh:mm:ss')
    }
    
    roundDown() : string{
        var obj = {
            "hours":this.duration.hours,
            "minutes":this.duration.minutes,
            "seconds":0
        }
        return Duration.fromObject(obj).toFormat("hh:mm")
    }

    compare(durationToCompare: TimeDuration): number{
        const totalSeconds = this.duration.as('seconds')
        const comparisonSeconds = durationToCompare.duration.as('seconds')
        if(totalSeconds == comparisonSeconds){
            return 0
        }else if(totalSeconds > comparisonSeconds){
            return 1
        }
        return -1
    }

    // Method to divide the Luxon Duration by a certain number and return a new Duration
    divideBy(number: number): TimeDuration {
        if (number === 0) {
            throw new Error('Cannot divide by zero');
        }
        const totalSeconds = this.duration.as('seconds') / number;
        let stringDuration = Duration.fromObject({ seconds: totalSeconds }).toFormat('hh:mm:ss');
        return new TimeDuration(stringDuration)
    } 
}
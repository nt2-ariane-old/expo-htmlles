import React, { Component } from "react";
import SunCalc from 'suncalc'
import './analog.css'
export default class Horloge extends Component {
    constructor(props) {
        super(props)

        const position = [45.5125995, -73.5627842]
        const [latitude, longitude] = position

        var times = SunCalc.getTimes(new Date(), latitude, longitude);


        const current = new Date()
        const noon = new Date()
        noon.setHours(12, 0, 0, 0)

        let tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)

        this.props.setSunlight(times.dawn, times.dusk)
        this.state = {
            sunset: times.sunset,
            sunrise: times.sunrise,
            sunriseEnd: times.sunriseEnd,
            sunsetStart: times.sunsetStart,
            crepuscule: times.dusk,
            aube: times.dawn,
            time: current,
            noon: noon,
            time_until_sunset: this.getTimeBetween(current, times.sunset),
            time_since_sunrise: this.getTimeBetween(current, times.sunrise),
            time_from_noon: this.getTimeBetween(current, noon),
            longitude: longitude,
            latitude: latitude
        }

    }
    componentWillUnmount() {
        clearInterval(this.intervalID);
    }
    componentDidUpdate(prevProps, prevStates) {
        if (prevStates.time !== this.state.time) {
            this.getPercentage()
        }
    }
    timeRemaining = () => {
        const time = new Date()
        // time.setHours(6, 44, 0, 0)
        this.setState({
            time: time,
        }, () => {
            this.setState({
                time_since_sunrise: this.getTimeBetween(this.state.time, this.state.sunrise),
                time_until_sunset: this.getTimeBetween(this.state.time, this.state.sunset),
                time_from_noon: this.getTimeBetween(this.state.time, this.state.noon)
            })
        });
    }
    getTimeBetween(current, moment) {
        const diff = new Date(0, 0, 0, 0, 0, 0, 0)
        diff.setSeconds(this.diff_times(current, moment))

        return diff
    }

    diff_times(dt2, dt1) {
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        return Math.abs(Math.round(diff));
    }
    formatTime = (time) => {
        let minutes = time.getMinutes()
        if (parseInt(minutes) < 10) {
            minutes = "0" + time.getMinutes()
        }
        let seconds = time.getSeconds()
        if (parseInt(seconds) < 10) {
            seconds = "0" + time.getSeconds()
        }
        return time.getHours() + ':' + minutes + ':' + seconds
    }
    componentDidMount = () => {
        this.clockInterval = setInterval(this.clock, 100);
        this.solarInterval = setInterval(this.timeRemaining, 100);
    }
    getPercentage = () => {
        const { sunrise, sunset, aube, crepuscule, time } = this.state

        const sSunrise = sunrise.getSeconds() + (sunrise.getMinutes() * 60) + (sunrise.getHours() * 3600)
        const sSunset = sunset.getSeconds() + (sunset.getMinutes() * 60) + (sunset.getHours() * 3600)

        const sDawn = aube.getSeconds() + (aube.getMinutes() * 60) + (aube.getHours() * 3600)
        const sDusk = crepuscule.getSeconds() + (crepuscule.getMinutes() * 60) + (crepuscule.getHours() * 3600)

        const sTime = time.getSeconds() + (time.getMinutes() * 60) + (time.getHours() * 3600)
        const sNoon = 12 * 3600

        if (sTime === sSunrise) {
            this.clockInterval = setInterval(this.clock, 100);
        }

        let percent = 0
        if (sTime < sNoon) {
            const middle = sTime - sDawn
            const end = sNoon - sDawn
            percent = 100 - ((middle * 100) / end);

        }
        else if (sTime < sSunset) {
            const middle = sTime - sNoon
            const end = sDusk - sNoon
            percent = ((middle * 100) / end);
        }
        else {
            percent = 100
            clearInterval(this.clockInterval);
        }
        this.props.setOpacity(percent)


    }
    clock = () => {
        //Definition des aiguilles
        let sunHand = document.querySelector('.solar-hand'),
            moonHand = document.querySelector('.moon-hand'),
            nightHand = document.querySelector('.night-hand'),
            dayHand = document.querySelector('.day-hand')

        //Definition des tmeps en secondes
        const { sunrise, sunriseEnd, sunset, sunsetStart, aube, crepuscule, time } = this.state

        const sSunrise = sunrise.getSeconds() + (sunrise.getMinutes() * 60) + (sunrise.getHours() * 3600)
        const sSunriseEnd = sunriseEnd.getSeconds() + (sunriseEnd.getMinutes() * 60) + (sunriseEnd.getHours() * 3600)

        const sSunsetStart = sunsetStart.getSeconds() + (sunsetStart.getMinutes() * 60) + (sunsetStart.getHours() * 3600)
        const sSunset = sunset.getSeconds() + (sunset.getMinutes() * 60) + (sunset.getHours() * 3600)

        const sDawn = aube.getSeconds() + (aube.getMinutes() * 60) + (aube.getHours() * 3600)
        const sDusk = crepuscule.getSeconds() + (crepuscule.getMinutes() * 60) + (crepuscule.getHours() * 3600)

        const sTime = time.getSeconds() + (time.getMinutes() * 60) + (time.getHours() * 3600)
        const sNoon = 12 * 3600

        //Calcul du fond jour / nuit
        if (sTime < sDawn && sTime > sDusk) {
            //C'est la nuit complete
            nightHand.style.transform = "rotate(" + 0 + "deg)";
            dayHand.style.transform = "rotate(" + 180 + "deg)";

        }
        else if (sTime > sSunriseEnd && sTime < sSunsetStart) {
            //C'est le jour complet
            nightHand.style.transform = "rotate(" + 180 + "deg)";
            dayHand.style.transform = "rotate(" + 0 + "deg)";

        }
        else if (sDawn < sTime && sSunriseEnd > sTime) {
            //Periode du Lever du soleil
            const position = sTime - sDawn
            const max = sSunriseEnd - sDawn

            let degree = (position * 180) / max;
            let degreeOpp = degree + 180

            nightHand.style.transform = "rotate(" + degree + "deg)";
            dayHand.style.transform = "rotate(" + degreeOpp + "deg)";
        }
        else if (sSunsetStart < sTime && sDusk > sTime) {
            //Periode du coucher du soleil
            const position = sTime - sSunsetStart
            const max = sDusk - sSunsetStart

            let degree = (position * 180) / max;
            let degreeOpp = degree + 180

            nightHand.style.transform = "rotate(" + degree + "deg)";
            dayHand.style.transform = "rotate(" + degreeOpp + "deg)";
        }
        else {
            console.log('Not in the range')
        }

        //Calcul du degré Soleil Lune

        let degree = 0
        if (sTime < sNoon) {
            const position = sTime - sSunrise
            const max = sNoon - sSunrise
            degree = (position * 90) / max;
        }
        else if (sTime < sSunset) {
            const middle = sTime - sNoon
            const end = sSunset - sNoon
            degree = ((middle * 90) / end) + 90;
        }
        else {
            degree = 0
        }
     
       
        let degreeS = degree - 90
        let degreeM = degree + 90

        // let degreeS = Math.abs(SunCalc.getPosition(new Date(), this.state.latitude, this.state.longitude).altitude * 57.2958)
        // let degreeM = Math.abs(SunCalc.getMoonPosition(time, this.state.latitude, this.state.longitude).altitude * 57.2958)


        sunHand.style.transform = "rotate(" + degreeS + "deg)";
        moonHand.style.transform = "rotate(" + degreeM + "deg)";
    }

    render() {
        const { aube, crepuscule, sunrise, sunset, time_from_noon, time_until_sunset, time_since_sunrise, time, noon } = this.state
        return (
            <div className="horloge" >

                <div className="clock-container">
                    <div className="clock">
                        <div className="dot"></div>
                        <div>
                            <div className="day-hand"></div>
                            <div className="night-hand"></div>
                            <div className="moon-hand"></div>
                            <div className="solar-hand"></div>
                        </div>


                    </div>
                </div>
                <div className="times">
                    <div className="time"> Temps de l'Aube: {this.formatTime(aube)}</div>
                    <div className="time"> Temps du lever du soleil : {this.formatTime(sunrise)}</div>
                    <div className="time"> Temps depuis le lever du soleil : {this.formatTime(time_since_sunrise)}</div>
                    <div className="time"> Temps {time < noon ? 'restant avant' : 'depuis'} midi : {this.formatTime(time_from_noon)}</div>
                    <div className="time"> Temps actuel : {this.formatTime(time)}</div>

                    <div className="time"> Temps avant le coucher du soleil : {this.formatTime(time_until_sunset)}</div>
                    <div className="time"> Heure du coucher du soleil : {this.formatTime(sunset)}</div>
                    <div className="time"> Temps du crepuscule : {this.formatTime(crepuscule)}</div>
                </div>
            </div>
        )
    }
}
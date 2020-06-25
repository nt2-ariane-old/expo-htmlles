import React, { Component } from "react";
import { getSunrise, getSunset } from 'sunrise-sunset-js';
import SunCalc from 'suncalc'
import './analog.css'
export default class Horloge extends Component {
    constructor(props) {
        super(props)

        const position = [45.541194499999996, -73.6768864]
        const [longitude, latitude] = position

        var times = SunCalc.getTimes(new Date(), longitude, latitude);


        const current = new Date()
        const noon = new Date()
        noon.setHours(12, 0, 0, 0)

        let tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const sunrise = getSunrise(longitude, latitude, current)
        const sunset = getSunset(longitude, latitude, tomorrow)
        this.props.setSunlight(sunrise, sunset)
        this.state = {
            sunset: sunset,
            sunrise: sunrise,
            time: current,
            noon: noon,
            time_until_sunset: this.getTimeBetween(current, sunset),
            time_since_sunrise: this.getTimeBetween(current, sunrise),
            time_from_noon: this.getTimeBetween(current, noon)
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

    getTimeDegree = () => {
        const { sunrise, sunset, time } = this.state

        const sSunrise = sunrise.getSeconds() + (sunrise.getMinutes() * 60) + (sunrise.getHours() * 3600)
        const sSunset = sunset.getSeconds() + (sunset.getMinutes() * 60) + (sunset.getHours() * 3600)
        const sTime = time.getSeconds() + (time.getMinutes() * 60) + (time.getHours() * 3600)
        const sNoon = 12 * 3600

        let degree = 0
        if (sTime < sNoon) {
            const middle = sTime - sSunrise
            const end = sNoon - sSunrise
            degree = (middle * 90) / end;


        }
        else if (sTime < sSunset) {
            const middle = sTime - sNoon
            const end = sSunset - sNoon
            degree = ((middle * 90) / end) + 90;
        }
        else {
            degree = 0
        }
        return degree
    }
    getPercentage = () => {
        const { sunrise, sunset, time } = this.state

        const sSunrise = sunrise.getSeconds() + (sunrise.getMinutes() * 60) + (sunrise.getHours() * 3600)
        const sSunset = sunset.getSeconds() + (sunset.getMinutes() * 60) + (sunset.getHours() * 3600)
        const sTime = time.getSeconds() + (time.getMinutes() * 60) + (time.getHours() * 3600)
        const sNoon = 12 * 3600

        if (sTime === sSunrise) {
            this.clockInterval = setInterval(this.clock, 100);
        }

        let percent = 0
        if (sTime < sNoon) {
            const middle = sTime - sSunrise
            const end = sNoon - sSunrise
            percent = 100 - ((middle * 100) / end);

        }
        else if (sTime < sSunset) {
            const middle = sTime - sNoon
            const end = sSunset - sNoon
            percent = ((middle * 100) / end);
        }
        else {
            percent = 100
            clearInterval(this.clockInterval);
        }
        this.props.setOpacity(percent)


    }
    clock = () => {
        let weekday = new Array(7),
            d = new Date(),
            h = d.getHours(),
            m = d.getMinutes(),
            s = d.getSeconds(),

            sHand = document.querySelector('.solar-hand'),
            mHand = document.querySelector('.moon-hand')

        let degree = this.getTimeDegree() + 90
        let degreeS = degree + 180

        sHand.style.transform = "rotate(" + degreeS + "deg)";
        mHand.style.transform = "rotate(" + degree + "deg)";
    }

    render() {
        const { sunrise, sunset, time_from_noon, time_until_sunset, time_since_sunrise, time, noon } = this.state
        return (
            <div className="horloge" style={{ opacity: 1 - this.props.opacity }}>

                <div className="clock-container">
                    <div className="clock">
                        <div className="dot"></div>
                        <div>
                            <div className="moon-hand"></div>
                            <div className="solar-hand"></div>
                        </div>


                    </div>
                </div>
                <div className="times">
                    <div className="time"> Temps du lever du soleil : {this.formatTime(sunrise)}</div>
                    <div className="time"> Temps depuis le lever du soleil : {this.formatTime(time_since_sunrise)}</div>
                    <div className="time"> Temps {time < noon ? 'restant avant' : 'depuis'} midi : {this.formatTime(time_from_noon)}</div>
                    <div className="time"> Temps actuel : {this.formatTime(time)}</div>

                    <div className="time"> Temps avant le coucher du soleil : {this.formatTime(time_until_sunset)}</div>
                    <div className="time"> Heure du coucher du soleil : {this.formatTime(sunset)}</div>
                </div>
            </div>
        )
    }
}
import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleDown, faArrowAltCircleLeft, faArrowAltCircleUp, faArrowAltCircleRight, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'

export default class Arrows extends Component {
    changePanel = () => {
        const { side } = this.props
        this.props.setPosition(side)
    }
    render() {
        const { side } = this.props
        let icon = null
        switch (side) {
            case 'left':
                icon = faArrowAltCircleLeft
                break;  
            case 'right':
                icon = faArrowAltCircleRight
                break;  
            case 'top':
                icon = faArrowAltCircleUp
                break;  
            case 'bottom':
                icon = faArrowCircleDown
                break;  
        
            default:
                break;
        }
        return (
            <button className={`arrow ${side}`} onClick={this.changePanel}>
                
                <FontAwesomeIcon icon={icon} />

            </button>
        )
    }
}
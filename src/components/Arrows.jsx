import React, { Component } from 'react'
import Arrow from './Arrow'
export default class Arrows extends Component {
    constructor(props) {
        super(props)
        this.state = {
            position: 'center'
        }
    }
    setPosition = (side) => {
        const { position } = this.state

        if (position === 'center') {
            this.setState({ position: side }, () => this.props.setActive(this.state.position))
        }
        else {
            this.setState({ position: 'center' }, () => this.props.setActive(this.state.position))
        }

    }
    render() {
        const { position } = this.state

        return (
            <div className='arrows' style={{ opacity: 1 - this.props.opacity }}>
                {
                    (position === 'center' || position === 'bottom') &&
                    <Arrow side='top' setPosition={this.setPosition} />
                }
                {
                    (position === 'center' || position === 'top') &&
                    <Arrow side='bottom' setPosition={this.setPosition} />
                }
                {
                    (position === 'center' || position === 'left') &&
                    <Arrow side='right' setPosition={this.setPosition} />
                }
                {
                    (position === 'center' || position === 'right') &&
                    <Arrow side='left' setPosition={this.setPosition} />
                }

            </div>
        )
    }
}
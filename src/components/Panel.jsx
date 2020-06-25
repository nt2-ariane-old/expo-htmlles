import React, { Component } from 'react'

export default class Panel extends Component {
    render() {
        const { side, active } = this.props
        const classActive = active ? 'active' : ''
        return (
            <div className={`panel ${side} ${classActive}`}>
                <div className='panel-content'>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
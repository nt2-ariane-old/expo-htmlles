import React, { Component } from 'react';
import { About, Panel, Arrows, Oeuvre, Tuto, Horloge, Cover } from './components'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active_panel: 'center',
      opacity: 0,
      show_message: false,
      sunset: null,
      sunrise: null
    }
  }
  setActive = (side) => {
    const leftPanel = document.querySelector('.panel.left')
    const rightPanel = document.querySelector('.panel.right')
    const topPanel = document.querySelector('.panel.top')
    const bottomPanel = document.querySelector('.panel.bottom')
    const centerPanel = document.querySelector('.panel.center')

    switch (side) {
      case 'center':
        centerPanel.style.left = '0'
        centerPanel.style.top = '0'

        rightPanel.style.left = '100vw'
        rightPanel.style.top = '0'

        leftPanel.style.left = '-100vw'
        leftPanel.style.top = '0'

        topPanel.style.left = '0'
        topPanel.style.top = '-100vh'

        bottomPanel.style.left = '0'
        bottomPanel.style.top = '100vh'
        break;
      case 'left':
        centerPanel.style.left = '100vw'
        centerPanel.style.top = '0'

        leftPanel.style.left = '0'
        leftPanel.style.top = '0'

        rightPanel.style.left = '200vw'
        rightPanel.style.top = '0'

        topPanel.style.left = '0'
        topPanel.style.top = '-100vh'

        bottomPanel.style.left = '0'
        bottomPanel.style.top = '100vh'
        break;
      case 'right':
        centerPanel.style.left = '-100vw'
        centerPanel.style.top = '0'

        leftPanel.style.left = '-200vw'
        leftPanel.style.top = '0'

        rightPanel.style.left = '0'
        rightPanel.style.top = '0'

        topPanel.style.left = '0'
        topPanel.style.top = '-100vh'

        bottomPanel.style.left = '0'
        bottomPanel.style.top = '100vh'
        break;
      case 'top':
        centerPanel.style.left = '0'
        centerPanel.style.top = '100vh'

        rightPanel.style.left = '100vw'
        rightPanel.style.top = '0'

        leftPanel.style.left = '-100vw'
        leftPanel.style.top = '0'

        topPanel.style.left = '0'
        topPanel.style.top = '0'

        bottomPanel.style.left = '0'
        bottomPanel.style.top = '200vh'
        break;
      case 'bottom':
        centerPanel.style.left = '0'
        centerPanel.style.top = '-100vh'

        rightPanel.style.left = '100vw'
        rightPanel.style.top = '0'

        leftPanel.style.left = '-100vw'
        leftPanel.style.top = '0'

        topPanel.style.left = '0'
        topPanel.style.top = '-200vh'

        bottomPanel.style.left = '0'
        bottomPanel.style.top = '0'
        break;

      default:
        break;
    }
    this.setState({ active_panel: side })
  }
  setOpacity = (percent) => {
    this.setState({ opacity: percent / 100 })
    if (percent === 100) {
      this.setState({ show_message: true })
    }
    else {
      this.setState({ show_message: false })

    }
  }
  setSunlight = (sunrise, sunset) => {
    this.setState({ sunrise: sunrise, sunset: sunset })
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
    setTimeout(() =>
      document.querySelector('.App').style.opacity = '1'

      , 1000)
  }
  render() {
    const { active_panel } = this.state
    return (
      <div className="App">

        {
          this.state.show_message ?
            <div className='message-container'>

              <div className='message'>
                Ce site fonctionne selon les heures d'ensolleillement. Les heures d'ensolleillement à Montréal sont de {this.formatTime(this.state.sunrise)} à {this.formatTime(this.state.sunset)}
              </div>
            </div>
            :
            <div className="app-content" >
              <Cover opacity={this.state.opacity} />
              <Panel side='center' active={active_panel === 'center'}>
                <About />
              </Panel>
              <Panel side='top' active={active_panel === 'top'}>
                <Oeuvre />
              </Panel>
              <Panel side='left' active={active_panel === 'left'} >
                <Oeuvre />
              </Panel>
              <Panel side='right' active={active_panel === 'right'} >
                <Oeuvre />
              </Panel>
              <Panel side='bottom' active={active_panel === 'bottom'} >
                <Tuto />
              </Panel>

              <Arrows setActive={this.setActive} opacity={this.state.opacity} />
              <Horloge setOpacity={this.setOpacity} setSunlight={this.setSunlight} opacity={this.state.opacity} />
            </div>
        }
      </div>
    );
  }
}


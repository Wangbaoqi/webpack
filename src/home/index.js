import React, { Component } from 'react'
import ReactDom from 'react-dom'

import './index.less'

import Logo from './images/logo.png'

import '../../common/index'


class Home extends Component {

  constructor(props) {
    super(props)

    this.state =  {
      Text: null
    }
  }
 
  

  handleShow() {
    import('./test.js').then((text) => {
      this.setState({
        Text: text.default
      })
    })
  }
  render() {

    const { Text } = this.state

    console.log(Text);
    
    return (
      <div className='webpack'> 
      <div className='webpack-l'>welcome to webpack world, this is a nate test project </div>
        <img src={Logo} alt="" onClick={this.handleShow.bind(this)}/>
        {
          Text ? <Text/> : ''
        }
      </div>
    )
  }
}
// var el = document.createElement('div')
// el.id = 'root'

// document.body.appendChild(el)

ReactDom.render(
  <Home/>,
  document.getElementById('root')
)
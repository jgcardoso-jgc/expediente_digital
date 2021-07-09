
import './App.css';
import React from 'react';
import { withRouter } from "react-router";


var apiURL = "https://demo-api.incodesmile.com/";
const apiKey = "570c70d1693636fdc200713415ebc3973afbdf19";

const helloSdk = window.Hello.create({
  apiKey: apiKey,
  apiURL: apiURL,
});

class Hello extends React.Component {

  componentDidMount() {
    let that = this;
    this.renderLogin(that)
  }

  renderLogin(that) {
      navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(function(mediaStream) {
        helloSdk.renderLogin(document.getElementById('incode'), {

          onSuccess: r => {
            console.log('onSuccess', r)
            document.getElementById('root').innerHTML = `Welcome Back, your token is ${r.token}`
          },
          onError: r => {
            console.log('on error', r)
            console.log('that:'+that)
            that.props.history.push('/onboard')
          },
        })
      }).catch(function(err) {
        console.log(err)
      });
}

  render (){
    return <div id="incode" className="App">
      <header className="App-header">
      </header>
    </div>
  }
}

export default withRouter(Hello);

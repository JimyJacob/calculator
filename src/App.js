import React, { Component } from 'react';
import Calculator from './Components/Calculator';

class App extends Component {
	render() {
		return (
			<div className="App">
        {/*<img src={logo} className="App-logo" alt="logo" />*/}   
        <Calculator />
      </div>
		);
	}
}

export default App;

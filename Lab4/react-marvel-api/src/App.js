import logo from './logo.svg';
import './App.css';
import Characters from './components/Characters'
import Character from './components/Character'
import Comics from './components/Comics'
import Comic from './components/Comic'
import Series from './components/Series'
import SingleSeries from './components/SingleSeries'
import Home from './components/Home'

import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import NotFound from './components/NotFound';

function App() {
  return (

    <Router>
    
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>
				This is a simple example of using React to Query the Marvel API.
			</h1>
        {/* <h1 className='App-title'>Welcome to the React.js Marvel API Example</h1> */}
					<Link className='showlink' to='/'>
						Home
					</Link>
					<Link className='showlink' to='/characters/page/0'>
          Characters
					</Link>
          <Link className='showlink' to='/comics/page/0'>
          Comics
					</Link>
          <Link className='showlink' to='/series/page/0'>
          Series
					</Link>

      </header>
      <br></br>
      <br></br>
      <div className='App-body'>
        
        <Route exact path = '/' component = {Home}/>
        <Route exact path = '/characters/page/:page' component = {Characters}/>
        <Route exact path = '/characters/:id' component = {Character}/>
        <Route exact path = '/comics/page/:page' component = {Comics}/>
        <Route exact path = '/comics/:id' component = {Comic}/>
        <Route exact path = '/series/:id' component = {SingleSeries}/>
        <Route exact path = '/series/page/:page' component = {Series}/> 
        {/* <Route exact path="*"><NotFound /></Route> */}
        
      </div>
      
    </div>
      
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Home from './routes/Home';
import Search from './routes/Search';
import Results from './routes/Results';

function App() {
  return (
    <Router>
      <NavBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/results" component={Results} />
      </Switch>
    </Router>
  );
}

export default App;

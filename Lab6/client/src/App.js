import Home from './components/Home';
// import Error from './components/Error';
import NotFound from './components/NotFound';
import SinglePokemon from './components/SinglePokemon'
import PokemonList from './components/PokemonList'
import TrainerList from './components/TrainerList'
import SearchPokemon from './components/SearchPokemon';
import './App.css';
import { BrowserRouter as Router, Route, Routes, NavLink} from 'react-router-dom';

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider
} from '@apollo/client';

// Apollo connection
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: 'http://localhost:4000'
  })
});

function App() {
  return (

    <ApolloProvider client={client}>
     <Router>
     <nav>
         <h1>Pokemon API</h1>
         <NavLink className="navLink" to="/">
           Home
         </NavLink>
         
         <br/>
         <NavLink className="navLink" to="/pokemon/page/0">
           Pokemons
         </NavLink>
         
         <br/>
         <NavLink className="navLink" to="/trainers">
           Trainers
         </NavLink>
         
       </nav>
       <Routes>
        <Route exact path="/" element={<Home/>} />
         <Route exact path="/pokemon/page/:pagenum" element={<PokemonList/>} />
         <Route exact path="/pokemon/search/:name" element={<SearchPokemon/>} />
         <Route exact path="/pokemon/:id" element={<SinglePokemon/>} />
         <Route exact path="/trainers" element={<TrainerList/>} />
         
         <Route exact path="*" element={<NotFound/>} />

       </Routes>
     </Router>
   </ApolloProvider>

   
  );
}

export default App;

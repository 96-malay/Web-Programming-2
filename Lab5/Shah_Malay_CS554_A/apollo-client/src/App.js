// import logo from './logo.svg';
import React from 'react'
import { BrowserRouter as Router, Route, Routes, NavLink} from 'react-router-dom';
import './App.css';

import Images from './components/Images'
import MyBin from './components/MyBin'
import MyPosts from './components/MyPosts';
import NewPost from './components/NewPost';
import NotFound from './components/NotFound';

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
         <h1>Binterest</h1>
         <NavLink className="navLink" to="/">
           Home
         </NavLink>
         
         <br/>
         <NavLink className="navLink" to="/my-bin">
           My-Bin
         </NavLink>
         
         <br/>
         <NavLink className="navLink" to="/my-posts">
           My-posts
         </NavLink>
         
         <br/>
         <NavLink className="navLink" to="/new-post">
           New-post
         </NavLink>
       </nav>
      
       <br/>
       <br/>
       <Routes>
        <Route exact path="/" element={<Images/>} />
         <Route exact path="/my-bin" element={<MyBin/>} />
         <Route exact path="/my-posts" element={<MyPosts/>} />
         <Route exact path="/new-post" element={<NewPost/>} />
         <Route exact path="*" element={<NotFound/>} />

       </Routes>
     </Router>
   </ApolloProvider>
  );
}

export default App;



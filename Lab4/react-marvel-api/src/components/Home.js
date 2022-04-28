import React from 'react';
import '../App.css';
import marvelSigGif from '../img/giphy.gif';

const Home = () => {
	return (
		<div>
            
            <img  className= "gif" src={marvelSigGif}  alt ="marvelSigGif"/>
			
		</div>
	);
};

export default Home;

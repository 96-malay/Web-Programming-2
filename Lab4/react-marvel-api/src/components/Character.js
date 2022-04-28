import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import noImage from '../img/download.jpeg';
import { makeStyles, Card, CardContent, CardMedia, Typography, CardHeader } from '@material-ui/core';
import '../App.css';
import NotFound from './NotFound'
import BadIP from './BadIP'

const md5 = require('blueimp-md5');
const publickey = '03d21d18f5a75c5bdd18ae241c00de0b'
const privatekey = 'e33ccc1726c410a03db739247025082e7925323a'
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);


const useStyles = makeStyles({
	card: {
		maxWidth: 550,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #1e8678',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
	},
	titleHead: {
		borderBottom: '1px solid #1e8678',
		fontWeight: 'bold'
	},
	grid: {
		flexGrow: 1,
		flexDirection: 'row'
	},
	media: {
		height: '100%',
		width: '100%'
	},
	button: {
		color: '#1e8678',
		fontWeight: 'bold',
		fontSize: 12
	}
});

const Character = (props) => {
	const [ characterData, setCharacterData ] = useState(undefined);
    const [ error,setErrorData] = useState(false)
    const [ badIP,setBadIPData] = useState(false)
	const [ loading, setLoading ] = useState(true);
	const classes = useStyles();
	console.log('character ID:',props.match.params.id )
    // useEffect( () => {

    // },[props.match.params.id])
	useEffect(
		() => {
			console.log ("useEffect fired")
            function checkId(id) {
                try{
                    if(!id){
                        setBadIPData(true)
                        
                    }else{
                        id = Number(id)
                    if(isNaN(id) || id < 0 || typeof(id) !== 'number'){
                        setBadIPData(true)
                        
                    }else{
                        setBadIPData(false)
                    }
                    }

                }catch(e){
                    setBadIPData(true)
                   
                }
            }
			async function fetchData() {
				try {
                    checkId(props.match.params.id)
                    if(! badIP){
                        const baseUrl = `https://gateway.marvel.com:443/v1/public/characters/${props.match.params.id}`;
                        const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash ;
                        console.log()
                        const { data: character } = await axios.get(url);
                        if (! character || character.length === 0){
                            setErrorData(true)
                        }else{
                            setCharacterData(character);
                            setErrorData(false)
                        }
                        console.log(character);
                    }
                    setLoading(false);
                    
				} catch (e) {
                    setErrorData(true)
					console.log(e);
				}
			}
			fetchData();
		},
		[ props.match.params.id ]
	);
        console.log('error', error)
        console.log('badip',badIP)


    if (error) {
        return (
            <NotFound/>
        );
    } else if(badIP){
        return(
            <BadIP/>
        )
    } else {
        if (loading) {
            return (
                <div>
                    <h1>Loading</h1>
                </div>
            );
        } else {  

 

    // if (loading){
    //     return (
    //         <div>
    //             <h1>Loading</h1>
    //         </div>
    //     );
    // } else {
    //     if( error){
    //         return (
    //             <NotFound/>
    //         );
    //     }else {
    

            return (
            <div>
                
                <Card className={classes.card}>
                    <CardHeader className={classes.titleHead} title={characterData.data.results[0].name}/>
                    <CardMedia
                        className={classes.media}
                        component="img"
                        image={
                            characterData.data.results[0].thumbnail ? characterData.data.results[0].thumbnail.path + "." + characterData.data.results[0].thumbnail.extension: noImage
                        }
                        title="character image"
                        />
                    <CardContent>
                      
                                <dl>
                                        <dt className="title"> Description:</dt>
                                        { characterData && characterData.data.results[0].description ? ( <dd>{characterData.data.results[0].description}</dd> ) : (  <dd>N/A</dd> )}                           
                                </dl>

                                <dl>
                                        <dt className="title"> Total Comics:</dt>
                                        { characterData && characterData.data.results[0].comics.available ? ( <dd>{ characterData.data.results[0].comics.available }</dd> ) : (  <dd>N/A</dd> )}                           
                                </dl>

                                <dl>
                                        <dt className="title"> Total Series:</dt>
                                        { characterData && characterData.data.results[0].series.available ? ( <dd>{ characterData.data.results[0].series.available }</dd> ) : (  <dd>N/A</dd> )}                           
                                </dl>

                                <dl>
                                        <dt className="title"> Total Stories:</dt>
                                        { characterData && characterData.data.results[0].stories.available ? ( <dd>{ characterData.data.results[0].series.available }</dd> ) : (  <dd>N/A</dd> )}                           
                                </dl>

                            
                     
                    </CardContent>
                </Card>
            </div>
        );
    }
    }
}

export default Character;

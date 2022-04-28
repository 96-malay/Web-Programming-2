import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link ,useParams} from 'react-router-dom';
import SearchCharacters from './SearchCharacters';
import noImage from '../img/download.jpeg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';
import '../App.css';
import NotFound from './NotFound'
import BadIP from './BadIP';

const md5 = require('blueimp-md5');
const publickey = '03d21d18f5a75c5bdd18ae241c00de0b'
const privatekey = 'e33ccc1726c410a03db739247025082e7925323a'
const ts = new Date().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = 'https://gateway.marvel.com:443/v1/public/series';
const url = baseUrl + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;



console.log(url)
const useStyles = makeStyles({
	card: {
		maxWidth: 250,
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
const SeriesList = (props) => {
	// let {pagenumber} = useParams();
	let pagenumber = props.match.params.page
    console.log(props.match.params.page)
	const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ charData, setCharData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [currentPage, setCurrentPage] = useState(Number(pagenumber)); // how to get this value?
  	const [nextPage, setNextPage] = useState(false);
      const [error,setErrorData] = useState(false)
      const [badInput,setBadInputData] = useState(false)

	let card = null;
  
    console.log(currentPage, typeof(currentPage))
 
	useEffect(() => {
        setCurrentPage(Number(pagenumber))
	}, [pagenumber]);

	useEffect(
		() => {
			console.log('search comics useEffect fired');

			async function fetchData() {
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
                    // const baseUrl = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${searchName}`;
                    // const url = baseUrl + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash + '&limit=20';

                    const searchUrl = baseUrl + '?titleStartsWith=' + searchTerm + '&ts=' + ts + '&apikey=' + publickey + '&hash=' + hash ;
					const { data } = await axios.get(searchUrl);
                    // console.log(data)
					setSearchData(data.data.results);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				console.log ('searchTerm is set to ',searchTerm)
				fetchData();
			}
		},
		[ searchTerm ]
	);

	useEffect(() => {
		console.log('pagination useEffect fired');
        function checkPage(p) {
            try{
                    if(!p){
                        setBadInputData(true)
                        
                    }else{
                        p = Number(p)
                    if(isNaN(p) || p < 0 || typeof(p) !== 'number'){
                        setBadInputData(true)
                        
                    }else{
                        setBadInputData(false)
                    }
                    }

                }catch(e){
                    setBadInputData(true)
                   
                }
        }
		async function fetchData() {
		  try {
            // checkPage(currentPage)
            // if(!badInput){
                // how to control buttons
                let limit = 20
                // const baseUrl = 'https://gateway.marvel.com:443/v1/public/characters?limit=' + limit + '&offset=' + (Number(currentPage));
                let url = baseUrl + '?limit=' + limit + '&offset=' + (Number(currentPage)*limit) + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
                console.log('url:',url)
                const { data } = await axios.get(url );
                console.log("current page" , data);
                setBadInputData(false)
                if (! data.data.results || data.data.results.length === 0){
                    setErrorData(true)
                }else{
                    if(isNaN(props.match.params.page)){
                        setBadInputData(true)
                    }else{
                        setCharData(data.data.results);
                        setErrorData(false)
                    }
                    
                }
                
                setLoading(false);
        
                url = baseUrl + '?limit=' + limit + '&offset=' + ((Number(currentPage)+1)*limit) + '?ts=' + ts + '&apikey=' + publickey + '&hash=' + hash;
                const { data: nextPageData } = await axios.get(url );
                console.log('next page data',nextPageData);
                if(nextPageData.data.results.length !== 0){
                    setNextPage(true)
                }else{
                    setNextPage(false)
                }
            // }
			
			
	
		  } catch (e) {
            setErrorData(true)
			setNextPage(false)
			console.log(e);
			
		  }
		}
		fetchData();
	  }, [currentPage]);
	
	  function onClickNext() {
		setCurrentPage(currentPage + 1);
	  }
	
	  function onClickPrev() {
		setCurrentPage(currentPage - 1);
	  }

	const searchValue = async (value) => {
		setSearchTerm(value);
	};
	const buildCard = (series) => {
		return (
            // <h1>heer</h1>
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={series.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/series/${series.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={series.thumbnail && series.thumbnail.path ? series.thumbnail.path + '.'+ series.thumbnail.extension : noImage}
								title='show image'
							/>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h2'>
									{series.title}
								</Typography>
								
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};
    // if (searchTerm) {
	// 	if(searchData)
	// 	{
	// 	  card =searchData.map((show) => {
	// 		  return buildCard(show);
	// 	  });
	// 	}
	
	// }
	if (searchTerm) {
        if(searchData)
		{
		  card =searchData.map((show) => {
			  return buildCard(show);
		  });
		}
        // console.log('searchData:',searchData)
		// card =
		// 	searchData &&
		// 	searchData.map((characters) => {
		// 		let { character } = characters;
		// 		return buildCard(character);
		// 	});
	} else {
		card =
			charData &&
			charData.map((characters) => {
				return buildCard(characters);
			});
	}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
        if (error){
            return (
                <NotFound/>
            );
        }else if(badInput){
            return(
                <BadIP />
            )
        }
        else{
            return (
                <div>
                    <SearchCharacters searchValue={searchValue} />
                    <br />
                    <br />
                    {(currentPage === 0) ? "": 
                <Link className="showlink" to={`/series/page/${Number(currentPage )- 1}`} onClick={onClickPrev}>
                  Previous
                </Link>}
          
            {(nextPage !== true) ? "" : 
                <Link className="showlink" to={`/series/page/${Number(currentPage) + 1}`} onClick={onClickNext}>
                  Next
                </Link>}
                     <br></br>
     <br></br>
                    <Grid container className={classes.grid} spacing={5}>
                        {card}
                    </Grid>
                </div>
            );
        }
		
	}
};

export default SeriesList;

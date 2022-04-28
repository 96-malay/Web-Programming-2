import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link ,useParams} from 'react-router-dom';
import SearchShows from './SearchShows';
import noImage from '../img/download.jpeg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles } from '@material-ui/core';

import '../App.css';
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
const ShowList = (props) => {
	// let {pagenumber} = useParams();
	let pagenumber = props.match.params.pagenum
	const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
	const [ loading, setLoading ] = useState(true);
	const [ searchData, setSearchData ] = useState(undefined);
	const [ showsData, setShowsData ] = useState(undefined);
	const [ searchTerm, setSearchTerm ] = useState('');
	const [currentPage, setCurrentPage] = useState(Number(pagenumber)); // how to get this value?
  	const [nextPage, setNextPage] = useState(false);

	let card = null;
 
	useEffect(() => {
		console.log('on load useeffect');
		async function fetchData() {
			try {
				const { data } = await axios.get('http://api.tvmaze.com/shows');
				setShowsData(data);
				setLoading(false);
			} catch (e) {
				console.log(e);
			}
		}
		fetchData();
	}, []);

	useEffect(
		() => {
			console.log('search useEffect fired');
			async function fetchData() {
				try {
					console.log(`in fetch searchTerm: ${searchTerm}`);
					const { data } = await axios.get('http://api.tvmaze.com/search/shows?q=' + searchTerm);
					setSearchData(data);
					setLoading(false);
				} catch (e) {
					console.log(e);
				}
			}
			if (searchTerm) {
				console.log ('searchTerm is set')
				fetchData();
			}
		},
		[ searchTerm ]
	);

	useEffect(() => {
		console.log('pagination useEffect fired');
		async function fetchData() {
		  try {
			//console.log("current page" + currentPage);
			// how to control buttons
			const { data } = await axios.get('http://api.tvmaze.com/shows?page=' + Number(currentPage));
			setShowsData(data);
			setLoading(false);
	
			const { data: nextPageData } = await axios.get('http://api.tvmaze.com/shows?page=' + (Number(currentPage) + 1));
			console.log(nextPageData);
			if(nextPageData){
			  setNextPage(true)
			}
			
	
		  } catch (e) {
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
	const buildCard = (show) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={show.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/shows/${show.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={show.image && show.image.original ? show.image.original : noImage}
								title='show image'
							/>

							<CardContent>
								<Typography className={classes.titleHead} gutterBottom variant='h6' component='h3'>
									{show.name}
								</Typography>
								<Typography variant='body2' color='textSecondary' component='p'>
									{show.summary ? show.summary.replace(regex, '').substring(0, 139) + '...' : 'No Summary'}
									<span>More Info</span>
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

	if (searchTerm) {
		card =
			searchData &&
			searchData.map((shows) => {
				let { show } = shows;
				return buildCard(show);
			});
	} else {
		card =
			showsData &&
			showsData.map((show) => {
				return buildCard(show);
			});
	}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
		return (
			<div>
				<SearchShows searchValue={searchValue} />
				<br />
				<br />
				{(currentPage === 0) ? "": 
            <Link className="showlink" to={`/shows/page/${Number(currentPage )- 1}`} onClick={onClickPrev}>
              Previous
            </Link>}
      
        {(nextPage !== true) ? "" : 
            <Link className="showlink" to={`/shows/page/${Number(currentPage) + 1}`} onClick={onClickNext}>
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
};

export default ShowList;

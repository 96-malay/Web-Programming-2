import React, {useEffect, useState} from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import queries from '../queries'

import { Card, CardContent,Typography,CardMedia,CardHeader,makeStyles} from '@material-ui/core';

const useStyles = makeStyles({
  card: {
    maxWidth: 450,
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

// const ImageList = (props) => {
//     useEffect (()=> {
//         console.log('Pagenumber:', pageNum)
//     },[pageNum])
// }

// (async () =>{
//     let ImageList = []
// })();

function Images(){
    const classes = useStyles();
    const [pageNum, setPageNum] = useState(1)
    console.log("inside Images, page:" , pageNum)

    useEffect (()=> {
        console.log('Pagenumber:', pageNum)
        refetch()
        
    },[pageNum])

    const {data,error,loading,refetch} = useQuery(
        //Query
        queries.GET_IMAGES,
        { variables: {pageNum}},
        {fetchpolicy : 'cache-and-netword'}
    );
    const [updateImage] = useMutation(queries.ADD_REMOVE_BIN) //query

    if(data) {
        const {unsplashImages : Images } = data;

        let ImageList =(Images.map(image=>(
            <li className="imageList" key={image.id}>
            <Card className={classes.card}>
                <CardHeader
                    className={classes.titleHead}
                    title={
                        "Author Name: "+image.posterName
                    }
                />
        
                <CardMedia
                    className={classes.media}
                    component="img"
                    image={image.url}
                    title="image"
                />

                <CardContent>
                     <Typography>
                        {"Description: "+image.description} 
                    </Typography>
                </CardContent>
                
                {(image.binned === true) ? <button className="button" onClick={(e) => {
                        e.preventDefault();
                        alert("Image removied from bin");
                        
                        updateImage({
                            variables: { id: image.id, 
                                         url: image.url, 
                                         posterName: image.posterName, 
                                         description: image.description, 
                                         userPosted: image.userPosted, 
                                         binned: false }
                        })
                        refetch()
                    }}> Remove from Bin </button> 
                                        : //else block
                    <button className="button" onClick={(e) => {
                        e.preventDefault();
                        alert("Image added into Bin");
                        
                        updateImage({
                            variables: { id: image.id, 
                                         url: image.url, 
                                         posterName: image.posterName, 
                                         description: image.description, 
                                         userPosted: image.userPosted, 
                                         binned: true }
                        })
                        refetch()
                    }}> Add to Bin </button>}
            </Card>
            <br/>
            <br/>
            </li>
        )));
        return <div>
            
            <div>{ImageList}</div>
            {/* <button className='button' onClick={( )=> setPageNum(pageNum +1)}>Get More</button> */}
            {(pageNum === 1) ? "": 
                <button className='button' onClick={( )=> setPageNum(pageNum -1)}>Get Previous</button>}
          
            {(pageNum >= 1) ? 
                <button className='button' onClick={( )=> setPageNum(pageNum + 1)}>Get More</button> : ""}    
        </div>
    } else if (loading) {
        return <div>Loading...</div>;
    } else if (error) {
        return <div>{ error.message }</div>;
    }
};

export default Images
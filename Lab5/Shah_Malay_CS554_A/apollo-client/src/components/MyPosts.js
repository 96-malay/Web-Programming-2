import React from 'react'
import {useQuery, useMutation} from '@apollo/react-hooks'
import queries from '../queries'
import {Link} from 'react-router-dom'
import { Card, CardContent,Typography,CardMedia,CardHeader,makeStyles} from '@material-ui/core'

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
})

function MyPosts() {
    const classes = useStyles()
    const {data,error,loading, refetch} = useQuery(
        queries.GET_USER_POSTED_IMAGES,
        {fetchPolicy:"cache-and-network"}
    )
    const [updateImage] = useMutation(queries.ADD_REMOVE_BIN)
    const [deleteImage] = useMutation(queries.DELETE_USER_POST)
   
    if (data) {
        const {userPostedImages: Images} = data
        console.log('Inside User posted images & data is not null')
        console.log(Images)
        let ImageList = (Images.map(i => (
            <li className="imageList" key = {i.id}>
                <Card className={classes.card}>
                    <CardHeader className={classes.titleHead}
                                title={"Image Posted by: "+i.posterName}/>
                    <CardMedia className={classes.media}
                                component="img"
                                image={i.url}
                                title="image"/>
                    <CardContent>
                        <Typography>
                            {"Image Description "+i.description}
                        </Typography>
                    </CardContent>

                    {/* <button className='button' onClick={(e) => {
                        e.preventDefault() //Stop reloading of page
                        alert("Image Added to Bin")
                        window.location.reload();
                        updateImage({
                            variables: {
                                id:i.id,
                                url:i.url,
                                posterName : i.posterName,
                                description: i.description,
                                userPosted: i.userPosted,
                                binned: true //To mark deleted from bin
                            }
                        })
                        // refetch()
                    }}>Add to bin</button> */}

                    
                    {(i.binned === true) ? <button className="button" onClick={(e) => {
                        e.preventDefault();
                        alert("Image removied from bin");
                        
                        updateImage({
                            variables: { id: i.id, 
                                         url: i.url, 
                                         posterName: i.posterName, 
                                         description: i.description, 
                                         userPosted: i.userPosted, 
                                         binned: false }
                        })
                        refetch()
                    }}> Remove from Bin </button> 
                                        : //else block
                    <button className="button" onClick={(e) => {
                        e.preventDefault();
                        alert("Image added into Bin");
                        
                        updateImage({
                            variables: { id: i.id, 
                                         url: i.url, 
                                         posterName: i.posterName, 
                                         description: i.description, 
                                         userPosted: i.userPosted, 
                                         binned: true }
                        })
                        refetch()
                    }}> Add to Bin </button>}
                  
                    <br/>
                    <br/>
                    <button className='button' onClick={(e) => {
                        e.preventDefault()
                        alert("Post Deleted")
                        window.location.reload();
                        // refetch()
                        deleteImage({
                            variables: {id: i.id}
                        })
                        updateImage({
                            variables: { id: i.id, 
                                         url: i.url, 
                                         posterName: i.posterName, 
                                         description: i.description, 
                                         userPosted: i.userPosted, 
                                         binned: false }
                        })
                        
                    }}>Delete Post</button>

                </Card>
            </li>
        )))
        return<div> 
            <Link to="/new-post">Create New Post</Link>
            {ImageList}
            </div> //Render all the binned images in cards
    }else if (loading) {
        return <div>Loading...</div>
   } else if (error) {
       return <div>{ error.message }</div>;
   }
}

export default MyPosts

// import React from 'react';
// import { useQuery, useMutation } from '@apollo/react-hooks';
// import queries from '../queries'
// import { Link } from 'react-router-dom';

// import {
//   Card,
//   CardContent,
//   Typography,
//   CardMedia,
//   CardHeader,
//   makeStyles
// } from '@material-ui/core';

// const useStyles = makeStyles({
//   card: {
//     maxWidth: 450,
//     height: 'auto',
//     marginLeft: 'auto',
//     marginRight: 'auto',
//     borderRadius: 5,
//     border: '1px solid #1e8678',
//     boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);'
//   },
//   titleHead: {
//     borderBottom: '1px solid #1e8678',
//     fontWeight: 'bold'
//   },
//   grid: {
//     flexGrow: 1,
//     flexDirection: 'row'
//   },
//   media: {
//     height: '100%',
//     width: '100%'
//   },
//   button: {
//     color: '#1e8678',
//     fontWeight: 'bold',
//     fontSize: 12
//   }
// });

// function MyPosts() {

//     const classes = useStyles();
//     const { data,error,loading } = useQuery(
//         queries.GET_USER_POSTED_IMAGES,
//         {
//             fetchPolicy: 'cache-and-network'
//         }
//     );

//     // //const [updateImage] = useMutation(queries.REMOVE_FROM_BIN);
//     const [deleteIamge] = useMutation(queries.DELETE_USER_POST);


//     if (data) {
//         const { userPostedImages: Images } = data;
//         console.log("User posted images");
//         console.log(Images);
//         let ImageList =(Images.map(image=>(
//                 <li className="imageList" key={image.id}>
//                 <Card className={classes.card}>
//                     <CardHeader
//                         className={classes.titleHead}
//                         title={
//                             "Image Posted by: "+image.posterName
//                         }
//                     />
            
//                     <CardMedia
//                         className={classes.media}
//                         component="img"
//                         image={image.url}
//                         title="image"
//                     />

//                     <CardContent>
//                          <Typography>
//                             {"Image Description: "+image.description} 
//                         </Typography>
//                     </CardContent>
                    

//                     <button className="button" onClick={(e) => {
//                         e.preventDefault();
//                         alert("Deleted");
//                         window.location.reload();
//                         deleteIamge({
//                             variables: { id: image.id }
//                         })
//                     }}> Delete Post</button>

//                 </Card>
//                 </li>
//         )));
//       return <div>
//             <Link to="/new-post">Add New Post</Link>
//             {ImageList}
//         </div>
//     } else if (loading) {
//          return <div>Loading...</div>
//     } else if (error) {
//         return <div>{ error.message }</div>;
//     }
   
// }

// export default MyPosts

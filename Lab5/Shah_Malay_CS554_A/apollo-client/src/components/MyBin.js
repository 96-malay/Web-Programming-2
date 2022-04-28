import React from 'react'
import {useQuery, useMutation} from '@apollo/react-hooks'
import queries from '../queries'

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
});

function MyBin() {
    const classes = useStyles()
    const {data,error,loading,refetch} = useQuery(
        queries.GET_BINNED_IMAGES, {fetchPolicy:"cache-and-network"}
    )
    const [updateImage] = useMutation(
        queries.ADD_REMOVE_BIN,
    )

    if (data) {
        const {binnedImages: Images} = data
        console.log('Inside MyBin & data is not null')
        console.log(data)
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

                    <button className='button' onClick={(e) => {
                        e.preventDefault() //Stop reloading of page
                        alert("Image removed from Bin")
                        window.location.reload();
                        updateImage({
                            variables: {
                                id:i.id,
                                url:i.url,
                                posterName : i.posterName,
                                description: i.description,
                                userPosted: i.userPosted,
                                binned: false //To mark deleted from bin
                            }
                        })
                        // refetch()
                    }}>Remove from bin</button>
                </Card>
            </li>
        )))
        return<div> {ImageList}</div> //Render all the binned images in cards
    }
    else if (loading){
        return <div>Loading...</div>
    }
    else if (error) {
        return <div>{"Error:"+error.message}</div>
    }

}

export default MyBin

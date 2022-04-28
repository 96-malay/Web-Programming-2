import React from 'react'
import {useQuery, useMutation} from '@apollo/react-hooks'
import queries from '../queries'

function NewPost() {
    const [uploadImage] = useMutation(queries.UPLOAD_NEW_POST)
    let url = ''
    let description = ''
    let posterName = ''
    //Design form to create new post
    return(
        <div>
            <form onSubmit={ (e) => {
                e.preventDefault()
                uploadImage({
                    variables: {
                        url: url.value,
                        description: description.value,
                        posterName: posterName.value
                    }
                })
                alert("New Post Created")
                url.value = ''
                description.value = ''
                posterName.value=''
            }}>
            <div className='form-group'>
                <label>
                    Url: 
                    <input ref={node => {url = node}}
                    required
                    autoFocus={true}/>
                </label>
            </div>
            <br/>
            <div className='form-group'>
                <label>
                    Description: 
                    <input ref={node => {description = node}}
                    required
                    />
                </label>
            </div>
            <br/>
            <div className='form-group'>
                <label>
                    Poster Name: 
                    <input ref={node => {posterName = node}}
                    required
                    />
                </label>
            </div>
            <br/>
            <button className='button' type='submit'>Create New Post</button>


            </form>
        </div>
    )
}

export default NewPost
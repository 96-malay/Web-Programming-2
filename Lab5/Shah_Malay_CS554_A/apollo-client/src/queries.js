import {gql} from '@apollo/client';

const GET_IMAGES = gql `

    query unsplashImages($pageNum: Int) {
        unsplashImages(pageNum : $pageNum){
            id
            url
            posterName
            description
            userPosted
            binned
        }
}`;

const ADD_REMOVE_BIN = gql`

    mutation updateImage($id: ID!, $url: String, $posterName: String, $description: String, $userPosted: Boolean, $binned: Boolean) {
        updateImage(id: $id, url: $url, posterName: $posterName, description: $description, userPosted: $userPosted, binned: $binned) {
            id
            url
            posterName
            description
            userPosted
            binned
    }
}
`;

const GET_BINNED_IMAGES = gql`
    query binnedImages {
        binnedImages {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;



const UPLOAD_NEW_POST = gql`

    mutation uploadImage($url: String!, $description: String!, $posterName: String!) {
        uploadImage(url: $url, description: $description, posterName: $posterName) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

const GET_USER_POSTED_IMAGES = gql`

    query userPostedImages {
        userPostedImages {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;


const DELETE_USER_POST = gql`

    mutation deleteImage($id: ID!) {
        deleteImage(id: $id) {
            id
            url
            posterName
            description
            userPosted
            binned
        }
    }
`;

export default {
    GET_IMAGES,
    ADD_REMOVE_BIN,
    GET_BINNED_IMAGES,
    UPLOAD_NEW_POST,
    GET_USER_POSTED_IMAGES,
    DELETE_USER_POST
};
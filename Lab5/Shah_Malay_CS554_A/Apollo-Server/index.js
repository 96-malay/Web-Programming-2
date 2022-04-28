const { ApolloServer, gql } = require('apollo-server');
const uuid  = require('uuid');
const axios = require('axios');
const redis = require('redis');
const redisClient = redis.createClient();


const UNSPLASH_API_ACCESS_KEY = "hweTc-q9oHzdWWUlW4UdBpTR0szLI9_oE4KssQkkFxY";
(async () =>{
    await redisClient.connect();
})();

redisClient.on("error", function (e) {
    console.log("Error message: " + e);
});

const typeDefs = gql`

 type ImagePost {
    id : ID!
    url : String!
    posterName : String!
    description : String
    userPosted : Boolean!
    binned : Boolean!
  }

  type Query {
      unsplashImages(pageNum: Int): [ImagePost]
      binnedImages : [ImagePost]
      userPostedImages : [ImagePost]
  }

  type Mutation {
    uploadImage(url: String!, description: String, posterName: String) : ImagePost
    updateImage(id: ID!, url: String, posterName: String, description: String, userPosted: Boolean, binned: Boolean) : ImagePost
    deleteImage(id: ID!) : ImagePost
  }

`;

async function getUnsplashImages(pageNum) {
  console.log("Page Number:" + pageNum);
  let { data } = await axios.get(`https://api.unsplash.com/photos?page=${pageNum}&client_id=${UNSPLASH_API_ACCESS_KEY}`);
//   console.log(data);
  let description;
  let images = []
  for (i = 0; i < data.length; i++){

    // Correct description
    if (data[i].description === null) {
      if (data[i].alt_description === null) {
        description = 'NA';
      } else {
        description = data[i].alt_description;
      }
    } else {
      description = data[i].description;
    }
    let image = {
      id: data[i].id,
      url: data[i].urls.raw,
      posterName: data[i].user.name,
      description: description, 
      userPosted: false,
      binned: false
    };
    images.push(image);
  }
  
  return images;
}

async function getBinnedImages() {

  let images = [];
  let imageIdList = await redisClient.lRange("ImageList", 0, -1);
  for (let i = 0; i < imageIdList.length; i++){
    let image = await redisClient.hGet('imageSet',imageIdList[i]);
    images.push(JSON.parse(image));
    console.log(images);
  }
  return images;
}

async function getBinStatus(id){
    let image = await redisClient.hGet('imageSet',id)
    console.log('bin', JSON.parse(image))
    image = JSON.parse(image)
    if (image !== null) {
        console.log('Binned:',image.binned, image.posterName, image.userPosted)
        return image.binned
    }else{
        return false
    }
    
}

async function getUserPostedImages() {
  let images = [];
  let imageIdList = await redisClient.lRange("userImageList", 0, -1);
  for (let i = 0; i < imageIdList.length; i++){
    let image = await redisClient.hGet('userImageSet',imageIdList[i]);
    images.push(JSON.parse(image));
    console.log(images);
  }

  return images; 
}

async function uploadImage(url, description, posterName) {

  console.log("uploadImages");
  console.log(url, description, posterName);
  
  let image = {
    id: uuid.v4(),
    url: url,
    posterName: posterName,
    description: description,
    userPosted: true,
    binned: false
  };

  await redisClient.hSet('userImageSet', image.id, JSON.stringify(image));
  await redisClient.lPush('userImageList', image.id);
  return image
}

async function updateImage(id, url, posterName, description, userPosted, binned) {
  console.log(id, url, posterName, description, userPosted, binned);
  let imageUpdated = {
    id: id,
    url: url,
    posterName: posterName,
    description: description,
    userPosted: userPosted,
    binned: binned
  };
  if (binned){
    console.log("Adding/Updating");
        await redisClient.hSet('imageSet', imageUpdated.id, JSON.stringify(imageUpdated));
        await redisClient.lPush('ImageList', imageUpdated.id);
  }else{
    console.log("Removing");
        await redisClient.hDel('imageSet', imageUpdated.id);
        await redisClient.lRem('ImageList', 0, imageUpdated.id);
  }

}

async function deleteImage(id) {
    let image = await redisClient.hGet('userImageSet',id);
    if (! image){
        console.log('Invalid ID')
        // return image
    }
    else{
        await redisClient.hDel('userImageSet', id);
        await redisClient.lRem('userImageList', 0, id);
        return JSON.parse(image)
    }
    
}

const resolvers = {
  Query: {
    unsplashImages: async(_, args) => await getUnsplashImages(args.pageNum),
    binnedImages: async () => await getBinnedImages(),
    userPostedImages: async () => await getUserPostedImages()
  },
  ImagePost : {
    binned : async (parentValue) => {
        let resl = await getBinStatus(parentValue.id)
        console.log('resl',resl)
     return  resl
    }
    },
  Mutation: {
    uploadImage: async (_, args) => await uploadImage(args.url, args.description, args.posterName),
    deleteImage: async (_, args) => await deleteImage(args.id),
    updateImage: async (_, args) =>  await updateImage(args.id, args.url, args.posterName, args.description, args.userPosted, args.binned)
  },
  
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}🚀 `);
});
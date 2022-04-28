const {ApolloServer, gql} = require('apollo-server');
const lodash = require('lodash') 
const axios = require('axios')
const typeDefs = gql `
    type Query {
        ImagePost : [ImagePost]
    }
    type ImagePost {
        id: ID!
        url: String
        posterName: String
        description: String
        userPosted: Boolean
        binned: Boolean!
    }
`
const url = "https://api.unsplash.com/photos/?client_id=hweTc-q9oHzdWWUlW4UdBpTR0szLI9_oE4KssQkkFxY"
// async function getImages() {
//     let data = await axios.get(url)
//     if (data.length !== 0){
//         console.log(data)
//     }
// }

const resolvers = {
    Query: {
        ImagePost: async(_,args) => {
            try {
                const {data} = await axios.get(url)
                result = []
                tmpdata={}
            if (data.length !== 0){
                console.log(data)
                for (let i in data){
                    // tmpdata.id = i.id
                    // tmpdata.url = i.urls.raw
                    // tmpdata.posterName = i.user.name
                    // tmpdata.description = i.description
                    let tmpdata = {
                        id = i.id,
                        url = i.urls.raw,
                        posterName = i.user.name,
                        description = i.description
                    }
                }
            // }
            return data
            } catch (error) {
                console.log(error.message)
            }
            
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
  console.log(`🚀  Server ready at ${url} 🚀`);
});
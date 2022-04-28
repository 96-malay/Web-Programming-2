const { ApolloServer, gql } = require('apollo-server')
const axios = require ('axios')
const redis = require('redis');
const redisClient = redis.createClient();

const pokemonBaseUrl = 'https://pokeapi.co/api/v2/pokemon/';

(async () =>{
    await redisClient.connect();
})();

const typeDefs = gql `

    type Pokemon{
        id: ID!
        name: String!
        url: String!
        types: [String]!
        base_experience: Int
        height : Int
        weight : Int
        order : Int

    },
    type PokemonList{
        id: Int!
        name: String!
        url: String!
    }

    type Query{
        pokemonsList(pagenum: Int): [PokemonList]
        singlePokemon(id: Int): Pokemon
        searchPokemon(name: String): Pokemon
    }


`
async function getAllPokemons(pagenum) {
    //Call pokemon API
    // let dummyData = [{
    //     name: "bulbasaur",
    //     url: "https://pokeapi.co/api/v2/pokemon/1/"
    // }]
    // return dummyData

    // https://pokeapi.co/api/v2/pokemon?offset=50&limit=50

    let idf = 'PokemonList' + pagenum //To differentiate page number and pokemon id
    try {
        let pokemonCache = await redisClient.exists(idf);
        if (pokemonCache) {
            let pokemonPageData = await redisClient.get(idf);
            return JSON.parse(pokemonPageData)
        } else {
            const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${pagenum * 50}&limit=50`);
            let mData = data.results
            if (mData.length === 0) {
                return { error: "The requested resource is not found." }
            } else {
                outputData= []
                for (let i = 0; i< mData.length; i++){
                    if (mData[i].url){
                        const {data} = await axios.get(mData[i].url)
                        outputData.push({
                            id: data.id,
                            name: data.name,
                            url : data.sprites.other['official-artwork'].front_default
                        })
                    }
                }
                await redisClient.set(idf, JSON.stringify(outputData));
                return outputData
            }            
        }
        } catch (e) {
            return { error: e || 'Error'}
        }

        // Without redis-----
    // const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${pagenum * 50}&limit=50`);
    // let mData = data.results
    // if (mData.length === 0) {
    //     return { error: "The requested resource is not found." }
    // } else {
    //     // const { data } = await axios.get("https://pokeapi.co/api/v2/pokemon/51/")
    //     // console.log(data)
    //     try {
    //         //save the data in redis here
    //         outputData= []
    //         for (let i = 0; i< mData.length; i++){
    //             if (mData[i].url){
    //                 const {data} = await axios.get(mData[i].url)
    //                 outputData.push({
    //                     id: data.id,
    //                     name: data.name,
    //                     url : data.sprites.other['official-artwork'].front_default
    //                 })
    //             }
    //         }
    //     } catch (error) {
    //         console.log(error.message)
    //     }
        
    // }
    // console.log(outputData)
    // return outputData
    // Without redis-----

    
}
async function getSinglePokemon(id) {
    //Call pokemon API
    // let dummyData = {
    //     name: "bulbasaur",
    //     url: "https://pokeapi.co/api/v2/pokemon/1/",
    //     id: 1,
    //     name: "Bakasur",
    //     base_experience: 999,
    //     height : 6,
    //     weight : 100,
    //     order : 90
    // }
    // return dummyData

    // //save pokemon in redis here
    let idf = 'Pokemon' + id //To differentiate page number and pokemon id
    console.log(idf)
    try{
        let pokemonCache = await redisClient.exists(idf);
        console.log('pokemonCache',pokemonCache)
        if (pokemonCache) {
            let pokePageData = await redisClient.get(idf);
            return JSON.parse(pokePageData)
        }else{
            const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
            let type = []
            for (let i of data.types){
                console.log(i)
                type.push(i.type.name)
            }
            let output = {
                id: data.id,
                name:data.name,
                url : data.sprites.other['official-artwork'].front_default, //image url
                types: type

            }
            await redisClient.set(idf, JSON.stringify(output));
            return output
        }
    }catch(e){
        return { error: e || 'Error'}
    }

    // Without redis----
    // const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}/`)
    // let type = []
    // for (let i of data.types){
    //     console.log(i)
    //     type.push(i.type.name)
    // }
    // let output = {
    //     id: data.id,
    //     name:data.name,
    //     url : data.sprites.other['official-artwork'].front_default, //image url
    //     types: type

    // }
    // return output
    // Without redis----
}
async function getSearchPokemon(name){
    const { data } = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}/`)
    let type = []
    for (let i of data.types){
        console.log(i)
        type.push(i.type.name)
    }
    let output = {
        id: data.id,
        name:data.name,
        url : data.sprites.other['official-artwork'].front_default, //image url
        types: type

    }
    return output
}

const resolvers = {
    Query: {
        pokemonsList: async(_,args) => await getAllPokemons(args.pagenum || 0),
        singlePokemon: async(_,args) => await getSinglePokemon(args.id),
        searchPokemon: async(_,args) => await getSearchPokemon(args.name)
    }
    // Mutation ?
}

const server = new ApolloServer({typeDefs,resolvers})

server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}🚀 `)
})
import {gql} from '@apollo/client';

const GET_POKEMON_LIST = gql`
query PokemonsList($pagenum: Int) {
    pokemonsList(pagenum: $pagenum) {
      id
      name
      url
    }
  }

`
const GET_SINGLE_POKEMON = gql `
query SinglePokemon($id: Int) {
    singlePokemon(id: $id) {
      id
      name
      url
      types
    }
  }
`
const GET_SEARCH_POKEMON = gql `
query Query($name: String) {
    searchPokemon(name: $name) {
      id
      url
      name
      types
    }
  }

`

export default  {
    GET_POKEMON_LIST,
    GET_SINGLE_POKEMON,
    GET_SEARCH_POKEMON
}
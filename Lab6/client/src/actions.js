const addTrainer = (name) => ({
    type: 'CREATE_TRAINER',
    payload: {
      name : name
    }
  }
  )
  
  const deleteTrainer = (id) => ({
    type: 'DELETE_TRAINER',
    payload: {
     id: id
    }
  }
  )
  
  const selectTrainer = (id) => ({
    type: 'SELECT_TRAINER',
    payload: {
     id: id
    }
  }
  )
  
  const releasePokemon = (trainerId, pokeId) => ({
    type: 'RELEASE_POKEMON',
    payload: {
      trainerId: trainerId,
      pokeId: pokeId
    }
  }
  )
  
  const catchPokemon = (trainerId, pokeData) => ({
    type: 'CATCH_POKEMON',
    payload: {
      trainerId: trainerId,
      pokeData: pokeData
    }
  }
  )
  
  module.exports = {
      addTrainer,
      deleteTrainer,
      catchPokemon,
      releasePokemon,
      selectTrainer
  }
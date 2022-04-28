import { v4 as uuid } from 'uuid';
const initalState = [
  {
    id: uuid(),
    name: "Malay",
    teams: [],
    selected: true
  }
];

let copyState = null;
let index = 0;

const trainerReducer = (state = initalState, action) => {
  const { type, payload } = action;

  switch (type) {
    case 'CREATE_TRAINER':
      return [...state,{ id: uuid(), name: payload.name, teams: [], selected: false}];
    
    case 'DELETE_TRAINER':
    copyState = [...state];
    index = copyState.findIndex((trainer) => trainer.id === payload.id);
    copyState.splice(index, 1);
    return [...copyState];

    case 'SELECT_TRAINER':
    copyState = [...state];
    copyState.map((trainer) => {
        if (trainer.id === payload.id) {
        trainer.selected = trainer.selected === true ? false : true;
        } else {
        trainer.selected = false;
        }
    });
    return [...copyState];

    case 'CATCH_POKEMON':
    copyState = [...state];
    index = copyState.findIndex((trainer) => {
    if (trainer.id === payload.trainerId) {
        trainer.teams.push({
        id: payload.pokeData.id,
        name: payload.pokeData.name,
        url: payload.pokeData.url
        })
    }});

    return [...copyState];
    
    case 'RELEASE_POKEMON':
    copyState = [...state];
    copyState.map((trainer) => {
    if (trainer.id === payload.trainerId) {
        let index = trainer.teams.findIndex((i) => i.id === payload.pokeId)
        trainer.teams.splice(index, 1);
    }
    });
    return [...copyState];
      

    default:
      return state;
  }
};

export default trainerReducer;

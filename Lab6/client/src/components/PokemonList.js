import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import NotFound from "./NotFound";
import { Link, useNavigate, useParams } from "react-router-dom";
import actions from "../actions";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  Grid,
  CardMedia,
  CardHeader,
  makeStyles,
} from "@material-ui/core";
// import '../App.css'
import searchPokemon from "./SearchPokemon";
const useStyles = makeStyles({
  card: {
    maxWidth: 450,
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "1px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    borderBottom: "1px solid #1e8678",
    fontWeight: "bold",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "100%",
    width: "100%",
  },
  button: {
    color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
});

function PokemonList(props) {
  const Navigate = useNavigate();
  const classes = useStyles();
  const [pList, setpList] = useState(undefined);
  // const [loading, setLoading] = useState(true);
  const { pagenum } = useParams();
  console.log('pagenum',pagenum)
  const [currentPage, setCurrentPage] = useState(parseInt(pagenum));
  const [errorPage, setErrorPage] = useState(false);

  const [nextPage, setNextPage] = useState(true);

  // const { data, error, refetch } = useQuery(queries.GET_POKEMON_LIST);
  const dispatch = useDispatch();
  const allTrainers = useSelector((state) => state.trainerReducer);
  let trainerId;

  allTrainers.forEach((t) => {
    if (t.selected) {
      trainerId = t.id;
    }
  });
  //Get selected trainer details...
  const selectedTrainer = allTrainers[allTrainers.findIndex((i) => i.selected)];
  const selectedTrainerTeam = selectedTrainer.teams;
  let selectedTrainerLength = selectedTrainerTeam.length;
  let card = null;
  console.log('selectedTrainerTeam',selectedTrainerTeam)
  const { data, error, loading, refetch } = useQuery(queries.GET_POKEMON_LIST, {
    variables: { pagenum: currentPage },
    onCompleted: () => {
      setCurrentPage(parseInt(currentPage));
      const { pokemonsList: pdata } = data;
      setpList(pdata);
      // console.log('pdata',pdata, pdata.length)
      // if (!pdata){
      //     setErrorPage(true)
      // }
    },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
  });

  // useEffect(() => {

  // }, [currentPage, props.match.params.pagenum]);

  function onClickNext() {
    console.log("in onclicknext",currentPage);
    setCurrentPage(currentPage + 1);
  }

  function onClickPrev() {
    console.log("in onclickprev");
    setCurrentPage(currentPage - 1);
  }

  const buildCard = (pokemon) => {
    console.log("Pokemon card", pokemon);
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.name}>
        <Card className={classes.card} variant="outlined">
          {/*  */}
          <Link to={`/pokemon/${pokemon.id}`}>
            <CardMedia
              className={classes.media}
              component="img"
              image={pokemon.url}
              title="show image"
            />

            <CardContent>{pokemon.name}</CardContent>
          </Link>
          {selectedTrainerTeam.findIndex((i) => i.id === pokemon.id) != -1 ? (
            <button
              onClick={() =>
                dispatch(actions.releasePokemon(trainerId, pokemon.id))
              }
            >
              Release
            </button>
          ) : selectedTrainerLength != 6 &&
            selectedTrainerTeam.findIndex((i) => i.id === pokemon.id) == -1 ? (
            <button
              onClick={() =>
                dispatch(
                  actions.catchPokemon(trainerId, {
                    id: pokemon.id,
                    name: pokemon.name,
                    url: pokemon.url,
                  })
                )
              }
            >
              Catch
            </button>
          ) : (
            <p>Party Full</p>
          )}
        </Card>
      </Grid>
    );
  };

  card =
    pList &&
    pList.map((pokemon) => {
      return buildCard(pokemon);
    });

  if (loading) {
    return (
      <div>
        <h1>Loading.....</h1>
      </div>
    );
  } else {
    if (errorPage) {
      return (
        <div>
          <NotFound></NotFound>
          {/* <Link className="paginationLink" to={`/`}>Go Back</Link> */}
        </div>
      );
    } else {
      //xyz
      return (
        <div>
          <br />
          {/* Search pokemon */}
          <label>
            Search Pokemons:
            <input id="name" name="name" placeholder="Pokemon name" />
          </label>
          <button
            onClick={() => {
              const pokemonName = document.getElementById("name").value;
              Navigate(`/pokemon/search/${pokemonName}`);
            }}
          >
            Search
          </button>
          <br />
          {currentPage === 0 ? (
            ""
          ) : (
            <Link
              className="paginationLink"
              to={`/pokemon/page/${currentPage - 1}`}
              onClick={onClickPrev}
            >
              Previous
            </Link>
          )}

          {nextPage === false ? (
            ""
          ) : (
            <Link
              className="paginationLink"
              to={`/pokemon/page/${currentPage + 1}`}
              onClick={onClickNext}
            >
              Next
            </Link>
          )}
          <br />
          <br />
          <Grid container className={classes.grid} spacing={5}>
            {" "}
            {card}
          </Grid>
        </div>
      );
    } //xyz
  }
}

export default PokemonList;

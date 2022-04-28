import React, { useState, useEffect } from "react";
import actions from "../actions";
import { useSelector, useDispatch } from "react-redux";
import "../App.css";
import { useQuery } from "@apollo/client";
import queries from "../queries";
import { Link, useParams } from "react-router-dom";
import noImage from "../image/no-image.jpeg";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  makeStyles,
} from "@material-ui/core";
import NotFound from "./NotFound";

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

function SinglePokemon(props) {
  const dispatch = useDispatch();
  const allTrainers = useSelector((state) => state.trainerReducer);
  const classes = useStyles();
  // const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState(undefined);
  // const [error, setError] = useState(false);
  const { name } = useParams();
  console.log("search pokemon name", name);
  let trainerId;

  allTrainers.forEach((t) => {
    if (t.selected) {
      console.log("selected trainer:", t.name);
      trainerId = t.id;
    }
  });

  const selectedTrainer = allTrainers[allTrainers.findIndex((i) => i.selected)];
  const selectedTrainerTeam = selectedTrainer.teams;
  let selectedTrainerTeamLength = selectedTrainerTeam.length;

  const { data, error, loading } = useQuery(queries.GET_SEARCH_POKEMON, {
    variables: { name: name },
    onCompleted: () => {
      // setCurrentPage(parseInt(currentPage));
      console.log("query", data);
      const { searchPokemon } = data;
      setPokemonData(searchPokemon);
      // console.log('pdata',pdata, pdata.length)
      // if (!pdata){
      //     setErrorPage(true)
      // }
    },
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
  });

  // const {singlePokemon } = data
  // setPokemonData(singlePokemon)
  console.log("pokemon data", data); //undefined

  if (error) {
    console.log(error);
    return <NotFound></NotFound>;
  } else {
    if (loading) {
      return <div>Loading....</div>;
    } else {
      const { searchPokemon } = data;
      console.log(searchPokemon);
      // setPokemonData(singlePokemon)
      return (
        <div>
          <Card className={classes.card}>
            <CardHeader
              className={classes.titleHead}
              title={searchPokemon.name}
            />
            {selectedTrainerTeam.findIndex((i) => i.id == searchPokemon.id) !=
            -1 ? (
              <button
                onClick={() =>
                  dispatch(actions.releasePokemon(trainerId, searchPokemon.id))
                }
              >
                Release
              </button>
            ) : selectedTrainerTeamLength != 6 &&
              selectedTrainerTeam.findIndex((i) => i.id == searchPokemon.id) ==
                -1 ? (
              <button
                onClick={() =>
                  dispatch(
                    actions.catchPokemon(trainerId, {
                      id: Number(searchPokemon.id),
                      name: searchPokemon.name,
                      url: searchPokemon.url,
                    })
                  )
                }
              >
                Catch
              </button>
            ) : (
              <p>Party Full</p>
            )}
            <CardMedia
              className={classes.media}
              component="img"
              image={searchPokemon.url ? searchPokemon.url : noImage}
              title={searchPokemon.name}
            />

            <CardContent>
              <dl>
                <dt>Types:</dt>
                {searchPokemon && searchPokemon.types.length !== 0 ? (
                  searchPokemon.types.map((poketype) => (
                    <dd key={poketype}>{poketype}</dd>
                  ))
                ) : (
                  <dd>N/A</dd>
                )}
              </dl>
            </CardContent>
          </Card>
        </div>
      );
    }
  }
}

export default SinglePokemon;

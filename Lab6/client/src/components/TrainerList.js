import React from "react";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions from "../actions";
import { Link } from "react-router-dom";
import "../App.css";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
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

function Trainers() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const allTrainers = useSelector((state) => state.trainerReducer);
  const [trainerData, setTrainerData] = useState(undefined);
  let card = null;

  const handleChange = (e) => {
    setTrainerData(e.target.value);
  };

  const addTrainer = () => {
    if (!trainerData || trainerData.trim() == 0) {
      return alert("Please enter an non-empty string");
    }
    dispatch(actions.addTrainer(trainerData));
    setTrainerData("");
  };

  const buildCard = (pokemon) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={pokemon.name}>
        <Card className={classes.card} variant="outlined">
          <Link to={`/pokemon/${pokemon.id}`}>
            <CardMedia
              className={classes.media}
              component="img"
              image={pokemon.url}
              title="show image"
              required
            />

            <CardContent>{pokemon.name}</CardContent>
          </Link>
        </Card>
      </Grid>
    );
  };

  return (
    <div>
      <p>Trainer's Page</p>
      <br />
      <br />
      <label>
        Trainer:
        <input
          onChange={(e) => handleChange(e)}
          value={trainerData}
          id="name"
          name="name"
          placeholder="Add Trainer"
        />
      </label>
      <button onClick={addTrainer}>Add Trainer</button>
      <div>
        {allTrainers.map((trainer) => {
          return (
            <div key={trainer.id}>
              <p>{trainer.name}</p>
              {trainer.selected === false ? (
                <div>
                  <button
                    onClick={() => dispatch(actions.selectTrainer(trainer.id))}
                  >
                    Select Trainer
                  </button>
                  <button
                    onClick={() => dispatch(actions.deleteTrainer(trainer.id))}
                  >
                    Delete Trainer
                  </button>
                </div>
              ) : (
                <button>Selected</button>
              )}

              <br />
              <br />
              <div>
                <Grid container className={classes.grid} spacing={5}>
                  {
                    (card =
                      trainer.teams &&
                      trainer.teams.map((pokemon) => {
                        return buildCard(pokemon);
                      }))
                  }
                </Grid>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Trainers;

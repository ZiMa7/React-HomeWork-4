import "./App.css";
import React, { useState } from "react";
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Provider, connect } from "react-redux";

function promiseReducer(state, { type, status, name, payload, error }) {
  if (state === undefined) {
    return {};
  }

  if (type === "PROMISE") {
    return {
      ...state,
      [name]: { status, payload, error },
    };
  }

  return state;
}

const store = createStore(promiseReducer, applyMiddleware(thunk));
store.subscribe(() => console.log(store.getState()));

const actionPending = (name) => ({ type: "PROMISE", status: "PENDING", name });
const actionFulfilled = (name, payload) => ({
  type: "PROMISE",
  status: "FULFILLED",
  name,
  payload,
});
const actionRejected = (name, error) => ({
  type: "PROMISE",
  status: "REJECTED",
  name,
  error,
});

const actionPromise = (name, promise) => async (dispatch) => {
  dispatch(actionPending(name));
  try {
    let payload = await promise;
    dispatch(actionFulfilled(name, payload));
    return payload;
  } catch (err) {
    dispatch(actionRejected(name, err));
  }
};

const urlObiWan = "https://swapi.dev/api/people/10/";
const urlFilm = "https://swapi.dev/api/films/1/";

store.dispatch(actionPromise("ObiWan", fetchData(urlObiWan)));
store.dispatch(actionPromise("Film", fetchData(urlFilm)));

const ObiWan = ({ status, payload, error }) => {
  return (
    <div className="obi_van">
      {status === "FULFILLED" ? (
        <>
          <h1 className="hero">Obi Van</h1>
          <p>
            <b>Name: </b> {payload.name}
          </p>
          <p>
            <b>Height: </b>
            {payload.height}
          </p>
          <p>
            <b>Mass: </b>
            {payload.mass}
          </p>
          <p>
            <b>Hair Color: </b>
            {payload.hair_color}
          </p>
          <p>
            <b>Scin Color: </b>
            {payload.skin_color}
          </p>
          <p>
            <b>Eye Color: </b>
            {payload.eye_color}
          </p>
          <p>
            <b>Birth year: </b> {payload.birth_year}
          </p>
          <p>
            <b>Gender: </b>
            {payload.gender}
          </p>
          <p>
            <b>Homeworld: </b>
            {payload.homeworld.name}
          </p>
          <div className="wrapper_arr">
            <div className="hero_arr">
              <h2>Films</h2>
              <ol className="films">
                {payload.films.map((film) => (
                  <li>{film.title}</li>
                ))}
              </ol>
            </div>
            <div className="hero_arr">
              <h2>Vehicles</h2>
              <ol className="vehicles">
                {payload.vehicles.map((vehicle) => (
                  <li>{vehicle.name}</li>
                ))}
              </ol>
            </div>
            <div className="hero_arr">
              <h2>Starships</h2>
              <ol className="starships">
                {payload.starships.map((starship) => (
                  <li>{starship.name}</li>
                ))}
              </ol>
            </div>
          </div>
        </>
      ) : (
        "Loading..."
      )}
      {status === "REJECTED" && (
        <>
          <strong>ERROR</strong>: {error}
        </>
      )}
    </div>
  );
};

const Film = ({ status, payload, error }) => {
  return (
    <div className="film_four">
      {status === "FULFILLED" ? (
        <>
          <h1 className="episode">Episode</h1>
          <p>
            <b>Title: </b> {payload.title}
          </p>
          <p>
            <b>Episode Id: </b> {payload.episode_id}
          </p>
          <p>
            <b>Opening crawl: </b> {payload.opening_crawl}
          </p>
          <p>
            <b>Director: </b> {payload.director}
          </p>
          <p>
            <b>Producer: </b> {payload.producer}
          </p>
          <p>
            <b>Release data: </b> {payload.release_date}
          </p>
          <p>
            <b>Director: </b> {payload.director}
          </p>
          <div className="wrapper_arr">
            <div className="episode_arr">
              <h2>Characters</h2>
              <ol className="characters">
                {payload.characters.map((character) => (
                  <li>{character.name}</li>
                ))}
              </ol>
            </div>
            <div className="episode_arr">
              <h2>Planets</h2>
              <ol className="planets">
                {payload.planets.map((planet) => (
                  <li>{planet.name}</li>
                ))}
              </ol>
            </div>
            <div className="episode_arr">
              <h2>Starships</h2>
              <ol className="starships">
                {payload.starships.map((starship) => (
                  <li>{starship.name}</li>
                ))}
              </ol>
            </div>
            <div className="episode_arr">
              <h2>Vehicles</h2>
              <ol className="vehicles">
                {payload.vehicles.map((vehicle) => (
                  <li>{vehicle.name}</li>
                ))}
              </ol>
            </div>
            <div className="episode_arr">
              <h2>Species</h2>
              <ol className="species">
                {payload.species.map((specie) => (
                  <li>{specie.name}</li>
                ))}
              </ol>
            </div>
          </div>
        </>
      ) : (
        "Loading..."
      )}
      {status === "REJECTED" && (
        <>
          <strong>ERROR</strong>: {error}
          <br />
        </>
      )}
    </div>
  );
};
async function fetchData(url) {
  const data = await fetch(url);
  const dataJSON = await data.json();
  const resultJSON = {};
  const urlRegex =
    /^((http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)?/;
  for (const objectItem of Object.entries(dataJSON)) {
    if (!Array.isArray(objectItem[1])) {
      if (
        objectItem[1] != url &&
        objectItem[1].toString().match(urlRegex) !== null
      ) {
        const resUrl = await fetch(objectItem[1]);
        resultJSON[objectItem[0]] = await resUrl.json();
      } else {
        resultJSON[objectItem[0]] = objectItem[1];
      }
    } else {
      const requests = objectItem[1].map(async (url) => {
        if (url.match(urlRegex) !== null) {
          const res = await fetch(url);
          return res;
        } else {
          return url;
        }
      });
      const responses = await Promise.all(requests);
      const json = await Promise.all(responses.map((result) => result.json()));
      resultJSON[objectItem[0]] = json;
    }
  }

  return resultJSON;
}

const CObiWan = connect((state) => state.ObiWan || {})(ObiWan);
const CFilm = connect((state) => state.Film || {})(Film);

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <div className="wrapper">
          {" "}
          <CObiWan />
          <CFilm />
        </div>
      </div>
    </Provider>
  );
}

export default App;

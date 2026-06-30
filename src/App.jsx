import { useState, useEffect } from "react";
import { shuffleCards } from "./utils/shuffle";
import "./App.css";

function App() {
  const [cards, setCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [clickedCards, setClickedCards] = useState([]);

  async function fetchPokemon() {
    try {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=12",
      );
      const data = await response.json();

      const pokemonDetails = data.results.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        const details = await response.json();

        return {
          id: details.id,
          name: details.name,
          image: details.sprites.front_default,
        };
      });

      const cardsData = await Promise.all(pokemonDetails);
      setCards(shuffleCards(cardsData));
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
  }

  function handleCardClick(id) {
    if (clickedCards.includes(id)) {
      alert("Game Over!");

      setScore(0);
      setClickedCards([]);
      setCards((prevCards) => shuffleCards(prevCards));

      return;
    }

    const newScore = score + 1;

    setScore(newScore);

    if (newScore > bestScore) {
      setBestScore(newScore);
    }

    setClickedCards((prev) => [...prev, id]);

    if (newScore === cards.length) {
      alert("🎉 You Win!");

      setScore(0);
      setClickedCards([]);
    }

    setCards((prevCards) => shuffleCards(prevCards));
  }

  useEffect(() => {
    fetchPokemon();
  }, []);

  return (
    <div className="app">
      <h1>Memory Card Game</h1>

      <div className="scoreboard">
        <h2>Score: {score}</h2>
        <h2>Best Score: {bestScore}</h2>
      </div>

      <div className="card-grid">
        {cards.map((card) => (
          <div
            key={card.id}
            className="card"
            onClick={() => handleCardClick(card.id)}
          >
            <img src={card.image} alt={card.name} />

            <h3>{card.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

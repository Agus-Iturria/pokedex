const pageUrl = "https://pokeapi.co/api/v2/pokemon?offset=";
const pokemonCardsContainer = document.getElementById("pokemon-cards");
const pageNumSpan = document.getElementById("page-num");
let currentPage = 1;
const limit = 25;

async function fetchPokemons(page) {
  try {
    const response = await fetch(
      pageUrl + `${(page - 1) * limit}&limit=${limit}`
    );
    if (response.ok) {
      const data = await response.json();
      displayPokemons(data.results);
    } else {
      console.log("Error:", response.status);
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

async function getPokemonDetails(pokemonUrl) {
  try {
    const response = await fetch(pokemonUrl);
    if (response.ok) {
      return await response.json();
    } else {
      console.log("Error:", response.status);
      return null;
    }
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}

async function displayPokemons(pokemonList) {
  pokemonCardsContainer.innerHTML = "";
  for (const pokemon of pokemonList) {
    const pokemonDetails = await getPokemonDetails(pokemon.url);
    if (pokemonDetails) {
      const sprite = pokemonDetails.sprites.front_default;
      const types = pokemonDetails.types.map((typeInfo) => typeInfo.type.name).join(" - ");
      const card = `
                <div class="pokemon-card">
                    <h3>${pokemon.name[0].toUpperCase() + pokemon.name.slice(1)}</h3>
                    <img src="${sprite}">
                    <p>${types}</p>
                </div>`;
      pokemonCardsContainer.innerHTML += card;
    }
  }
}

async function searchPokemon() {
  const searchInputElement = document.getElementById("search-input");
  const searchInput = searchInputElement.value.toLowerCase().trim();
  searchInputElement.value = "";
  if (searchInput === "") {
    fetchPokemons(currentPage);
    return;
  }
  const pokemonCards = document.querySelectorAll(".pokemon-card");
  pokemonCardsContainer.innerHTML = "";
  for (const card of pokemonCards) {
    const pokemonName = card.querySelector("h3").textContent.toLowerCase();
    const pokemonSprite = card.querySelector("img").src;
    const pokemonTypes = card.querySelector("p").textContent;

    if (pokemonName.includes(searchInput)) {
      const newCard = `
          <div class="pokemon-card">
            <img src="${pokemonSprite}">
            <h3>${pokemonName}</h3>
            <p>${pokemonTypes}</p>
          </div>
        `;
      pokemonCardsContainer.innerHTML += newCard;
    }
  }
}

function nextPage() {
  currentPage++;
  fetchPokemons(currentPage);
  pageNumSpan.textContent = currentPage;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchPokemons(currentPage);
    pageNumSpan.textContent = currentPage;
  }
}

fetchPokemons(currentPage);

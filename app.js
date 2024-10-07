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
  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value.toLowerCase();

  if (searchValue) {
      try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchValue}`);
          if (response.ok) {
              const pokemon = await response.json();
              displaySinglePokemon(pokemon);
          } else if (response.status === 404) {
              pokemonCardsContainer.innerHTML = `
                  <div class="error-message">
                      <h2>¡Oh no!</h2>
                      <p>No pudimos encontrar el Pokémon "${searchValue}"</p>
                  </div>
              `;
          } 
      } catch (error) {
          console.log('Error al buscar el Pokemon:', error);
      }
  } else {
      fetchPokemons(currentPage);
  }
  searchInput.value = '';
}

function displaySearchPokemon(pokemon) {
  pokemonCardsContainer.innerHTML = '';

  const sprite = pokemon.sprites.front_default;
  const types = pokemon.types.map(typeInfo => typeInfo.type.name).join(', ');

  const card = `
      <div class="pokemon-card">
          <h3>${pokemon.name}</h3>
          <img src="${sprite}" alt="${pokemon.name}">
          <p>Tipo: ${types}</p>
      </div>
  `;
  pokemonCardsContainer.innerHTML = card;
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

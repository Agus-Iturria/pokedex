const pokemonCardsContainer = document.getElementById('pokemon-cards');
const pageNumSpan = document.getElementById('page-num');
let currentPage = 1;
const limit = 25;

async function fetchPokemons(page) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${(page - 1) * limit}&limit=${limit}`);
        if (response.ok) {
            const data = await response.json();
            displayPokemons(data.results);
        } else {
            console.log('Error en la respuesta:', response.status);
        }
    } catch (error) {
        console.log('Error al obtener los datos:', error);
    }
}

async function getPokemonDetails(pokemonUrl) {
    try {
        const response = await fetch(pokemonUrl);
        if (response.ok) {
            return await response.json();
        } else {
            console.log('Error en la respuesta:', response.status);
            return null;
        }
    } catch (error) {
        console.log('Error al obtener los detalles del Pokémon:', error);
        return null;
    }
}

async function displayPokemons(pokemonList) {
    pokemonCardsContainer.innerHTML = '';
    
    for (const pokemon of pokemonList) {
        const pokemonDetails = await getPokemonDetails(pokemon.url);

        if (pokemonDetails) {
            const sprite = pokemonDetails.sprites.front_default;
            const types = pokemonDetails.types.map(typeInfo => typeInfo.type.name).join(', ');

            const card = `
                <div class="pokemon-card">
                    <h3>${pokemon.name}</h3>
                    <img src="${sprite}" alt="${pokemon.name}">
                    <p>Tipo: ${types}</p>
                </div>
            `;
            pokemonCardsContainer.innerHTML += card;
        }
    }
}

function searchPokemon() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    if (searchInput) {
        fetchPokemons(currentPage).then(() => {
            const pokemonCards = document.querySelectorAll('.pokemon-card');
            pokemonCards.forEach(card => {
                const pokemonName = card.querySelector('h3').textContent.toLowerCase();
                if (!pokemonName.includes(searchInput)) {
                    card.style.display = 'none';
                } else {
                    card.style.display = 'block';
                }
            });
        });
    } else {
        fetchPokemons(currentPage);
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
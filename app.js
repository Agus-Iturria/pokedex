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

function displayPokemons(pokemonList) {
    pokemonCardsContainer.innerHTML = '';
    pokemonList.forEach(pokemon => {
        const card = `
            <div class="pokemon-card">
                <h3>${pokemon.name}</h3>
            </div>
        `;
        pokemonCardsContainer.innerHTML += card;
    });
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

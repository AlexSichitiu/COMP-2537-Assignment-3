const CARDS_PER_PAGE = 10;
const MAX_PAGES_DISPLAYED = 5;

async function producePokemon(currentPage, pokemon){
    currentPokemon = pokemon.slice((currentPage - 1) * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE);
    
    $('#pokemonCards').empty();
    currentPokemon.forEach(async (givenPokemon) => {
        console.log(givenPokemon);
        var res = await axios.get(givenPokemon.url);
        var info = res.data;
        $('#pokemonCards').append(`
            <div class="card" pokemonName="${info.name}">
                <h4>${info.name.toUpperCase()}</h4>
                <img src="${info.sprites.front_shiny}" alt="${info.name}" style="height: 200px; width: 200px;">
                <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#pokemonModal">
                    Details
                </button>
            </div>
        `)
    });
}

const setup = async () => {
    $('#pokemonCards').empty();
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    pokemon = response.data.results;
    currentPage = 1;
    producePokemon(currentPage, pokemon);
}

$(document).ready(setup);
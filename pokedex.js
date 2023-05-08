const CARDS_PER_PAGE = 10;
const MAX_PAGES_DISPLAYED = 5;

async function producePokemon(currentPage, pokemon){
    currentPage < 1 ? currentPage = 1 : currentPage;
    currentPage > Math.ceil(pokemon.length / CARDS_PER_PAGE) ? Math.ceil(pokemon.length / CARDS_PER_PAGE) : currentPage
    currentPokemon = pokemon.slice((currentPage - 1) * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE);
    
    $('#pokemonCards').empty();
    currentPokemon.forEach(async (givenPokemon) => {
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

async function updatePages(currentPage, pageCount){
    $('#pages').empty();
    var boundLength = Math.floor(MAX_PAGES_DISPLAYED / 2);
    var lowerPage = Math.max(currentPage - boundLength, 1);
    var upperPage = Math.min(currentPage + boundLength, pageCount);
    for (var i = lowerPage; i <= upperPage; i++){
        $('#pages').append(`<button class="btn btn-primary page ml-1 numberedButtons" value="${i}">${i}</button>`)
    }
}

const setup = async () => {
    $('#pokemonCards').empty();
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    var pokemon = response.data.results;
    var currentPage = 1;
    producePokemon(currentPage, pokemon);
    var pageCount = Math.ceil(pokemon.length / CARDS_PER_PAGE);
    updatePages(currentPage, pageCount);
}

$(document).ready(setup);
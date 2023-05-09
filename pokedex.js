const CARDS_PER_PAGE = 10;
const MAX_PAGES_DISPLAYED = 5;

async function producePokemon(currentPage, pokemon){
    currentPage < 1 ? currentPage = 1 : currentPage;
    currentPage > Math.ceil(pokemon.length / CARDS_PER_PAGE) ? Math.ceil(pokemon.length / CARDS_PER_PAGE) : currentPage;
    currentPokemon = pokemon.slice((currentPage - 1) * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE);
    
    $('#pokemonCards').empty();
    currentPokemon.forEach(async (givenPokemon) => {
        var res = await axios.get(givenPokemon.url);
        var info = res.data;
        $('#pokemonCards').append(`
            <div class="card pokemonCard" pokemonName="${info.name}">
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
    currentPage < 1 ? currentPage = 1 : currentPage;
    currentPage > pageCount ? currentPage = pageCount : currentPage
    $('#pages').empty();
    var boundLength = Math.floor(MAX_PAGES_DISPLAYED / 2);
    var lowerPage = Math.max(currentPage - boundLength, 1);
    var upperPage = Math.min(currentPage + boundLength, pageCount);
    if (currentPage != 1){
        $('#pages').append(`<button class="btn btn-primary page ml-1 pageButton" value="${currentPage - 1}">Prev</button>`);
    }
    for (var i = lowerPage; i <= upperPage; i++){
        $('#pages').append(`<button class="btn btn-primary page ml-1 pageButton" value="${i}">${i}</button>`);
    }
    if (currentPage != pageCount){
    $('#pages').append(`<button class="btn btn-primary page ml-1 pageButton" value="${currentPage + 1}">Next</button>`);
    }
}

const setup = async () => {
    $('#pokemonCards').empty();
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    var pokemon = response.data.results;
    var currentPage = 1;
    var pageCount = Math.ceil(pokemon.length / CARDS_PER_PAGE);
    producePokemon(currentPage, pokemon);
    updatePages(currentPage, pageCount);

    $('body').on('click', '.pageButton', async (e) => {
        currentPage = parseInt(e.target.value);
        producePokemon(currentPage, pokemon);
        updatePages(currentPage, pageCount);
    });

    $('body').on('click', '.pokemonCard', async function(e){
        var name = $(this).attr('pokemonName');
        var res = await axios.get('https://pokeapi.co/api/v2/pokemon/' + name);
        $('.modal-title').empty().append(name.toUpperCase());
        $('.modal-body').empty().append(`
            <img src="${res.data.sprites.front_shiny}" alt="${name}" style="width:90%">
            <h4>Type(s)</h4>
            <ul>
                ${res.data.types.map((type) => `<li>${type.type.name}</li>`).join('')}
            </ul>
            <h4>Abilities</h4>
            <ul>
                ${res.data.abilities.map((ability) => `<li>${ability.ability.name}</li>`).join('')}
            </ul>
            <h4>Stats</h4>
            <ul>
                ${res.data.stats.map((stat) => 
                    `<li>${stat.stat.name.toUpperCase()}: ${stat.base_stat}</li>`)
                    .join('')}
            </ul>
        `)
    });
}

$(document).ready(setup);
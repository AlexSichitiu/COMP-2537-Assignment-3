const CARDS_PER_PAGE = 10;
const MAX_PAGES_DISPLAYED = 5;

async function producePokemon(currentPage, pokemon){
    currentPage < 1 ? currentPage = 1 : currentPage;
    currentPage > Math.ceil(pokemon.length / CARDS_PER_PAGE) ? Math.ceil(pokemon.length / CARDS_PER_PAGE) : currentPage;
    currentPokemon = pokemon.slice((currentPage - 1) * CARDS_PER_PAGE, currentPage * CARDS_PER_PAGE);
    $('#pokemonCards').empty().append('<div class="container"><h5>Displaying ' + CARDS_PER_PAGE + ' Pokemon out of ' + pokemon.length + '</h5></div>');
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
        var buttonStatus = (i == currentPage ? "active" : "");
        $('#pages').append(`<button class="btn btn-primary page ml-1 pageButton ${buttonStatus}" value="${i}">${i}</button>`);
    }
    if (currentPage != pageCount){
    $('#pages').append(`<button class="btn btn-primary page ml-1 pageButton" value="${currentPage + 1}">Next</button>`);
    }
}

function overlapping(pokemon, referenceList){
    for (var i = 0; i < referenceList.length; i++){
        if (pokemon.name == referenceList[i].name){
            return true;
        }
    }
    return false;
}

const setup = async () => {
    $('#pokemonCards').empty();
    let response = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=810');
    let typeResponse = await axios.get('https://pokeapi.co/api/v2/type');
    var pokemon = response.data.results;
    var workingPokemon = pokemon;
    var types = typeResponse.data.results;
    var currentPage = 1;
    var pageCount = Math.ceil(pokemon.length / CARDS_PER_PAGE);
    var filters = [];
    filters.fill(false);
    producePokemon(currentPage, pokemon);
    updatePages(currentPage, pageCount);
    types.forEach((type) => {
            $('#filters').append(`
                <input type="checkbox" value="${type.url}" class="filter-option">
                <label>${type.name}</label>
            `);
    });
        
    $('body').on('change', '.filter-option', async (e) => {
        if (e.target.checked){
            filters.push(e.target.value);
        } else {
            var index = filters.indexOf(e.target.value);
            if (index != -1){
                filters.splice(index, 1);
            }
        }
        workingPokemon = JSON.parse(JSON.stringify(pokemon));
        for (var i = 0; i < filters.length; i++){
            var res = await axios(filters[i]);
            var unextractedPokemon = res.data.pokemon;
            var candidatePokemon = unextractedPokemon.map((poke) => poke.pokemon);
            workingPokemon = workingPokemon.filter((givenPokemon) => {
            return overlapping(givenPokemon, candidatePokemon);
        })}
        currentPage = 1;
        producePokemon(currentPage, workingPokemon);
        pageCount = Math.ceil(workingPokemon.length / CARDS_PER_PAGE);
        updatePages(currentPage, pageCount);
    });

    $('body').on('click', '.pageButton', async (e) => {
        currentPage = parseInt(e.target.value);
        producePokemon(currentPage, workingPokemon);
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
const MAX_POKEMON = 151;
let allPokemons = [];
let allPokemonDetails = [];

document.addEventListener("DOMContentLoaded", () => {
    const listWrapper = document.querySelector(".list-wrapper");
    const searchInput = document.querySelector("#search-input");
    const allFilter = document.querySelector("#all");
    const numberFilter = document.querySelector("#number");
    const nameFilter = document.querySelector("#name");
    const typeFilter = document.querySelector("#type");
    const notFoundMessage = document.querySelector("#not-found-message");
    const closeButton = document.querySelector(".search-close-icon");

    if (!listWrapper || !searchInput || !allFilter || !numberFilter || !nameFilter || !typeFilter || !notFoundMessage || !closeButton) {
        throw new Error("One or more elements are missing in the DOM.");
    }

    closeButton.addEventListener("click", clearSearch);
    searchInput.addEventListener("keyup", handleSearch);

    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${MAX_POKEMON}`)
        .then((response) => response.json())
        .then(async (data) => {
            allPokemons = data.results;
            allPokemonDetails = await Promise.all(allPokemons.map(pokemon => 
                fetch(pokemon.url).then(res => res.json())
            ));
            displayPokemons(allPokemonDetails, listWrapper);
        })
        .catch((error) => {
            console.error("Failed to fetch Pokémon data:", error);
        });
});

function displayPokemons(pokemonList, listWrapper) {
    listWrapper.innerHTML = "";

    pokemonList.forEach((pokemon) => {
        const originalID = pokemon.id;
        const paddedID = originalID.toString().padStart(3, '0');
        const listItem = document.createElement("div");
        listItem.className = "list-item";
        listItem.innerHTML = `
            <div class="number-wrap">
                <p class="caption-fonts">${paddedID}</p>
            </div>
            <div class="img-wrap">
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${originalID}.svg" alt="${pokemon.name}" />
            </div>
            <div class="name-wrap">
                <p class="body3-fonts">${pokemon.name}</p>
            </div>
        `;

        listItem.addEventListener("click", () => {
            const pokemonData = allPokemonDetails.find(p => p.id === originalID); // Use original id for comparison
            if (pokemonData) {
                window.location.href = `./detail.html?id=${originalID}`; // Use original id for URL
            }
        });

        listWrapper.appendChild(listItem);
    });
}



function handleSearch() {
    const searchInput = document.querySelector("#search-input");
    const allFilter = document.querySelector("#all");
    const numberFilter = document.querySelector("#number");
    const nameFilter = document.querySelector("#name");
    const typeFilter = document.querySelector("#type");
    const notFoundMessage = document.querySelector("#not-found-message");
    const listWrapper = document.querySelector(".list-wrapper");

    if (!searchInput || !allFilter || !numberFilter || !nameFilter || !typeFilter || !notFoundMessage || !listWrapper) {
        console.error("One or more elements are missing in the DOM.");
        return;
    }

    const searchTerm = searchInput.value.toLowerCase();
    let filteredPokemons = [];

    if (numberFilter.checked) {
        filteredPokemons = allPokemonDetails.filter(pokemon => 
            pokemon.id.toString().startsWith(searchTerm)
        );
    } else if (nameFilter.checked) {
        filteredPokemons = allPokemonDetails.filter(pokemon => 
            pokemon.name.toLowerCase().startsWith(searchTerm)
        );
    } else if (typeFilter.checked) {
        filteredPokemons = allPokemonDetails.filter(pokemon => 
            pokemon.types.some(typeInfo => typeInfo.type.name.toLowerCase().startsWith(searchTerm))
        );
    } else if (allFilter.checked) {
        filteredPokemons = allPokemonDetails.filter(pokemon => 
            pokemon.id.toString().startsWith(searchTerm) ||
            pokemon.name.toLowerCase().startsWith(searchTerm) ||
            pokemon.types.some(typeInfo => typeInfo.type.name.toLowerCase().startsWith(searchTerm))
        );
    }

    displayPokemons(filteredPokemons, listWrapper);

    if (filteredPokemons.length === 0) {
        notFoundMessage.style.display = "block";
    } else {
        notFoundMessage.style.display = "none";
    }
}

function clearSearch() {
    const searchInput = document.querySelector("#search-input");
    const notFoundMessage = document.querySelector("#not-found-message");
    const listWrapper = document.querySelector(".list-wrapper");

    if (!searchInput || !notFoundMessage || !listWrapper) {
        console.error("One or more elements are missing in the DOM.");
        return;
    }

    searchInput.value = "";
    displayPokemons(allPokemonDetails, listWrapper);
    notFoundMessage.style.display = "none";
}

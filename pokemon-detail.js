let currentPokemonId = null;

document.addEventListener("DOMContentLoaded", () => {
    const MAX_POKEMONS = 151;
    const pokemonID = new URLSearchParams(window.location.search).get("id");
    const id = parseInt(pokemonID, 10);

    if (id < 1 || id > MAX_POKEMONS) {
        return (window.location.href = "./index.html");
    }

    currentPokemonId = id;
    loadPokemon(id);
});

async function loadPokemon(id) {
    try {
        const [pokemon, pokemonSpecies] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then((res) => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`).then((res) => res.json()),
        ]);

        const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.abilities");
        console.log('abilitiesWrapper:', abilitiesWrapper);
        if (!abilitiesWrapper) {
            console.error('abilitiesWrapper not found');
            return;
        }
        abilitiesWrapper.innerHTML = "";

        if (currentPokemonId === id) {
            displayPokemonDetails(pokemon);
            const flavourText = getEnglishFlavourText(pokemonSpecies);
            const descriptionElement = document.querySelector(".body3-fonts.pokemon-description");
            console.log('descriptionElement:', descriptionElement);
            if (descriptionElement) {
                descriptionElement.textContent = flavourText;
            } else {
                console.error('descriptionElement not found');
            }

            const [leftArrow, rightArrow] = ["#leftArrow", "#rightArrow"].map((sel) => document.querySelector(sel));
            console.log('leftArrow:', leftArrow, 'rightArrow:', rightArrow);
            if (leftArrow && rightArrow) {
                leftArrow.removeEventListener("click", navigatePokemon);
                rightArrow.removeEventListener("click", navigatePokemon);

                if (id !== 1) {
                    leftArrow.addEventListener("click", () => navigatePokemon(id - 1));
                }
                if (id !== 151) {
                    rightArrow.addEventListener("click", () => navigatePokemon(id + 1));
                }
            } else {
                console.error('Navigation arrows not found');
            }

            window.history.pushState({}, "", `./detail.html?id=${id}`);
        }

        return true;
    } catch (error) {
        console.error("An error occurred while fetching Pokémon data:", error);
        return false;
    }
}

async function navigatePokemon(id) {
    currentPokemonId = id;
    await loadPokemon(id);
}

const typeColours = {
    bug: "#A8B820",
    dark: "#705848",
    dragon: "#7038F8",
    electric: "#F8D030",
    fighting: "#C03028",
    fire: "#F08030",
    flying: "#A890F0",
    ghost: "#705898",
    grass: "#78C850",
    ground: "#E0C068",
    ice: "#98D8D8",
    normal: "#A8A878",
    poison: "#A040A0",
    psychic: "#F85888",
    rock: "#B8A038",
    steel: "#B8B8D0",
    water: "#6890F0",
};

function setElementStyles(elements, cssProperty, value) {
    elements.forEach((element) => {
        element.style[cssProperty] = value;
    });
}

function hex2rgba(hexColour) {
    return [
        parseInt(hexColour.slice(1, 3), 16),
        parseInt(hexColour.slice(3, 5), 16),
        parseInt(hexColour.slice(5, 7), 16),
    ].join(", ");
}

function setTypeBackgroundColour(pokemon) {
    const mainType = pokemon.types[0].type.name;
    const colour = typeColours[mainType];

    if (!colour) {
        console.warn(`Colour not defined for type: ${mainType}`);
        return;
    }

    const detailMainElement = document.querySelector(".detail-main");
    console.log('detailMainElement:', detailMainElement);
    if (!detailMainElement) {
        console.error('detailMainElement not found');
        return;
    }
    setElementStyles([detailMainElement], "backgroundColor", colour);
    setElementStyles([detailMainElement], "borderColor", colour);

    setElementStyles(document.querySelectorAll(".power-wrapper > p"), "backgroundColor", colour);
    setElementStyles(document.querySelectorAll(".stats-wrap p.stats"), "color", colour);
    setElementStyles(document.querySelectorAll(".stats-wrap .progress-bar"), "color", colour);

    const rgbaColour = hex2rgba(colour);
    const styleTag = document.createElement("style");
    styleTag.innerHTML = `
    .stats-wrap .progress-bar::-webkit-progress-bar {
        background-color: rgba(${rgbaColour}, 0.5);
    }
    .stats-wrap .progress-bar::-webkit-progress-value {
        background-color: ${colour};
    }
    `;
    document.head.appendChild(styleTag);
}

function capitaliseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function createAndAppendElement(parent, tag, options = {}) {
    const element = document.createElement(tag);
    Object.keys(options).forEach((key) => {
        element[key] = options[key];
    });
    parent.appendChild(element);
    return element;
}

function displayPokemonDetails(pokemon) {
    const { name, id, types, weight, height, abilities, stats } = pokemon;
    const capitalisePokemonName = capitaliseFirstLetter(name);

    document.querySelector("title").textContent = capitalisePokemonName;

    const detailMainElement = document.querySelector(".detail-main");
    console.log('detailMainElement:', detailMainElement);
    if (!detailMainElement) {
        console.error('detailMainElement not found');
        return;
    }
    detailMainElement.classList.add(name.toLowerCase());

    const nameElement = document.querySelector(".name-wrap .name");
    console.log('nameElement:', nameElement);
    if (nameElement) {
        nameElement.textContent = capitalisePokemonName;
    } else {
        console.error('nameElement not found');
    }

    const idElement = document.querySelector(".pokemon-id-wrap .body2-fonts");
    console.log('idElement:', idElement);
    if (idElement) {
        idElement.textContent = `${String(id).padStart(3, "0")}`;
    } else {
        console.error('idElement not found');
    }

    const imageElement = document.querySelector(".detail-img-wrapper img");
    console.log('imageElement:', imageElement);
    if (imageElement) {
        imageElement.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;
        imageElement.alt = name;
    } else {
        console.error('imageElement not found');
    }

    const typeWrapper = document.querySelector(".power-wrapper");
    console.log('typeWrapper:', typeWrapper);
    if (!typeWrapper) {
        console.error('typeWrapper not found');
        return;
    }
    typeWrapper.innerHTML = "";
    types.forEach(({ type }) => {
        createAndAppendElement(typeWrapper, "p", {
            className: `body3-fonts type ${type.name}`,
            textContent: type.name,
        });
    });

    const weightElement = document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.weight");
    console.log('weightElement:', weightElement);
    if (weightElement) {
        weightElement.textContent = `${weight / 10} kg`;
    } else {
        console.error('weightElement not found');
    }

    const heightElement = document.querySelector(".pokemon-detail-wrap .pokemon-detail p.body3-fonts.height");
    console.log('heightElement:', heightElement);
    if (heightElement) {
        heightElement.textContent = `${height / 10} m`;
    } else {
        console.error('heightElement not found');
    }

    const abilitiesWrapper = document.querySelector(".pokemon-detail-wrap .pokemon-detail.abilities");
    console.log('abilitiesWrapper:', abilitiesWrapper);
    if (!abilitiesWrapper) {
        console.error('abilitiesWrapper not found');
        return;
    }
    abilitiesWrapper.innerHTML = ""; // Clear previous abilities

    abilities.forEach(({ ability }) => {
        createAndAppendElement(abilitiesWrapper, "p", {
            className: "body3-fonts",
            textContent: ability.name,
        });
    });

    const statsWrapper = document.querySelector(".stats-wrapper");
    console.log('statsWrapper:', statsWrapper);
    if (!statsWrapper) {
        console.error('statsWrapper not found');
        return;
    }
    statsWrapper.innerHTML = ""; // Clear previous stats

    const statNameMapping = {
        hp: "HP",
        attack: "Attack",
        defense: "Defence",
        "special-attack": "Sp. Atk",
        "special-defense": "Sp. Def",
        speed: "Speed",
    };

    stats.forEach(({ stat, base_stat }) => {
        const statDiv = document.createElement("div");
        statDiv.className = "stats-wrap";
        statsWrapper.appendChild(statDiv);

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts stats",
            textContent: statNameMapping[stat.name],
        });

        createAndAppendElement(statDiv, "p", {
            className: "body3-fonts",
            textContent: String(base_stat).padStart(3, "0"),
        });

        createAndAppendElement(statDiv, "progress", {
            className: "progress-bar",
            value: base_stat,
            max: 100,
        });
    });

    setTypeBackgroundColour(pokemon);
}

function getEnglishFlavourText(pokemonSpecies) {
    for (let entry of pokemonSpecies.flavor_text_entries) {
        if (entry.language.name === "en") {
            let flavour = entry.flavor_text.trim();
            flavour = flavour.replace(/[\n\f\r]/g, ' ').replace(/\^/g, ''); // Remove special characters
            return flavour;
        }
    }
    return "";
}

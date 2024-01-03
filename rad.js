const pokemonBaseUrl = "https://pokeapi.co/api/v2"

// Array of Pokemon names for base pokemon if localstorage is empty
const pokemonNames = [
  'bulbasaur', 'ivysaur', 'venusaur', 'charmander', 'charmeleon', 'charizard',
  'squirtle', 'wartortle', 'blastoise', 'pikachu', 'pichu', 'clefairy'
];

// Create an array of promises for each Pokemon used at the bottom of file
const pokemonPromises = pokemonNames.map((name) => {
  const url = `${pokemonBaseUrl}/pokemon/${name}`;
  return fetch(url).then((response) => response.json());
});

const basePokemon = 0;

function handlePokeWeights() {
  const pokeCards = Array.from(document.querySelectorAll('.pokemon-card'));
  let light = 0;
  let average = 0;
  let heavy = 0;
  for (card of pokeCards) {
    if (card.dataset.weightType === 'light') {
      light++
    } else {
      card.dataset.weightType === 'heavy' ? heavy++ : average++;
    }
  }
  const lightNode = document.querySelector('.light-count');
  lightNode.textContent = `Light Pokemon: ${light}`;
  const averageNode = document.querySelector('.average-count');
  averageNode.textContent = `Average Pokemon: ${average}`;
  const heavyNode = document.querySelector('.heavy-count');
  heavyNode.textContent = `Heavy Pokemon: ${heavy}`;
}

const filterLightPokemon = () => {
  filterPokemonWeight('light');
};
const filterAveragePokemon = () => {
  filterPokemonWeight('average')
};
const filterHeavyPokemon = () => {
  filterPokemonWeight('heavy')
};

function filterPokemonWeight(weight) {
  const pokemonContainer = document.querySelector('.pokemon');
  const pokemonData = JSON.parse(localStorage.getItem('pokemon'))
  const pokemonCards = createPokemonCards(pokemonData);
  const filteredCards = pokemonCards.filter((card) => card.dataset.weightType === weight);
  pokemonContainer.innerHTML = '';
  filteredCards.forEach((card) => pokemonContainer.appendChild(card));
  updateDisplay();
}

// This function is in case there is future data wished to be tracked anytime there is a change in pokemon
function updateDisplay() {
  handlePokeWeights();
}

const defaultCompare = (a, b) => {
  return a.dataset.name.toString().localeCompare(b.dataset.name.toString());
}

//sorts pokemon by name
function handlePokemonNameSorting(direction, pokeCards) {
  pokeCards.sort(defaultCompare);
  direction === 'dec' 
  ? pokeCards
  : pokeCards.reverse();
}

//sorts pokemon by atk, def, hp, or id dependant upon input(thisStat)
function handlePokemonSorting(thisStat, direction, pokeCards) {
  pokeCards.sort((a, b) => {
    let idA = null;
    let idB = null;
    if (thisStat === 'hp') {
      idA = parseInt(a.dataset.hp);
      idB = parseInt(b.dataset.hp);
    } else if (thisStat === 'atk') {
      idA = parseInt(a.dataset.atk);
      idB = parseInt(b.dataset.atk);
    } else if (thisStat === 'def') {
      idA = parseInt(a.dataset.def);
      idB = parseInt(b.dataset.def);
    } else if (thisStat === 'num') {
      idA = parseInt(a.getAttribute('id'));
      idB = parseInt(b.getAttribute('id'));
    }
    return direction === 'dec' ? idA - idB : idB - idA;
  })
}

function eventPokemonStats() {
  const statsContainer = document.querySelector('.pokemon-stats-container');
  statsContainer.addEventListener('click', (e) => {
    const [stat, direction] = e.target.classList[0].split('-');
    const container = document.querySelector('.pokemon');
    const pokeCards = Array.from(document.querySelectorAll('.pokemon-card'));
    const arrKeys = ['hp', 'atk', 'def', 'num'];
    if (e.target.classList.contains('pokemon-stat')) {
      pokeCards.filter((card) => {
        return !card.classList.contains('hidden');
      })
      if (arrKeys.includes(stat)) {
        handlePokemonSorting(stat, direction, pokeCards, arrKeys);
      } else if (stat === 'abc') {
        handlePokemonNameSorting(direction, pokeCards);
      }
      container.innerHTML = '';
      pokeCards.forEach((card) => {
        container.appendChild(card);
      })
    }
  })
}

function seeAll() {
  const pokemonContainer = document.querySelector('.pokemon');
  const pokemonData = JSON.parse(localStorage.getItem('pokemon'));
  const pokemonCards = createPokemonCards(pokemonData);
  pokemonCards.map((card) => checkFavPokemonLs(card));
  pokemonContainer.innerHTML = '';
  pokemonCards.map((card) => pokemonContainer.appendChild(card));
  updateDisplay();
}

function seeFav() {
  const pokeCards = document.querySelectorAll('.pokemon-card');
  pokeCards.forEach((card) => {
    if (card.querySelector('.is-fav') !== card.querySelector('.heart-icon')) {
      card.remove();
    }
  })
  updateDisplay();
}

function toggleFav(id) {
  const fav = 'is-fav';
  const heartBtn = document.getElementById(id);
  if (heartBtn) {
    heartBtn.classList.toggle(fav)
  }
}

function toggleDelete(e) {
  const card = e.parentElement.parentElement.parentElement;
  const curLocalPokemon = Array.from(JSON.parse(localStorage.getItem('pokemon')));
  const curLocalPokemonNames = curLocalPokemon.map((pokemon) => pokemon.name);
  const cardNameIndex = curLocalPokemonNames.indexOf(card.dataset.name);
  curLocalPokemon.splice(cardNameIndex, 1);
  localStorage.setItem('pokemon', JSON.stringify(curLocalPokemon));
  card.parentElement.removeChild(card);
  updateDisplay();
}

function handleFavPokemonLs(e) {
  const card = e.parentElement.parentElement.parentElement;
  const curLocal = JSON.parse(localStorage.getItem('fav-pokemon'));
  const cardId = card.id;
  if (curLocal === null || curLocal.length === 0) {
    const favArr = [];
    favArr.push(cardId);
    localStorage.setItem('fav-pokemon', JSON.stringify(favArr));
  } else if (curLocal === cardId || curLocal.includes(cardId)) {
    const index = curLocal.indexOf(cardId);
    const favArr = curLocal;
    favArr.splice(index, 1);
    favArr !== null 
    ? localStorage.setItem('fav-pokemon', JSON.stringify(favArr))
    : localStorage.removeItem('fav-pokemon'); 
  } else {
    const favArr = curLocal;
    favArr.push(cardId);
    localStorage.setItem('fav-pokemon', JSON.stringify(favArr));
  }
}

function heartAnimation(heart) {
  heart.classList.add('animated-heartbeat');
  setTimeout(() => {
    heart.classList.remove('animated-heartbeat');
  }, 1500);
}

function addEventListenersForHeart() {
  const pokemonContainer = document.querySelector('.pokemon');
  pokemonContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('heart-icon')) {
      toggleFav(event.target.getAttribute('id'));
      heartAnimation(event.target)
      handleFavPokemonLs(event.target);
    } else if (event.target.parentElement.classList.contains('delete-btn')) {
      toggleDelete(event.target);
    }
  });
}

//Creates all html elements for pokemon cards
function createFavBtn(data) {
  const favPokeIds = JSON.parse(localStorage.getItem('fav-pokemon'));
  const favBtn = document.createElement('div');
  favBtn.classList.add('fav-btn');
  const heart = document.createElement('i');
  heart.classList.add('fa-solid');
  heart.classList.add('fa-heart');
  heart.classList.add('heart-icon');
  heart.setAttribute('id', `heart-${data.id}`);
  if (favPokeIds !== null) {
    if (favPokeIds.includes(String(data.id))) {
      heart.classList.add('is-fav');
    }
  }
  favBtn.appendChild(heart);
  return favBtn;
}

function createDeleteBtn() {
  const deleteBtn = document.createElement('div');
  deleteBtn.classList.add('delete-btn');
  const xBtn = document.createElement('i');
  xBtn.classList.add('fa-solid');
  xBtn.classList.add('fa-x');
  deleteBtn.appendChild(xBtn);
  return deleteBtn;
}

function combineFavDeleteBtns(fav, del) {
  const favDeleteBar = document.createElement('div');
  favDeleteBar.classList.add('fav-delete-bar');
  favDeleteBar.appendChild(fav);
  favDeleteBar.appendChild(del)
  return favDeleteBar
}

function createImgWrap(data) {
  const imgWrap = document.createElement('div');
  const pokeImg = document.createElement('img');
  pokeImg.src = data.src;
  imgWrap.classList.add('pokemon-img-wrapper');
  imgWrap.appendChild(pokeImg);
  return imgWrap;
}

function createAtkHpDef(data) {
  const pokeBar = document.createElement('div');
  pokeBar.classList.add('pokemon-power-bar');
  const pokeAtk = document.createElement('div');
  const pokeHp = document.createElement('div');
  const pokeDef = document.createElement('div');
  const pokeAtkNode = document.createTextNode('ATK: ' + data.atk);
  const pokeHpNode = document.createTextNode('HP: ' + data.hp);
  const pokeDefNode = document.createTextNode('DEF: ' + data.def);
  pokeAtk.append(pokeAtkNode);
  pokeHp.append(pokeHpNode);
  pokeDef.append(pokeDefNode);
  pokeBar.appendChild(pokeAtk);
  pokeBar.appendChild(pokeHp);
  pokeBar.appendChild(pokeDef);
  return pokeBar;
}

function createPokeName(data) {
  const pokeName = document.createElement('h2');
  const pokeNameNode = document.createTextNode(`${data.name.toUpperCase()}`);
  pokeName.classList.add('lg-text');
  pokeName.appendChild(pokeNameNode);
  return pokeName;
}

function createPokeId(data) {
const pokeId = document.createElement('p');
const pokeIdNode = document.createTextNode(`#${data.id}`)
pokeId.appendChild(pokeIdNode);
pokeId.classList.add('small-text');
return pokeId;
}

function createPokemonAbilities(data) {
  const abilitiesDiv = document.createElement('div');
  abilitiesDiv.classList.add('pokemon-abilities')
  const abilitiesText = document.createElement('h3');
  const abilitiesTextNode = document.createTextNode('Abilities');
  abilitiesText.appendChild(abilitiesTextNode);
  abilitiesText.classList.add('med-text');
  abilitiesDiv.appendChild(abilitiesText);
  for (ability of data.abilities) {
    const newP = document.createElement('p');
    const newPNode = document.createTextNode(`${ability}`);
    newP.classList.add('small-text');
    newP.appendChild(newPNode);
    abilitiesDiv.appendChild(newP);
  }
  return abilitiesDiv;
}

function createPokemonTypes(data) {
  const pokeTypes = document.createElement('div');
  const pokeTypesTitle = document.createElement('h3');
  const pokeTypesTitleNode = document.createTextNode('Types');
  pokeTypesTitle.classList.add('med-text');
  pokeTypesTitle.append(pokeTypesTitleNode);
  pokeTypes.appendChild(pokeTypesTitle);
  pokeTypes.classList.add('pokemon-types');
    for (type of data.types) {
      const pokeType = document.createElement('p');
      const pokeTypeNode = document.createTextNode(`${type}`);
      pokeType.setAttribute('type', type);
      pokeType.appendChild(pokeTypeNode);
      pokeType.classList.add('small-text');
      pokeTypes.appendChild(pokeType);
    }
  return pokeTypes;
}

function combineAbilitiesTypes(ability, type) {
  const newDiv = document.createElement('div');
  newDiv.classList.add('pokemon-abilities-types')
  newDiv.appendChild(ability);
  newDiv.appendChild(type);
  return newDiv;
}

//Creates a Single pokemon card with all datasets and html elements
function handleSinglePokemon(data) {
  const pokeCard = document.createElement(`div`);
  pokeCard.classList.add('pokemon-card');
  pokeCard.setAttribute('id', data.id)
  pokeCard.dataset.name = data.name;
  pokeCard.dataset.hp = data.hp;
  pokeCard.dataset.atk = data.atk;
  pokeCard.dataset.def = data.def;
  pokeCard.dataset.weight = data.weight;
  pokeCard.dataset.weightType = data.weightType;
  const cardDetails = [
    combineFavDeleteBtns(createFavBtn(data), createDeleteBtn()),
    createImgWrap(data), 
    createAtkHpDef(data), 
    createPokeName(data), 
    createPokeId(data), 
    combineAbilitiesTypes(createPokemonAbilities(data), createPokemonTypes(data)), 
  ];
  for (detail of cardDetails) {
    pokeCard.appendChild(detail);
  }
  return pokeCard;
}

// checks for fav pokemon adds the is-fav class
function checkFavPokemonLs(card) {
  const thisCard = card;
  const thisBtn = thisCard.querySelector('.heart-icon');
  const favPokeIds = JSON.parse(localStorage.getItem('fav-pokemon')) || [];
  if (favPokeIds.includes(thisBtn.getAttribute('id'))) {
    toggleFav(thisBtn.getAttribute('id'));
  }
}

function addToPokemonLs(data) {
  const pokemonArray = JSON.parse(localStorage.getItem('pokemon')) || [];
  const pokemon = data;
  pokemonArray.push(pokemon)
  localStorage.setItem('pokemon', JSON.stringify(pokemonArray))
}

function storePokemonAbilities(data) {
  const abilities = [];
  for (index in data.abilities) {
    abilities.push(data.abilities[index].ability.name)
  }
  return abilities
}

function storePokemonTypes(data) {
  const types = [];
  if (data.types.length === data.abilities.length) {
    for (let i = 0; i < data.abilities.length; i++) {
      types.push(data.types[i].type.name);
    }
  } else {
    for (let i = 0; i < data.abilities.length; i++) {
      types.push(data.types[0].type.name)
    }
  }
  return types
}

function storePokemonWeightType(data) {
  if (data.weight < 100) {
    return 'light';
  } else {
    return data.weight < 500 ? 'average' : 'heavy';
  }
}

function storePokemonData(data) {
  const pokemon = {
    name: data.name,
    id: data.id, 
    src: data.sprites && data.sprites.front_default ? data.sprites.front_default : 'default-image-url',
    hp: data.stats[0].base_stat,
    atk: data.stats[1].base_stat,
    def: data.stats[2].base_stat,
    abilities: storePokemonAbilities(data),
    types: storePokemonTypes(data),
    weight: data.weight, 
    weightType: storePokemonWeightType(data),
  }
  const curPokemon = JSON.parse(localStorage.getItem('pokemon')) || []
  curPokemon.push(pokemon)
  localStorage.setItem('pokemon', JSON.stringify(curPokemon))
  return pokemon;
}

function createPokemonCards(pokemon) {
  const pokeCards = [];
  if (!Array.isArray(pokemon)) {
    const pokeCard = handleSinglePokemon(pokemon);
    return pokeCard;
  } else {
    for (singlePokemon of pokemon) {
      const pokeCard = handleSinglePokemon(singlePokemon);
      pokeCards.push(pokeCard);
    }
    return pokeCards;
  }
}


//Displays pokemon on screen updates pokemon ls
function addPokemonCard(pokemonData) {
  const pokemon = document.querySelector('div.pokemon');
  if(Array.isArray(pokemonData)) {
    for (card of pokemonData) {
      pokemon.appendChild(card);
    }
  } else {
    pokemon.appendChild(pokemonData);
  }
  updateDisplay();
  return pokemonData;
}


// Adds new pokemon from search and updates ls if prompted
function addPokemonCardSearch(data, updateLocal) {
  const pokemon = document.querySelector('div.pokemon');
  const prevPokemonCards = Array.from(document.querySelectorAll('.pokemon-card'));
  const pokemonCard = data;
  prevPokemonCards.push(pokemonCard);
  pokemon.innerHTML = '';
  prevPokemonCards.forEach((card) => {
    pokemon.appendChild(card);
  })
  if (updateLocal) {
    const pokemonArray = JSON.parse(localStorage.getItem('pokemon')) || [];
    pokemonArray.push(pokemonCard);
    localStorage.setItem('pokemon', JSON.stringify(prevPokemonCards));
  }
  updateDisplay();
  return data;
}

async function handlePokeSearch(newPokemon) {
  const pokemon = document.getElementById('poke-search');
  const curPokemon = JSON.parse(localStorage.getItem('pokemon')) || [];
  const curPokemonNames = curPokemon.map((pokemon) => pokemon.name)
  const pokemonTextContainer = document.getElementById('pokemon-search-result');
  let duplicatePokemonText = document.createTextNode(`You already have ${newPokemon}`);
  if (!curPokemonNames.includes(newPokemon)) {
    duplicatePokemonText = document.createTextNode(`You have chosen ${newPokemon} :)`);
  }
  pokemonTextContainer.innerHTML = '';
  pokemonTextContainer.appendChild(duplicatePokemonText);
}

// requests pokemon search data from api
async function findPokemon(input, updateLocal) {
  try {
    const pokeApiSearch = `https://pokeapi.co/api/v2/pokemon/${input}`;
    const response = await fetch(pokeApiSearch);
    if (!response.ok) {
      throw new Error(`failed to find ${input}`);
    }

    const dataText = await response.text();

    const data = JSON.parse(dataText);
    const pokemonArray = JSON.parse(localStorage.getItem('pokemon')) || [];
    const pokemonNames = pokemonArray.map((pokemon) => pokemon.name);
    handlePokeSearch(data.name);
    if (pokemonNames.includes(data.name)) {
      return
    }
    const pokemonData = storePokemonData(data);
    const pokemonCard = createPokemonCards(pokemonData);
    if(updateLocal) {
      try {
        pokemonArray.push(pokemonData);
        localStorage.setItem('pokemon', JSON.stringify(pokemonArray));
      } catch (localStorageError) {
        console.error("Error updating local storage:", localStorageError);
      }
    }
    addPokemonCardSearch(pokemonCard);
    return pokemonData;
  } catch (error) {
    const searchResultText = document.getElementById('pokemon-search-result');
    const searchResultTextNode = document.createTextNode('Sorry, we could not find your pokemon :(');
    searchResultText.append(searchResultTextNode);
    if (error instanceof TypeError) {
      console.error("TypeError:", error.message);
      // Handle TypeError differently
    } else if (error instanceof SyntaxError) {
      console.error("SyntaxError:", error.message);
      // Handle SyntaxError differently
    } else {
      console.error("Unexpected error:", error);
    }
  }
}

function handleOnclickApiSearch () {
  const pokemon = document.getElementById('poke-search');
  findPokemon(pokemon.value, true)
}

// loads requested pokemon on screen
function loadPokemon(pokemonToLoad, curPokemonArray) {
  const pokemonContainer = document.querySelector('.pokemon');
  pokemonContainer.innerHTML = '';
  const matchedPokemon = [];
  if (pokemonToLoad.length < 1) {
    const prevPokemon = createPokemonCards(curPokemonArray);
    prevPokemon.forEach((pokemon) => pokemonContainer.appendChild(pokemon));
  } else {
    for(pokemon of curPokemonArray) {
      if (pokemonToLoad === pokemon.name || pokemonToLoad.includes(pokemon.name)) {
        matchedPokemon.push(pokemon);
      }
    }
    const pokemonArray = createPokemonCards(matchedPokemon);
    if (Array.isArray(pokemonArray)) {
      pokemonArray.forEach((pokemon) => pokemonContainer.appendChild(pokemon));
    } else {
      pokemonContainer.appendChild(pokemonArray);
    }
    addEventListenersForHeart();
    updateDisplay();
  }
}

function handlePokemonOnLoad(data) {
  const curLocalPokemon = JSON.parse(localStorage.getItem('pokemon'))
  curLocalPokemon === null ? addPokemonCard(data) : loadPokemon(curLocalPokemon);
}

function handlePokedexSearch() {
  const pokemonSearch = document.getElementById('pokedex-search');
  const curPokemonArray = JSON.parse(localStorage.getItem('pokemon')) || [];
  const curPokemonNames = curPokemonArray.map((pokemon) => pokemon.name)
  const possiblePokemonArray = [];
  for (let pokemon of curPokemonNames) {
    if (pokemon.includes(pokemonSearch.value)) {
      possiblePokemonArray.push(pokemon);
    }
  }
  if (pokemonSearch.value === '') {
    return loadPokemon([], curPokemonArray);
  }
  return loadPokemon(possiblePokemonArray, curPokemonArray);
}
  

if (JSON.parse(localStorage.getItem('pokemon')) === null || JSON.parse(localStorage.getItem('pokemon')).length === 0) {
  Promise
  .all(pokemonPromises)
  .then((pokemonData) => pokemonData.map((pokemon) => storePokemonData(pokemon)))
  .then((pokemon) => createPokemonCards(pokemon))
  .then((pokemonCards) => {
    pokemonCards.forEach((card) => {
      checkFavPokemonLs(card);
      addPokemonCard(card)
    })
  })
  .catch((error) => console.error(error));
} else {
  const pokemonData = JSON.parse(localStorage.getItem('pokemon'));
  const pokemonCards = createPokemonCards(pokemonData);
  pokemonCards.forEach((card) => {
    checkFavPokemonLs(card);
    addPokemonCard(card)
  })
}

eventPokemonStats();
addEventListenersForHeart();
const pokemonBaseUrl = "https://pokeapi.co/api/v2"

const bulbasaur = fetch('https://pokeapi.co/api/v2/pokemon/bulbasaur');
const ivysaur = fetch('https://pokeapi.co/api/v2/pokemon/ivysaur');
const venusaur = fetch('https://pokeapi.co/api/v2/pokemon/venusaur');
const charmander = fetch('https://pokeapi.co/api/v2/pokemon/charmander');
const charmeleon = fetch('https://pokeapi.co/api/v2/pokemon/charmeleon');
const charizard = fetch('https://pokeapi.co/api/v2/pokemon/charizard');
const squirtle = fetch('https://pokeapi.co/api/v2/pokemon/squirtle');
const wartortle = fetch('https://pokeapi.co/api/v2/pokemon/wartortle');
const blastoise = fetch('https://pokeapi.co/api/v2/pokemon/blastoise');
const pikachu = fetch('https://pokeapi.co/api/v2/pokemon/pikachu');
const pichu = fetch('https://pokeapi.co/api/v2/pokemon/pichu');
const clefairy = fetch('https://pokeapi.co/api/v2/pokemon/clefairy');

const observerConfig = { childList: true, subtree: true };

function addHiddenClass (elm) {
  if (!elm.classList.contains('hidden')) {
    elm.classList.add('hidden')
  }
  return elm
}

function removeHiddenClass (elm) {
  elm.classList.remove('hidden');
  return elm
}

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
  const pokemonCards = Array.from(document.querySelectorAll('.pokemon-card'));
  const filteredOutCards = pokemonCards.filter((card) => card.dataset.weightType !== weight);
  filteredOutCards.forEach((card) => addHiddenClass(card))
  const filteredCards = pokemonCards.filter((card) => card.dataset.weightType === weight)
  filteredCards.forEach((card) => removeHiddenClass(card));
  updateDisplay()
}

function updateDisplay() {
  handlePokeWeights();
}

function createPokemonAbilities(data) {
  const abilitiesDiv = document.createElement('div');
  abilitiesDiv.classList.add('pokemon-abilities')
  const abilitiesText = document.createElement('h3');
  const abilitiesTextNode = document.createTextNode('Abilities');
  abilitiesText.appendChild(abilitiesTextNode);
  abilitiesText.classList.add('med-text');
  abilitiesDiv.appendChild(abilitiesText);
  for (index in data.abilities) {
    const newP = document.createElement('p');
    const newPNode = document.createTextNode(`${data.abilities[index].ability.name}`);
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
  const thisData = data.types;
  pokeTypesTitle.classList.add('med-text');
  pokeTypesTitle.append(pokeTypesTitleNode);
  pokeTypes.appendChild(pokeTypesTitle);
  pokeTypes.classList.add('pokemon-types');
  if (thisData.length === data.abilities.length) {
    for (let i = 0; i < thisData.length; i++) {
      const pokeType = document.createElement('p');
      const pokeTypeNode = document.createTextNode(`${thisData[i].type.name}`);
      pokeType.setAttribute('type', thisData[i].type.name);
      pokeType.appendChild(pokeTypeNode);
      pokeType.classList.add('small-text');
      pokeTypes.appendChild(pokeType);
    }
  } else {
    for (let i = 0; i < data.abilities.length; i++) {
      const pokeType = document.createElement('p');
      const pokeTypeNode = document.createTextNode(`${data.types[0].type.name}`);
      pokeType.setAttribute('type', thisData[0].type.name);
      pokeType.appendChild(pokeTypeNode);
      pokeType.classList.add('small-text');
      pokeTypes.appendChild(pokeType);
    }
  }
  return pokeTypes;
}

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
  pokeImg.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;
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
  const pokeAtkNode = document.createTextNode('ATK: ' + data.stats[1].base_stat);
  const pokeHpNode = document.createTextNode('HP: ' + data.stats[0].base_stat);
  const pokeDefNode = document.createTextNode('DEF: ' + data.stats[2].base_stat);
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
  const pokeNameNode = document.createTextNode(`${data.name}`);
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

function combineAbilitiesTypes(ability, type) {
  const newDiv = document.createElement('div');
  newDiv.classList.add('pokemon-abilities-types')
  newDiv.appendChild(ability);
  newDiv.appendChild(type);
  return newDiv;
}

const defaultCompare = (a, b) => {
  return a.dataset.name.toString().localeCompare(b.dataset.name.toString());
}

function handlePokemonNameSorting(direction, pokeCards) {
  pokeCards.sort(defaultCompare);
  direction === 'dec' 
  ? pokeCards
  : pokeCards.reverse();
}

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
  const pokeCards = document.querySelectorAll('.pokemon-card');
  pokeCards.forEach((card) => removeHiddenClass(card))
  const localPokeCards = JSON.parse(localStorage.getItem('pokemon'));
  loadLocalPokemon(localPokeCards);
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
  console.log('fav-attempt')
  const fav = 'is-fav';
  const heartBtn = document.getElementById(id);
  if (heartBtn !== undefined) {
    heartBtn.classList.contains(fav)
    ? heartBtn.classList.remove(fav)
    : heartBtn.classList.add(fav);
  }
}

function toggleDelete(e) {
  console.log('attempting to delete')
  const card = e.parentElement.parentElement.parentElement;
  const cardName = card.dataset.name;
  const curLocalPokemon = JSON.parse(localStorage.getItem('pokemon'));
  const cardNameIndex = curLocalPokemon.indexOf(cardName);
  curLocalPokemon.splice(cardNameIndex, 1);
  localStorage.setItem('pokemon', JSON.stringify(curLocalPokemon));
  card.parentElement.removeChild(card);
  updateDisplay();
}

function handleFavPokemonLs(e) {
  const card = e.parentElement.parentElement;
  const curLocal = JSON.parse(localStorage.getItem('fav-pokemon'));
  const cardId = card.dataset.pokeId;
  if (curLocal === null) {
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

function updatePokemonLs() {
  const pokemonArray = Array.from(document.querySelectorAll('.pokemon-card'));
  const pokemonNames = [];
  pokemonArray.forEach((pokemon) => pokemonNames.push(pokemon.dataset.name))
  localStorage.setItem('pokemon', JSON.stringify(pokemonNames))
}

function addPokemonWeightType(pokeCards, data) {
  for (card of pokeCards) {
    const weight = parseInt(data.weight, 10);
    if (weight < 100) {
      card.dataset.weightType = light;
    } else if (weight >= 100 && weight <= 500) {
      card.dataset.weightType = average;
    } else {
      card.dataset.weightType = heavy;
    }
  }
  return pokeCards;
}

function handleSinglePokemon(data) {
  const pokeCard = document.createElement(`div`);
  pokeCard.classList.add('pokemon-card');
  pokeCard.setAttribute('id', data.id)
  pokeCard.dataset.name = data.name;
  pokeCard.dataset.pokeId = data.id;
  pokeCard.dataset.hp = data.stats[0].base_stat;
  pokeCard.dataset.atk = data.stats[1].base_stat;
  pokeCard.dataset.def = data.stats[2].base_stat;
  pokeCard.dataset.weight = data.weight;
  const weight = parseInt(data.weight, 10);
  if (weight < 100) {
    pokeCard.dataset.weightType = 'light';
  } else if (weight >= 100 && weight <= 500) {
    pokeCard.dataset.weightType = 'average';
  } else {
    pokeCard.dataset.weightType = 'heavy';
  }
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

function createPokemonCards(thisData) {
  const pokeCards = [];
  if (!Array.isArray(thisData)) {
    const pokeCard = handleSinglePokemon(thisData);
    return pokeCard
  } else {
    for (data of thisData) {
      const pokeCard = handleSinglePokemon(data);
      pokeCards.push(pokeCard);
    }
    return pokeCards;
  }
}

// checks for fav pokemon adds the is-fav class
function checkFavPokemonLs(card) {
  const thisCard = card;
  const thisBtn = thisCard.querySelector('.heart-icon');
  const favPokeIds = JSON.parse(localStorage.getItem('fav-pokemon'));
  if (favPokeIds !== null) {
    if (favPokeIds.length > 1) {
      for (let i = 0; i < favPokeIds.length; i++) {
        if (favPokeIds[i] === thisBtn.getAttribute('id')) {
          toggleFav(thisBtn.getAttribute('id'));
        }
      }
    } else {
      toggleFav(favPokeIds[0]);
    }
  }
}

//Displays pokemon on screen updates pokemon ls
function addPokemonCard(data) {
  const pokemon = document.querySelector('div.pokemon');
  const pokemonCards = createPokemonCards(data);
  for (card of pokemonCards) {
    checkFavPokemonLs(card);
    pokemon.appendChild(card);
  }
  updateDisplay();
  updatePokemonLs();
  return data;
}


// Adds new pokemon from search and updates ls if prompted
function addPokemonCardSearch(data, updateLocal) {
  const pokemon = document.querySelector('div.pokemon');
  const prevPokemonCards = Array.from(document.querySelectorAll('.pokemon-card'));
  const pokemonCard = createPokemonCards(data);
  prevPokemonCards.push(pokemonCard);
  pokemon.innerHTML = '';
  prevPokemonCards.forEach((card) => {
    pokemon.appendChild(card);
  })
  if (updateLocal) {
    updatePokemonLs(pokemonCard);
  }
  updateDisplay();
  return data;
}

function handleOnclickApiSearch () {
  const pokemon = document.getElementById('poke-search');
  findPokemon(pokemon.value, true)
}
// returns pokemon data from api
function findPokemon(input, updateLocal) {
  return new Promise(function(resolve, reject){
    const pokeApiSearch = `https://pokeapi.co/api/v2/pokemon/${input}`;
    fetch(pokeApiSearch)
      .then((response) => response.json())
      .then((response) => addPokemonCardSearch(response, updateLocal))
      .then(handlePokeSearch())
      .catch((error) => {
        const pokemonTextContainer = document.getElementById('pokemon-search-result');
        pokemonTextContainer.innerHTML = '';
        const failedPokemonText = document.createTextNode(`Failed to find ${input}`)
        pokemonTextContainer.appendChild(failedPokemonText);
        return error;
      });
  })
}

// loads requested pokemon on screen
function loadLocalPokemon(curLocalPokemon) {
  const pokemonContainer = document.querySelector('.pokemon');
  pokemonContainer.innerHTML = '';
  const pokemonArray = curLocalPokemon;
  if (Array.isArray(pokemonArray)) {
    pokemonArray.map((pokemon) => findPokemon(pokemon, false))
    const pokemonCards = addPokemonCard(pokemonArray);
    pokemonCards.forEach((pokemon) => pokemonContainer.appendChild(pokemon));
    addEventListenersForHeart();
  } else {
    const pokemon = findPokemon(pokemonArray, false);
    const pokemonCard = addPokemonCard(pokemon);
    pokemonContainer.appendChild(pokemonCard);
    addEventListenersForHeart();
  }
  updateDisplay();
}

function handlePokemonOnLoad(data) {
  const curLocalPokemon = JSON.parse(localStorage.getItem('pokemon'))
  curLocalPokemon === null ? addPokemonCard(data) : loadLocalPokemon(curLocalPokemon);
}

async function handlePokeSearch() {
  const pokemon = document.getElementById('poke-search');
  const curPokemon = JSON.parse(localStorage.getItem('pokemon'))
  const pokemonTextContainer = document.getElementById('pokemon-search-result');
  let duplicatePokemonText = '';
  if (curPokemon.includes(pokemon.value)) {
    duplicatePokemonText = document.createTextNode(`You already have ${pokemon.value} :)`);
  } else {
    duplicatePokemonText = document.createTextNode(`You have chosen ${pokemon.value}`);
  }
  pokemonTextContainer.innerHTML = '';
  pokemonTextContainer.appendChild(duplicatePokemonText);
}

function handlePokedexSearch() {
  const pokemonSearch = document.getElementById('pokedex-search');
  const curPokemonArray = JSON.parse(localStorage.getItem('pokemon'));
  const possiblePokemonArray = [];
  for (let pokemon of curPokemonArray) {
    if (pokemon.includes(pokemonSearch.value)) {
      possiblePokemonArray.push(pokemon);
    }
  }
  if (pokemonSearch.value === '') {
    loadLocalPokemon(curPokemonArray);
  }
  return loadLocalPokemon(possiblePokemonArray);
}
  


Promise
  .all([bulbasaur, ivysaur, venusaur, charmander, charmeleon, charizard, squirtle, wartortle, blastoise, pikachu, pichu, clefairy])
  .then((response) => {
    return Promise.all(response.map((res) => res.json()));
  })
  .then((data) => {
    return handlePokemonOnLoad(data);
  })
  .catch((error) => error);
eventPokemonStats();
addEventListenersForHeart();
<script lang="ts">
import { onMount } from 'svelte';
import Tailwind from './Tailwind.svelte';
import Button from './components/button/Button.svelte';
import Card from './components/card/Card.svelte';
import ActiveBreakpointIndicator from './components/debug/ActiveBreakpointIndicator.svelte';
import InputStepper from './components/InputStepper/InputStepper.svelte';
import Switch from './components/switch/Switch.svelte';
import { CardModel, GameCompletedCardModel } from './models/CardModel';
import { ItemType } from './models/Enums';

const emptyCard = new CardModel({});

let loadedCards: CardModel[] = [];
let selectedCards: CardModel[] = [];
let gameCards: CardModel[] = [];
let verifiedCards: CardModel[] = [];
let currentCard: CardModel = emptyCard;
let numberOfCardsToPlayWith = 5;
let currentCardIndex = 0;
let levelToLoad;
let radicalsToggle = false;
let kanjisToggle = false;
let vocabularyToggle = false;
let areCardTypeSelectorsEnabled = false
let loadedLevels: number[] = [];
let isGameMode = false;

// onMount(() => {});

$: {
  areCardTypeSelectorsEnabled = loadedCards.length > 0;
}

function loadLevel() {
  if(loadedLevels.indexOf(levelToLoad) >= 0){
    return;
  }

  fetch(`/japanese-${(''+levelToLoad).padStart(2,'0')}.json`)
    .then(response => response.json())
    .then(data => {
      loadedCards = loadedCards.concat(data.filter((card: any) => card.character.length > 0).map((o: any) => new CardModel(o)));
      selectCards(loadedCards);
      loadedLevels = [levelToLoad, ...loadedLevels];
    })
    .catch(e => console.log(e));
}
function resetLevels() {
  currentCard = emptyCard;
  currentCardIndex = 0;

  loadedCards = [];
  loadedLevels = [];
  selectedCards = [];
  gameCards = [];

  radicalsToggle = false;
  kanjisToggle = false;
  vocabularyToggle = false;
}

function switchCard(direction: number){
  let len = isGameMode
    ? gameCards.length
    : selectedCards.length;

  if(!isGameMode) {
    //  'browse' mode: next and previous
    if(selectedCards.length == 0) {
      return;
    }
    if(direction > 0) {
      if(currentCardIndex >= len - 1) {
        currentCardIndex = 0;
      } else {
        currentCardIndex++;
      }
    } else {
      if(currentCardIndex == 0) {
        currentCardIndex = len-1;
      } else {
        currentCardIndex--;
      }
    }
  } else {   
    if(currentCard.isFullyVerified()) {
      verifiedCards = [...verifiedCards, ...gameCards.slice(currentCardIndex, currentCardIndex + 1)];
      gameCards = [...gameCards.slice(0, currentCardIndex), ...gameCards.slice(currentCardIndex + 1)];
    }

    len = gameCards.length;
    if(currentCardIndex >= len - 1) {
      currentCardIndex = 0;
    } else {
      currentCardIndex++;
    }
  }

  selectCard(currentCardIndex);
}

function selectCards(list: CardModel[]){
  selectedCards = [];
  currentCardIndex = 0;
  if(radicalsToggle){
    selectedCards = [...list.filter((o) => o.Type === ItemType.Radical)];
  }
  if(kanjisToggle){
    selectedCards = [...selectedCards, ...list.filter((o) => o.Type === ItemType.Kanji)]
  }
  if(vocabularyToggle){
    selectedCards = [...selectedCards, ...list.filter((o) => o.Type === ItemType.Vocabulary)]
  }
  selectCard(currentCardIndex);
}

function selectCard(index: number) {  
  if(isGameMode){
    if(gameCards.length > 0){
      currentCard = gameCards[index];
      currentCardIndex = index;
    }else{
      // show end of game card
      const gameCompletedCard = new GameCompletedCardModel(verifiedCards);
      resetGame();
      currentCard = gameCompletedCard;
      currentCardIndex = -1;
    }
  }else{
    if(selectedCards.length > 0){
      currentCard = selectedCards[index];
      currentCardIndex = index;
    }else{
      currentCard = emptyCard;
      currentCardIndex = -1;
    }
  }
}

function play(){
  isGameMode = true;
  let tmp = [...selectedCards];
  let len = tmp.length;
  let list = [];

  //  select cards for the game
  for(let i = 0; i < numberOfCardsToPlayWith; i++){
    let o = tmp.splice(~~(Math.random() * len), 1)[0].Clone();
    switch(o.Type){
      case ItemType.Radical:
        list.push(o);// meaning
        break;
      case ItemType.Kanji:
        list.push(o);// meaning
        break;
      case ItemType.Vocabulary:
        list.push(o);// meaning
        break;
    }
    list.push();
    len = tmp.length;
  }

  gameCards = [...list];
  selectCard(0);
}

function resetGame(){
  isGameMode = false;
  gameCards = [];
  verifiedCards = [];
  selectCard(0);
}
</script>

<style>
  :root {
    --svelte-rgb: 255, 62, 0;
  }
</style>

<Tailwind />

<main class="text-center p-4 mx-0 w-screen">
  <div class="flex justify-start items-center h-12">
    <div class="inline-block w-1/5 space-y-2 flex-grow-0"></div>
    <div class="flex justify-center items-center w-2/5 mx-4 mt-2 space-x-2">
      {#if selectedCards.length > 0}
      <InputStepper class="w-16" bind:value={numberOfCardsToPlayWith} min="1" max={selectedCards.length} compact disabled={isGameMode} />
      <Button text="Play game" disabled={isGameMode} iconLeft={false} primary fill="fill-transparent" stroke="stroke-current" on:click={play}>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </Button>
      <Button text="Reset" disabled={!isGameMode} fill="fill-transparent" stroke="stroke-current" on:click={resetGame}>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </Button>
      {/if}
    </div>
  </div>
  <div class="flex justify-start items-center">
    <div class="inline-block w-1/5 space-y-2 flex-grow-0">
      <div class="flex space-x-2">
        <div class="inline-flex p-2 rounded-lg relative items-center bg-gray-100 text-gray-600">
          <input type="text" placeholder="level" class="bg-transparent outline-none text-base px-1 text-right w-10" bind:value={levelToLoad}>
        </div>
        <Button text="Load level" iconLeft={false} secondary fill="fill-transparent" stroke="stroke-current" on:click={loadLevel}>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </Button>
        <Button text="Reset levels" fill="fill-transparent" stroke="stroke-current" on:click={resetLevels}>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </Button>
      </div>
      <div class="flex flex-col justify-start w-1/3">
        <Switch type="toggle" id="radical" text="Radicals" disabled={!areCardTypeSelectorsEnabled} bind:checked={radicalsToggle} on:switch::click={() => selectCards(loadedCards)} />
        <Switch type="toggle" id="kanji" text="Kanjis" disabled={!areCardTypeSelectorsEnabled} bind:checked={kanjisToggle} on:switch::click={() => selectCards(loadedCards)} />
        <Switch type="toggle" id="vocabulary" text="Vocabulary" disabled={!areCardTypeSelectorsEnabled} bind:checked={vocabularyToggle} on:switch::click={() => selectCards(loadedCards)} />
      </div>
      <div class="text-left">
        <h3>Stats</h3>
        <ul>
          <li>Loaded levels: {#if loadedLevels.length > 0}{loadedLevels.join(',')}{:else}NONE{/if}</li>
          <li>Cards selected: {selectedCards.length}</li>
          <li>Mode: {#if isGameMode}GAME{:else}BROWSE{/if}</li>
        </ul>
      </div>
    </div>
    <div class="w-2/5 mx-4 mt-4">
      {#if currentCard}
      <Card card={currentCard} question={currentCard.nextQuestion()} browse={!isGameMode} on:card::next={() => switchCard(1)} on:card::previous={() => switchCard(-1)}/>
      {/if}
    </div>
    <div class="inline-block w-max space-y-2 text-left bg-teal-300">
      {#if selectedCards.length > 0}
      <p>Index: {currentCardIndex}<br>Play with {numberOfCardsToPlayWith} cards<br>cards: {selectedCards.length}<br>game cards (questions): {gameCards.length}</p>
      {/if}
    </div>
  </div>
</main>
<ActiveBreakpointIndicator />
<script lang="ts">
import { onMount } from 'svelte';
import Tailwind from './Tailwind.svelte';
import Button from './components/button/Button.svelte';
import Card from './components/card/Card.svelte';
import ActiveBreakpointIndicator from './components/debug/ActiveBreakpointIndicator.svelte';
import InputStepper from './components/InputStepper/InputStepper.svelte';
import Switch from './components/switch/Switch.svelte';
import { CardModel } from './models/CardModel';
import { ItemType } from './models/Enums';

onMount(() => {
});

const emptyCard = new CardModel({});
let question = 'meaning';
function switchSubtype(){
  question = question === 'meaning' ? question='on-yomi' : 'meaning';
}

let loadedCards: CardModel[] = [];
let selectedCards = [];
let gameCards: CardModel[] = [];
let currentCard: CardModel = emptyCard;
let numberOfCardsToPlayWith = 5;
let currentCardIndex = 0;
let levelToLoad = 7;

function loadLevel() {
  fetch(`/japanese-${(''+levelToLoad).padStart(2,'0')}.json`)
    .then(response => response.json())
    .then(data => {
      loadedCards = loadedCards.concat(data.filter((card: any) => card.character.length > 0).map((o: any) => new CardModel(o)));
      selectCards(loadedCards);
      if(selectCards.length > 0){
        currentCard = selectedCards[currentCardIndex];
      }else{
        currentCard = emptyCard;
      }
    })
    .catch(e => console.log(e));
}
function resetLevels() {
  currentCard = emptyCard;
  loadedCards = [];
  selectedCards = [];
  gameCards = [];
}

function switchCard(direction: number){
  let len = isPlayButtonEnabled
    ? gameCards.length
    : selectedCards.length;
  
  if(isPlayButtonEnabled && gameCards.length == 0){
    return;
  }
  if(!isPlayButtonEnabled && selectedCards.length == 0){
    return;
  }

  // console.log('switchCard::pre', direction, currentCardIndex);
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
  // console.log('switchCard::post', direction, currentCardIndex);

  if(isPlayButtonEnabled){
    currentCard = gameCards[currentCardIndex];
  }else{
    currentCard = selectedCards[currentCardIndex];
  }
}

function selectCards(list: CardModel[]){
  selectedCards = [];
  if(radicalsToggle){
    selectedCards = list.filter((o) => o.Type === ItemType.Radical);
  }
  if(kanjisToggle){
    selectedCards = [...selectedCards, ...list.filter((o) => o.Type === ItemType.Kanji)]
  }
  if(vocabularyToggle){
    selectedCards = [...selectedCards, ...list.filter((o) => o.Type === ItemType.Vocabulary)]
  }  
  currentCard = selectedCards[0];
}


let radicalsToggle = true;
let kanjisToggle = true;
let vocabularyToggle = true;
let isPlayButtonEnabled = false;

function play(){
  isPlayButtonEnabled = true;
  let tmp = [...selectedCards];
  let len = tmp.length;
  let list = [];
  //  select the cards for the game
  for(let i = 0; i< numberOfCardsToPlayWith; i++){
    let o = tmp.splice(~~(Math.random() * len), 1)[0];
    switch(o.type){
      case ItemType.Radical:
        list.push(o);
        break;
    }
    list.push();
    //game = [...game, tmp.splice(~~(Math.random() * len), 1)[0]];
    len = tmp.length;
  }
  //  duplicate them based on questions available per cards
  //  i.e. Radicals = 1, Kanjis = 2, Vocabulary = 2
  for(let i = 0; i < list.length; i++){

  }
  currentCardIndex = 0;
  currentCard = gameCards[0];
}
function reset(){
  isPlayButtonEnabled = false;
  currentCardIndex = 0;
  currentCard = selectedCards[0];
  gameCards = [];
}
</script>

<Tailwind />

<main class="text-center p-4 mx-0 w-screen flex justify-center items-center">
  <div class="inline-block w-1/6 space-y-2">
    <div class="flex flex-col justify-start w-1/3">
      <Switch type="toggle" id="radical" text="Radicals" bind:checked={radicalsToggle} on:switch::click={() => selectCards(loadedCards)} />
      <Switch type="toggle" id="kanji" text="Kanjis" bind:checked={kanjisToggle} on:switch::click={() => selectCards(loadedCards)} />
      <Switch type="toggle" id="vocabulary" text="Vocabulary" bind:checked={vocabularyToggle} on:switch::click={() => selectCards(loadedCards)} />
    </div>
    <div class="flex space-x-2">
      <div class="inline-flex p-2 rounded-lg relative items-center bg-gray-100 text-gray-600">
        <input type="text" placeholder="level" class="bg-transparent outline-none text-base px-1 text-right w-10" bind:value={levelToLoad}>
      </div>
      <Button text="Load level" iconLeft={false} fill="fill-transparent" stroke="stroke-current" on:click={loadLevel}>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </Button>
    </div>
    <div class="flex space-x-2">
      <Button text="Reset levels" fill="fill-transparent" stroke="stroke-current" on:click={resetLevels}>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </Button>
    </div>
  </div>
  <div class="w-2/6 mx-4 mt-4">
    {#if currentCard}
    <Card card={currentCard} {question} browse={!isPlayButtonEnabled} on:card::next={() => switchCard(1)} on:card::previous={() => switchCard(-1)}/>
    {/if}
  </div>
  <div class="inline-block w-1/6 space-y-2 text-left">
    <InputStepper class="w-16" bind:value={numberOfCardsToPlayWith} min="1" max={selectedCards.length} compact disabled={isPlayButtonEnabled} />
    <div class="flex space-x-2">
      <Button text="Reset" fill="fill-transparent" stroke="stroke-current" on:click={reset}>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </Button>
      <Button text="Play game" disabled={isPlayButtonEnabled} iconLeft={false} primary fill="fill-transparent" stroke="stroke-current" on:click={play}>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </Button>
    </div>
  </div>
  <div class="inline-block w-max space-y-2 text-left">
    <p>Index: {currentCardIndex}<br>Play with {numberOfCardsToPlayWith} cards<br>cards: {selectedCards.length}<br>game cards (questions): {gameCards.length}</p>
  </div>
</main>
<ActiveBreakpointIndicator />
<style>
  :root {
    --svelte-rgb: 255, 62, 0;
  }
</style>
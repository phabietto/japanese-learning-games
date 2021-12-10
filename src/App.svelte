<script lang="ts">
import { onMount } from 'svelte';
import Button from './components/button/Button.svelte';

import Card from './components/card/Card.svelte';
import ActiveBreakpointIndicator from './components/debug/ActiveBreakpointIndicator.svelte';
import InputStepper from './components/InputStepper/InputStepper.svelte';
import Switch from './components/switch/Switch.svelte';
import { ItemType } from './models/Enums';
import Tailwind from './Tailwind.svelte';

let question = 'meaning';
function switchSubtype(){
  question = question === 'meaning' ? question='on-yomi' : 'meaning';
}

let allCards = [];
let cards = [];
let game = [];
let card;
let numberOfCardsToPlayWith = 5;
let currentCardIndex = 0;

function switchCard(){
  let len = isPlayButtonEnabled
    ? game.length
    : cards.length;
  
  //console.log(`switchCard: ${currentCardIndex}, ${len}. Are we playing ? ${isPlayButtonEnabled}`);

  if(currentCardIndex >= len - 1){
    currentCardIndex = 0;
  }else{
    currentCardIndex++;
  }

  if(isPlayButtonEnabled){
    card = game[currentCardIndex];
  }else{
    card = cards[currentCardIndex];
  }
}

onMount(() => {
  fetch('/src/data/japanese-07.json')
    .then(response => response.json())
    .then(data => {
      allCards = data.filter((card) => card.character.length > 0);
      selectCards(allCards);
      card = cards[currentCardIndex];
    })
    .catch(e => console.log(e));
});

let radicalsToggle = true;
let kanjisToggle = true;
let vocabularyToggle = true;
function selectCards(list){
  cards = [];
  if(radicalsToggle){
    cards = list.filter((o) => o.type === ItemType.Radical);
  }
  if(kanjisToggle){
    cards = [...cards, ...list.filter((o) => o.type === ItemType.Kanji)]
  }
  if(vocabularyToggle){
    cards = [...cards, ...list.filter((o) => o.type === ItemType.Vocabulary)]
  }  
  card = cards[0];
}

let isPlayButtonEnabled = false;
function play(){
  isPlayButtonEnabled = true;
  let tmp = [...cards];
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
  card = game[0];
}
function reset(){
  isPlayButtonEnabled = false;
  currentCardIndex = 0;
  card = cards[0];
  game = [];
}
</script>

<Tailwind />

<main class="text-center p-4 mx-0 w-screen flex justify-center items-center">
  <div class="inline-block w-max space-y-2 text-left">
    <div class="flex flex-col justify-center min-w-max">
      <Switch type="toggle" id="radical" text="Radicals" bind:checked={radicalsToggle} on:switch::click={() => selectCards(allCards)} />
      <Switch type="toggle" id="kanji" text="Kanjis" bind:checked={kanjisToggle} on:switch::click={() => selectCards(allCards)} />
      <Switch type="toggle" id="vocabulary" text="Vocabulary" bind:checked={vocabularyToggle} on:switch::click={() => selectCards(allCards)} />
    </div>
    <InputStepper class="w-16" bind:value={numberOfCardsToPlayWith} min="1" max={cards.length} compact disabled={isPlayButtonEnabled} />
    <div class="flex space-x-2">
      <Button text="Reset" on:click={reset}>
        <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
      </Button>
      <Button text="Play game" disabled={isPlayButtonEnabled} iconLeft={false} primary on:click={play}>
        <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
      </Button>
    </div>
  </div>
  {#if card}
  <Card data={card} {question} browse={!isPlayButtonEnabled} on:card::next={switchCard}/>
  {/if}
  <p>Index: {currentCardIndex}<br>Play with {numberOfCardsToPlayWith} cards<br>cards: {cards.length}<br>game cards (questions): {game.length}</p>
</main>
<ActiveBreakpointIndicator />
<style>
  :root {
    --svelte-rgb: 255, 62, 0;
  }

</style>
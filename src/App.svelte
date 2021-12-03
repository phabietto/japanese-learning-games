<script lang="ts">
import { onMount } from 'svelte';

import Card from './components/card/Card.svelte';
import ActiveBreakpointIndicator from './components/debug/ActiveBreakpointIndicator.svelte';
import Switch from './components/switch/Switch.svelte';
import Tailwind from './Tailwind.svelte';

let question = 'meaning';
function switchSubtype(){
  question = question === 'meaning' ? question='on-yomi' : 'meaning';
}

let allCards = [];
let cards = [];
let card;
let currentCardIndex = 0;
function switchCard(){
  if(currentCardIndex == cards.length){
    currentCardIndex = 0;
  }else{
    currentCardIndex++;
  }
  card = cards[currentCardIndex];
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
    cards = list.filter((o) => o.type === 'radicals');
  }
  if(kanjisToggle){
    cards = [...cards, ...list.filter((o) => o.type === 'kanji')]
  }
  if(vocabularyToggle){
    cards = [...cards, ...list.filter((o) => o.type === 'vocabulary')]
  }  
  card = cards[0];
}
</script>

<Tailwind />

<main class="text-center p-4 mx-0 w-screen flex justify-center items-center">
  <div class="inline-block w-max">
    <div class="flex flex-col justify-center min-w-max">
      <Switch type="toggle" id="radical" text="Radicals" bind:checked={radicalsToggle} on:switch::click={() => selectCards(allCards)} />
      <Switch type="toggle" id="kanji" text="Kanjis" bind:checked={kanjisToggle} on:switch::click={() => selectCards(allCards)} />
      <Switch type="toggle" id="vocabulary" text="Vocabulary" bind:checked={vocabularyToggle} on:switch::click={() => selectCards(allCards)} />
    </div>
  </div>
  {#if card}
  <Card data={card} {question} on:card::next={switchCard}/>
  {/if}
    <p>{cards.length}</p>
</main>
<ActiveBreakpointIndicator />
<style>
  :root {
    --svelte-rgb: 255, 62, 0;
  }

</style>
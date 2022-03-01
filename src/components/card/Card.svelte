<script type="ts">
import { ColorsHelper } from "../../helpers/colors";
import { createEventDispatcher, onMount, tick } from "svelte";
import LinkTo from "../link-to/LinkTo.svelte";
import * as wanakana from "wanakana";
import { CardModel } from "../../models/CardModel";
import { CardSubType } from "../../models/Enums";

export let card: CardModel = new CardModel({});
export let question: CardSubType = CardSubType.None;
export let browse = true;

const ch = new ColorsHelper();
const dispatcher = createEventDispatcher();

let colors = ch.getCardColor('');
let browsing = '';
let answer = '';
let textInput;
let flipClass = '';
let questionText: string;
let answerClass ='bg-gray-100';
let isChecked = false;
let isCorrect = false;

// onMount(()=>{
//     console.log('onmount');
//     textInput = document.getElementById('wanakana_input');
// });

$: {
    console.log('reacted!');
    reset();
    handleFocus();
    colors = ch.getCardColor(card.Type);
    browsing = browse ? 'h-full' : 'h-60';
}

async function handleFocus() {
    await tick();
    textInput = document.getElementById('wanakana_input');
    if(textInput) {
        const isBound = textInput.getAttribute('data-wanakana-id') != null;
        console.log(isBound);
    
        if(question == CardSubType.Meaning || question == CardSubType.None){
            if(isBound){
                wanakana.unbind(textInput);
                console.log('unbinding wanakana');
            }
        }else{
            if(!isBound){
                console.log('binding wanakana');
                wanakana.bind(textInput);
            }
        }
    }
}
function checkAnswer(e: KeyboardEvent) { 
    if(e.code === 'Enter') {
        //  if answer was correct you can go to the next card by pressing 'Enter'
        if(isChecked && isCorrect){
            nextCard();
        }

        const isBound = textInput.getAttribute('data-wanakana-id') != null;
        isChecked = true;
        isCorrect = card.verify(question, isBound ? wanakana.toKana(answer) : answer);
        if(!isCorrect) {
            console.log('suggestion:', card.getSuggestion(question));
        }
        //console.log('answer', card.verify(question, isBound ? wanakana.toKana(answer) : answer));
        // isChecked = true;
        // isCorrect = true;
        // nextCard();
        //if we checked the answer and it's correct let's move to the next question
        // if(isChecked && isCorrect){
        //     nextCard();
        //     return;
        // }

        // const lowercaseAnswer = answer.toLowerCase().trim();
        // const acceptedAnswers = [];
        // acceptedAnswers.push(card['primary']);
        // acceptedAnswers.concat(card['alternatives']);
        // if(question === 'meaning'){
        //     if(acceptedAnswers.filter((o) => o.toLowerCase().trim() === lowercaseAnswer).length > 0){
        //         isCorrect = true;
        //     }
        // }else if(card[question] === wanakana.toKana(textInput.value)) {
        //     isCorrect = true;
        // }
        // isChecked = true;
    }else{
        isChecked = false;
    }
}
function flip() {
    if(browse || (isChecked && isCorrect)) {
        flipClass = flipClass.length > 0 ? '' : 'card--rotate';
    }
}
function reset() {
    answer = '';
    isChecked = false;
    switch(question){
        case CardSubType.Meaning:
            questionText = `${card.Type} Meaning`;
            break;
        case CardSubType.KunYomi:
        case CardSubType.OnYomi:
        case CardSubType.Reading:
            questionText = `${card.Type} Reading`;
            break;
        default:
            questionText = '-- no question --';
    }
}
function nextCard(){
    if(browse || (isChecked)){
        isCorrect = false;
        isChecked = false;
        dispatcher('card::next');
    }
}
function previousCard(){
    if(browse){
        dispatcher('card::previous');
    }
}
</script>

<style>
    .scene { perspective: 1000px; height: 400px;}
    .card { 
        transition: .8s ease-in-out;width: 100%;height: 100%;
        transform-style: preserve-3d;
    }
    .card--front,.card--back { position: absolute;backface-visibility: hidden;width: 100%;height: 100%;z-index: 0;}
    .card--back {transform: rotateY(180deg);}
    .card--rotate .card {transform: rotateY(180deg);}
    .card--rotate .card--back {transform: rotateY(180deg);z-index: 1;}
    .dots button::before {
        font-size: 24px;
        line-height: 20px;
        position: absolute;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        content: '•';
        text-align: center;
        opacity: .25;
        color: black;
    }
    .dots:hover button::before,
    .dots-selected button::before {
        opacity: 1;
        color: black;
        transition: all .4s ease-in-out;
    }
</style>

<div class="{flipClass} scene inline-block w-full bg-gray-50">
    <div class="card">
        <div class="card--front shadow-lg flex flex-col">
            <div class="{browsing} min-w-full bg-gradient-to-br {colors} flex justify-center items-center relative cursor-pointer"
                 title="Double-click to flip card"     
                 on:dblclick={flip}>
                <h1 class="font-normal text-7xl text-white select-none">{card.Character}</h1>
                {#if browse}
                <div class="text-white absolute left-4 cursor-pointer rounded-full bg-white bg-opacity-5" on:click={previousCard} on:dblclick|preventDefault|stopPropagation>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 transform rotate-180" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="text-white absolute right-4 cursor-pointer rounded-full bg-white bg-opacity-5" on:click={nextCard} on:dblclick|preventDefault|stopPropagation>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                    </svg>
                </div>
                {/if}
            </div>
            {#if !browse}
            <div class="m-4 text-gray-600 flex-grow flex flex-col">
                <div class="flex {answerClass} p-2 min-w-full rounded-lg relative">
                    {#if isChecked}
                        {#if isCorrect}
                        <div class="text-green-600 absolute left-2 top-4">
                            <svg class="w-4 h-4" viewBox="0 0 80 80" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M40 68C55.464 68 68 55.464 68 40C68 24.536 55.464 12 40 12C24.536 12 12 24.536 12 40C12 55.464 24.536 68 40 68ZM56.8805 32.3737C58.0465 31.1966 58.0465 29.2882 56.8805 28.1111C55.7145 26.934 53.824 26.934 52.6579 28.1111L35.0769 45.8588L27.342 38.0506C26.176 36.8735 24.2855 36.8735 23.1195 38.0506C21.9534 39.2277 21.9534 41.1361 23.1195 42.3132L31.5581 50.8318C33.5015 52.7937 36.6523 52.7937 38.5957 50.8318L56.8805 32.3737Z" />
                            </svg>
                        </div>
                        {:else}
                        <div class="text-red-600 absolute left-2 top-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                            </svg>
                        </div>
                        {/if}
                    {/if}
                    <input id="wanakana_input" lang="ja" bind:value={answer} class="bg-transparent px-4 outline-none min-w-full text-center text-2xl" on:keyup={checkAnswer}  type="text" />
                    <div class="text-gray-600 absolute right-1 top-4 cursor-pointer" on:click={nextCard}>
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </div>
                </div>
                <div class="text-gray-400 mt-2 capitalize flex flex-grow flex-col justify-center items-center">{questionText}</div>
            </div>
            {/if}
        </div>
        <div class="card--back shadow-lg flex flex-col">
            <div class="h-60 bg-gray-100 hover:bg-gray-200 flex justify-center items-center relative cursor-pointer" title="Double-click to flip card" on:dblclick={flip}>
                <h1 class="font-normal text-7xl text-gray-800 select-none" on:dblclick|stopPropagation>{card.Character}</h1>
                <div class="absolute top-1 left-1 ">
                    {#each card.Composition as item (item.Character)}
                    <LinkTo title={item.Primary} type={item.Type}>{item.Character}</LinkTo>
                    {/each}
                </div>
            </div>
            <div class="mx-4 my-2 flex-grow">
                {#if question == 'meaning'}
                <div>
                    <div class="font-medium text-base text-gray-800 mb-2">
                        <span class="text-lg font-semibold capitalize">{card.Primary}</span>
                        <span class="text-sm text-gray-500 capitalize">{#each card.Alternatives as alternative}, {alternative}{/each}</span>
                    </div>
                    <p class="font-normal text-gray-600 text-xs mb-4">{@html card.Mnemonic}</p>
                </div>
                {:else if question == 'on-yomi'}
                <div>
                    <div class="font-medium text-base text-gray-800 mb-2">
                        <span class="text-lg font-bold">on'yomi</span>
                        <span class="text-sm text-gray-500">{@html card.OnYomi.join(',')}</span>
                    </div>
                    <p class="font-normal text-gray-600 text-xs mb-4">{@html card.OnYomiMnemonic}</p>    
                </div>
                {:else if question == 'kun-yomi'}
                <div>
                    <div class="font-medium text-base text-gray-800 mb-2">
                        <span class="text-lg font-bold">kun'yomi</span>
                        <span class="text-sm text-gray-500">{@html card.KunYomi.join(',')}</span>
                    </div>
                    <p class="font-normal text-gray-600 text-xs mb-4">{@html card.KunYomiMnemonic}</p>    
                </div>
                {:else}
                <div>
                    <div class="font-medium text-base text-gray-800 mb-2">
                        <span class="text-lg font-bold">reading</span>
                        <span class="text-sm text-gray-500">{@html card.Reading.join(',')}</span>
                    </div>
                    <p class="font-normal text-gray-600 text-xs mb-4">{@html card.ReadingMnemonic}</p>    
                </div>
                {/if}
            </div>            
            <ul class="block text-center min-w-full mb-2 leading-none space-x-1">
                {#if card.Meaning && card.Meaning.length > 0}
                <li title="Meaning" class="dots {question == CardSubType.Meaning?'dots-selected':''} relative inline-block w-4 h-4 cursor-pointer" on:click={() => question = CardSubType.Meaning}>
                    <button type="button" class="block w-4 h-4 border-0 cursor-pointer outline-none bg-transparent text-transparent p-1">1</button>
                </li>
                {/if}
                {#if card.OnYomi && card.OnYomi.length > 0}
                <li title="On'yomi reading" class="dots {question == CardSubType.OnYomi?'dots-selected':''} relative inline-block w-4 h-4 cursor-pointer" on:click={() => question = CardSubType.OnYomi}>
                    <button type="button" class="block w-4 h-4 border-0 cursor-pointer outline-none bg-transparent text-transparent p-1">2</button>
                </li>
                {/if}
                {#if card.KunYomi && card.KunYomi.length > 0}
                <li title="Kun'yomi" class="dots {question == CardSubType.KunYomi?'dots-selected':''} relative inline-block w-4 h-4 cursor-pointer" on:click={() => question = CardSubType.KunYomi}>
                    <button type="button" class="block w-4 h-4 border-0 cursor-pointer outline-none bg-transparent text-transparent p-1">3</button>
                </li>
                {/if}
                {#if card.Reading && card.Reading.length > 0}
                <li title="Reading" class="dots {question == CardSubType.Reading?'dots-selected':''} relative inline-block w-4 h-4 cursor-pointer" on:click={() => question = CardSubType.Reading}>
                    <button type="button" class="block w-4 h-4 border-0 cursor-pointer outline-none bg-transparent text-transparent p-1">3</button>
                </li>
                {/if}
            </ul>
        </div>  
    </div>
  </div>
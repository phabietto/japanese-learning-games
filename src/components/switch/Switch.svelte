<style>
    input:checked ~ .dot {
        @apply transform translate-x-full;
    }
    input:checked + div {
        @apply bg-blue-400;       
    }
    .toggle input[type='checkbox']:focus:not(:disabled) ~ div,
    .toggle input[type='checkbox']:active:not(:disabled) ~ div {
      @apply outline-none ring ring-blue-300;
    }
    .switch input[type='checkbox']:focus:not(:disabled) + .track,
    .switch input[type='checkbox']:active:not(:disabled) + .track {
      @apply outline-none ring ring-offset-2 ring-blue-300;
    }
    input[type='checkbox']:disabled:not(:checked) + .track {
        @apply bg-gray-300;
    }
    input[type='checkbox']:disabled:checked + .track {
        @apply bg-blue-200;
    }
    .disabled {
        @apply cursor-not-allowed;
    }
</style>

<script>
    import { createEventDispatcher } from "svelte";

    export let id = '';
    export let text = '';
    export let checked = false;
    export let disabled = false;
    export let type = 'switch';

    const dispatcher = createEventDispatcher();
    function handleClick(){
        dispatcher('switch::click', checked);
    }
</script>

{#if type === 'toggle'}
<div class="toggle w-full mb-4">  
    <label for={id} class="flex items-center cursor-pointer" class:disabled>
        <div class="relative">
            <input id={id} type="checkbox" class="sr-only" {disabled} bind:checked on:change={handleClick}/>
            <div class="track w-7 h-2 bg-gray-400 rounded-full shadow-inner"></div>
            <div class="dot absolute w-4 h-4 bg-white rounded-full shadow -left-1 -top-1 transition-transform ease-in-out duration-300"></div>
        </div>
        <div class="ml-3 text-gray-600 font-medium">{text}</div>
    </label>
</div>
{:else}
<div class="switch w-full mb-12">
    <label for={id} class="flex items-center cursor-pointer" class:disabled>
      <div class="relative">
        <input id={id} type="checkbox" class="sr-only" {disabled} bind:checked on:change={handleClick}/>
        <div class="track block bg-gray-500 w-10 h-6 rounded-full"></div>
        <div class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ease-in-out duration-300"></div>
      </div>
      <div class="ml-3 text-gray-600 font-medium">{text}</div>
    </label>  
</div>
{/if}
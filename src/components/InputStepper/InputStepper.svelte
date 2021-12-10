<script>
    import { createEventDispatcher, onMount } from "svelte";

    export let value= undefined;
    export let step = 1;
    export let max = undefined;
    export let min = undefined;
    export let readonly = false;
    export let disabled = false;
    export let compact = undefined;
    export  {classes as class};

    const dispatch = createEventDispatcher();

    let classes;
    let inputValue = value;
    let inputPadding = '';

    $: dispatch("change", value);
    $: {value = Number(inputValue);checkMinMax();}
    $: inputPadding = compact ? '' : 'px-6';
    $: if(min || max){
        checkMinMax();
    }

    function updateValue(direction) {
        if(readonly){
            return;
        }

        const nextValue = (value += direction * step);
        if (nextValue < min) {
            value = Number(min);
        } else if (nextValue > max) {
            value = Number(max);
        } else {
            value = nextValue;
        }
    }

    function checkMinMax() {
        if(isMounted){
            if(value < min){
                value = Number(min);
            }
            if(value > max){
                value = Number(max);
            }
        }
    }
    let isMounted = false;
    onMount(()=>{
        isMounted = true;
    });
</script>

<div class="inline-flex p-2 rounded-lg relative items-center bg-gray-100 text-gray-600">
    {#if !compact}
    <button 
        type="button"
        title="Decrement"
        class="spread absolute left-1"
        {disabled}
        on:click={()=>updateValue(-1)}
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
    </button>
    {/if}
    <input 
        type="number"
        pattern="[0-9]*"
        placeholder="cards"
        class="bg-transparent outline-none text-lg text-center {inputPadding} {classes}"
        {max} {min} {step} {value}
        {readonly} {disabled}
        on:change
        on:change={(e) => {
            // @ts-ignore
            inputValue = Number(e.target.value);
        }}
        on:input
        on:input={(e) => {
            // @ts-ignore
            inputValue = Number(e.target.value);
        }}
    >
    {#if compact}
    <div class="compact flex flex-col justify-center">
        <button 
            type="button"
            title="Increment"
            {disabled}
            on:click={()=>updateValue(1)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
            </svg>
        </button>
        <button 
            type="button"
            title="Increment"
            {disabled}
            on:click={()=>updateValue(-1)}
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
        </button>
    </div>
    {/if}
    {#if !compact}
    <button 
        type="button"
        title="Increment"
        class="spread absolute right-1"
        {disabled}
        on:click={()=>updateValue(-1)}
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    </button>
    {/if}
</div>

<style>
    .spread button:not(:disabled):hover svg {fill: rgba(209,213,219,1);}
    .compact button:not(:disabled):hover svg path {stroke-width: 3;}
    /* Chrome, Safari, Edge, Opera */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    /* Firefox */
    input[type=number] {
    -moz-appearance: textfield;
    }
    button:disabled, input:disabled {
        @apply text-gray-400 bg-gray-100 cursor-not-allowed border-gray-200
    }
</style>
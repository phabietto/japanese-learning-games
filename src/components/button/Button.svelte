<script>
    import { onMount } from "svelte";

    export let text = '';
    export let disabled = false;
    export let iconLeft = true;
    export let primary = null;
    export let secondary = null;
    export let fill = 'fill-current';
    export let stroke = 'stroke-transparent';

    const hasSlot = $$props.$$slots && $$props.$$slots !== undefined;

    let iconPosition;
    onMount(() => {
        if(text.length > 0){
            iconPosition = iconLeft
                ? '-ml-1 mr-2'
                : '-mr-1 ml-2';
        }        
    });
</script>

<button 
    type="button" 
    {disabled} 
    class:primary
    class:secondary
    on:click
>
    {#if !iconLeft}
    {text}     
    {/if}
    {#if hasSlot}
    <svg class="{iconPosition} h-5 w-5 {fill} {stroke}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <slot></slot>
    </svg>
    {/if}
    {#if iconLeft}
    {text}     
    {/if}
</button>

<style>
    button {
        @apply text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 focus:ring focus:ring-blue-300 focus:outline-none font-medium rounded-md text-sm px-5 py-2.5 text-center inline-flex items-center
    }
    button.primary {
        @apply text-white bg-blue-500 hover:bg-blue-600
    }
    button.secondary {
        @apply border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white text-center
    }
    button:disabled {
        @apply text-gray-400 bg-gray-100 cursor-not-allowed border-gray-200
    }
    button.primary:disabled {
        @apply text-white bg-blue-400
    }
</style>
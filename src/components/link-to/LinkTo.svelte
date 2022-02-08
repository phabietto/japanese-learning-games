<script>
    import { ColorsHelper } from "../../helpers/colors";
    import { createEventDispatcher, onMount } from "svelte";
    
    export let title = '';
    export let roll = true;
    export let type;

    const dispatcher = createEventDispatcher();
    let showLink = false;
    function handleClick() {
        dispatcher('linkto::click');
        if(roll){
            showLink = !showLink;
        }
    }

    const ch = new ColorsHelper();
    let colors = ch.getItemColor('');
    onMount(() => {
        colors = ch.getItemColor(type);
    });
</script>
<div class="p-1 text-left" {title}>
    <div class="inline-flex items-center bg-white leading-none {colors.Text} rounded-full p-1 shadow text-teal text-sm cursor-pointer" on:click|stopPropagation={handleClick}>
        <span class="inline-flex {colors.Background} text-white rounded-full h-6 w-6 justify-center items-center">
            <slot></slot>
        </span>
        {#if showLink}<span class="inline-flex px-2">{title}</span>{/if}
    </div>
</div>


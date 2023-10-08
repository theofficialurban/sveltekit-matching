<script lang="ts">
    import { base } from "$app/paths";
	import type { CardState, ComponentState, Status } from "$lib/stores/cards";
    import {animate} from 'motion'
	import { flipper } from "../builders/PlayingCard";
	import { blur } from "svelte/transition";
    export let state: ComponentState;
    let className = '';
    export {className as class};
    </script>
    <div use:flipper={state.status} id={state.id.toString()} class='w-[235px] h-[331px]' on:click={() => state.status = state.status === 'FACEDOWN' ? 'FACEUP' : 'FACEDOWN'} role='button' tabindex={state.id} on:keydown>
        {#if state.status === 'FACEDOWN'}
            <img in:blur={{delay:500}} out:blur={{delay: 250, duration: 250}} src={`${base}/playing-card-235x331.png`} alt="Playing Card" />
        {:else if state.status === 'FACEUP'}
            <div in:blur={{delay:500}} out:blur={{duration: 250, delay: 250}} class={`w-[235px] h-[331px] ${className}`}><slot /></div>
        {/if}
        
    </div>
<script lang="ts">
    import type { PageData } from './$types';
    import {shuffle} from 'lodash-es'
    export let data: PageData;
    let ff = [1,2,3,4,5,6,7,8,9,10];
    let gg = shuffle(ff);
    console.log(gg);
</script>
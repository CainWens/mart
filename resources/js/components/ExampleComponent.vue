<template>
    <div class="flex justify-center items-center h-full">
        <div class="focus-in-contract-bck text-9xl text-center soon">
            Coming soon
        </div>
    </div>
</template>

<script>
    export default {
        mounted() {
            console.log('Component mounted.')
            addEventListener("mousewheel", (event) => {console.log(event)});
        }




    }
</script>

<template>
    <div>

    </div>
</template>

<script setup>

import { onMounted } from "vue";

onMounted(() => {
    initExtensionListeners()
})

const initExtensionListeners = () => {
    chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        //No events listeners yet. I kept it to show you how to set it up with Vue onMount even
        if (message.action === "setUserAgent") {
            //Replace this with future event listener
        }
    });
}

</script>

<style scoped>

</style>
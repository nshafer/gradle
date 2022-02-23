<script setup lang="ts">

const props = defineProps(['title']);
const emit = defineEmits(['close']);

function close() {
    emit('close');
}

</script>

<template>
    <transition name="modal-fade">
        <div class="container" @click.self="close">
            <div class="modal">
                <header class="header">
                    {{ title }}
                    <button class="button icon" @click="close">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>
                    </button>
                </header>

                <section class="body">
                    <slot name="body"></slot>
                </section>

                <footer class="footer">
                    <slot name="footer">
                        <button class="footer-close button" @click="close">Close</button>
                    </slot>
                </footer>
            </div>
        </div>
    </transition>
</template>

<style scoped>
.container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    /* padding: 2em; */
    /* background-color: rgba(255, 255, 255, 0.15); */
    backdrop-filter: blur(8px);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    background: var(--gray-5);
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    width: 90%;
    max-width: 50em;
    height: 90%;
}

.header, .footer {
    padding: .5em 1em;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
}

.header {
    border-bottom: 1px solid var(--gray-4);
    color: var(--gray-1);
}

.footer {
    border-top: 1px solid var(--gray-4);
}

.footer-close {
    margin-left: auto;
}

.body {
    position: relative;
    padding: .5em 1em;
    flex: 1;
}

.modal-fade-enter-from, .modal-fade-leave-to {
    opacity: 0;
    transform: translateY(2em);
}

.modal-fade-enter-active, .modal-fade-leave-active {
    transition: all .25s ease;
}
</style>

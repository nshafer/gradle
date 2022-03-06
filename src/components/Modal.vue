<script setup lang="ts">
import IconXMark from './icons/IconXMark.vue';

defineProps(['title']);
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
                    <button class="button icon lg" @click="close">
                        <IconXMark />
                    </button>
                </header>

                <section class="body">
                    <slot name="body"></slot>
                </section>

                <footer class="footer">
                    <slot name="footer">
                    </slot>
                    <!-- <button class="footer-close button" @click="close">Close</button> -->
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
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
}

@supports (backdrop-filter: blur(20px)) or (-webkit-backdrop-filter: blur(20px)) {
    .container {
        background-color: rgba(0, 0, 0, 0.01);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
    }
}

.modal {
    background: var(--gray-5);
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

/* .footer {
    border-top: 1px solid var(--gray-4);
} */

.footer-close {
    margin-left: auto;
}

.body {
    position: relative;
    padding: .5em 1em;
    flex: 1;
    overflow-y: auto;
}

.modal-fade-enter-from, .modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-active, .modal-fade-leave-active {
    transition: all .25s ease;
}

.modal-fade-enter-from .modal, .modal-fade-leave-to .modal {
    opacity: 0;
    transform: translateY(2em);
}

.modal-fade-enter-active .modal, .modal-fade-leave-active .modal {
    transition: all .25s ease;
}
</style>

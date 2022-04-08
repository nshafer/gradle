<script setup lang="ts">
import IconXMark from './icons/IconXMark.vue';

defineProps<{
    visible: boolean,
    title: string,
}>();

defineEmits<{
    (e: 'close'): void
}>();

</script>

<template>
    <transition name="modal-fade">
        <div v-show="visible" class="container" @click.self="$emit('close')">
            <div class="modal">
                <header class="header">
                    {{ title }}
                    <button class="button icon lg" @click="$emit('close')">
                        <IconXMark />
                    </button>
                </header>

                <section class="body">
                    <slot name="body"></slot>
                </section>

                <footer class="footer">
                    <div class="footer-content">
                        <slot name="footer">
                        </slot>
                    </div>
                    <button class="footer-close button" @click="$emit('close')">Close</button>
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
    min-height: 65%;
    max-height: 90%;
}

.header, .footer {
    padding: 1em;
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
    justify-content: flex-start;
    border-top: 1px solid var(--gray-4);
}

.footer-content {
    flex: 1;
}

.footer-close {
    margin-left: 1em;
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

<script setup lang="ts">
import IconXMark from './icons/IconXMark.vue';

defineProps<{
    visible: boolean,
    title: string,
    fixedWidth?: boolean,
    fixedHeight?: boolean,
}>();

defineEmits<{
    (e: 'close'): void
}>();

</script>

<template>
    <Teleport to="body">
        <transition name="modal-fade">
            <div v-show="visible" class="container" @click.self="$emit('close')">
                <slot name="modal">
                    <div class="modal" :class="{ 'fixed-width': fixedWidth, 'fixed-height': fixedHeight }">
                        <header class="header">
                            {{ title }}
                            <button class="button icon lg" @click="$emit('close')">
                                <IconXMark />
                            </button>
                        </header>

                        <slot name="body">
                            <section class="body">
                                <slot name="content"></slot>
                            </section>
                        </slot>

                        <footer v-if="$slots.footer" class="footer">
                            <div class="footer-content">
                                <slot name="footer">
                                </slot>
                            </div>
                            <!-- <button class="footer-close button" @click="$emit('close')">Close</button> -->
                        </footer>
                    </div>
                </slot>
            </div>
        </transition>
    </Teleport>
</template>

<style scoped>
.container {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    padding: 1em;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10;
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
    /* width: 90%; */
    max-width: 50em;
    /* min-height: 65%; */
    max-height: 100%;
}

.modal.fixed-width {
    width: 100%;
}

.modal.fixed-height {
    height: 100%;
    max-height: 60em;
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
    font-size: 1.4em;
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
    padding: 1em;
    flex: 1;
    overflow-y: auto;
    scrollbar-gutter: stable both-edges;
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

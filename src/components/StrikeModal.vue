<script setup lang="ts">
import Modal from './Modal.vue';

defineProps(['visible']);
defineEmits(['close']);
</script>

<template>
    <Modal :visible="visible" @close="$emit('close')" title="NY Times Tech Guild Strike">
        <template #content>
            <h3 class="mt-0">Gradle supports the IT workers of the NY Times</h3>

            <p>
                Gradle asks you to refrain from playing Wordle or any other New York Times games until the strike is
                over and the NY Times agrees to treat the 600 software engineers and others behind the NY Times games fairly.
            </p>

            <p>
                Please see the following links for more information.
            </p>

            <ul>
                <li>
                    <a href="https://newsguild.org/press-release-new-york-times-tech-guild-walks-off-the-job/" target="_blank">
                        Press Release: New York Times Tech Guild Walks Off the Job - <small>newsguild.org</small>
                    </a>
                </li>
                <li>
                    <a href="https://nytimesguild.org/tech-contract-campaign/" target="_blank">
                        Site: NY Times Tech Guild contract campaign - <small>nytimesguild.org</small>
                    </a>
                </li>
                <li>
                    <a href="https://www.nytimes.com/2024/11/04/business/media/new-york-times-strike.html?unlocked_article_code=1.XU4.p7Mp.cHzY6O52elRP" target="_blank">
                        Article: New York Times Tech Workers Go on Strike - <small>nytimes.com</small>
                    </a>
                </li>
            </ul>
        </template>
        <template #footer>
            <p class="text-small text-muted">
                Wordle is © 2024 The New York Times Company.
            </p>
            <p class="text-small text-muted">
                This App / Website is the product of gradle.app which has no
                affiliation with Wordle or The New York Times Company.
            </p>
        </template>
    </Modal>
</template>


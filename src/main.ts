import { createApp } from 'vue';
import App from './App.vue';
import { registerSW } from 'virtual:pwa-register';

createApp(App).mount('#app');

registerSW({
    // Auto update every hour
    onRegistered(r) {
        r && setInterval(() => { r.update() }, 60 * 60 * 1000);
    },
    onOfflineReady() {
        console.log("Offline ready");
    }
});

import { words, answers, allWords } from './words';
(window as any).words = words;
(window as any).answers = answers;
(window as any).allWords = allWords;

import Solver from './solver';
(window as any).Solver = Solver;

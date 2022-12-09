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

import { answers } from './answers';
(window as any).answers = answers;

// import { allowedWords } from './words';
// (window as any).allowedWords = allowedWords;

// import Solver from './solver';
// (window as any).Solver = Solver;

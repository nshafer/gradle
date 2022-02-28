import { createApp } from 'vue';
import App from './App.vue';
import { registerSW } from 'virtual:pwa-register';

createApp(App).mount('#app');

registerSW({
    // Auto update every hour
    onRegistered(r) {
        r && setInterval(() => {
        r.update()
    }, 60 * 60 * 1000);
  }
});

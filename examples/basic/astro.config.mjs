import { defineConfig } from 'astro/config';
import componentCache from "astro-component-cache";

// https://astro.build/config
export default defineConfig({
    integrations: [componentCache()]
});

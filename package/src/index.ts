import {transform} from "./transform.js";
import {AstroIntegration, AstroUserConfig} from "astro";

export default function componentCache(): AstroIntegration {
    return {
        name: "astro-component-cache",
        hooks: {
            "astro:config:setup": (options) => {
                const config = options.config as AstroUserConfig;
                if (!config.vite) {
                    config.vite = {};
                }
                if (!config.vite.plugins) {
                    config.vite.plugins = [];
                }
                config.vite.plugins.push({
                    name: "astro-transform-cache-exports",
                    transform
                })
            },
        }
    }
}

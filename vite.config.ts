import { defineConfig } from 'vitest/config';
import { sveltepress } from '@sveltepress/vite';
import { defaultTheme } from '@sveltepress/theme-default';

import navbar from './config/navbar.js';
import sidebar from './config/sidebar.js';

export default defineConfig({
	plugins: [
		sveltepress({
			theme: defaultTheme({
				navbar,
				sidebar,
				// PWA disabled: @sveltepress/theme-default 7.x PWA wiring is incompatible
				// with SvelteKit 2.69 / Vite 8 (service worker is never emitted before
				// vite-plugin-pwa's injectManifest runs). Re-enable when fixed upstream.
				preBuildIconifyIcons: {
					'vscode-icons': ['file-type-svelte', 'file-type-markdown', 'file-type-vite'],
					logos: ['typescript-icon', 'svelte-kit'],
					emojione: ['artist-palette'],
					ph: ['smiley', 'layout-duotone'],
					noto: ['package'],
					solar: ['chat-square-code-outline', 'reorder-outline'],
					carbon: ['tree-view-alt', 'import-export'],
					tabler: ['icons'],
					mdi: ['theme-light-dark'],
					bi: ['list-nested']
				},
				themeColor: {
					light: '#ffffff',
					dark: '#000000',
					primary: '#f97316',
					hover: '#f97316',
					gradient: {
						start: '#f97316',
						end: '#f97316'
					}
				},
				highlighter: {
					themeDark: 'slack-dark'
				},
				logo: '/conjure-logo-small.png'
			}),
			siteConfig: {
				title: 'Conjure',
				description: 'Form Generator'
			},
			addInspect: true
		})
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});

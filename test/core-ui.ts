import {describe, it} from "vitest";
import {mount} from "@vue/test-utils";
import TestApp from "./view/TestApp.vue";

describe('core-ui', () => {
	it('mp4', async (): Promise<void> => {
		document.body.innerHTML = '<div id="app"></div>'

		mount(TestApp, {
			attachTo: '#app',
		})
	})
})

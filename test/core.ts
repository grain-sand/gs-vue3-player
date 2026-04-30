import {describe, it} from "vitest";
import {mount} from "@vue/test-utils";
import TestCoreApp from "./view/TestCoreApp.vue";

describe('core', () => {
	it('mp4', async (): Promise<void> => {
		document.body.innerHTML = '<div id="app"></div>'

		mount(TestCoreApp, {
			attachTo: '#app',
		})
	})
})

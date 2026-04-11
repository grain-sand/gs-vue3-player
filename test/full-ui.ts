import {describe, it} from "vitest";
import {mount} from "@vue/test-utils";
import TestFullApp from "./view/TestFullApp.vue";

describe('full-ui', () => {
	it('list', async (): Promise<void> => {
		document.body.innerHTML = '<div id="app"></div>'

		mount(TestFullApp, {
			attachTo: '#app',
		})
	})
})

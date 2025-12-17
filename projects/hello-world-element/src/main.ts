import { createApplication } from '@angular/platform-browser';
import { createCustomElement } from '@angular/elements';
import { ApplicationRef } from '@angular/core';
import { HelloWorldWebComponent } from 'hello-world-web-component';

(async () => {
  console.log('[WebComponent Bootstrap] Starting registration...');

  try {
    const app: ApplicationRef = await createApplication({
      providers: [],
    });

    console.log('[WebComponent Bootstrap] Application created');

    // Create the custom element
    const HelloWorldElement = createCustomElement(HelloWorldWebComponent, {
      injector: app.injector,
    });

    // Register the custom element
    const tagName = 'hello-world-element';

    if (!customElements.get(tagName)) {
      customElements.define(tagName, HelloWorldElement);
      console.log(`[WebComponent Bootstrap] Custom element '${tagName}' registered successfully`);
    } else {
      console.log(`[WebComponent Bootstrap] Custom element '${tagName}' already registered`);
    }

    console.log('[WebComponent Bootstrap] Web component ready to use');
  } catch (error) {
    console.error('[WebComponent Bootstrap] Failed to register web component:', error);
  }
})();

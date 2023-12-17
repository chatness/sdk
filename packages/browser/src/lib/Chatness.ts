/**
 * @license
 * Copyright Chatness AI - All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/chatness/sdk/LICENSE
 */

if (typeof window === 'undefined') {
  throw new Error('This library is only functional in the browser environment');
}

export class Chatness {
  #selector = 'cha-widget:not([ng-reflect-inline="true"])';
  #cdnUrl = 'https://cdn.chatness.ai/scripts';
  // #cdnUrl = 'http://127.0.0.1:8080';

  constructor({ botId }: { botId?: string } = {}) {
    if (botId) {
      // check if there's no script tag injected already
      if (!document.querySelector(`script[id="chatness"]`)) {
        const script = document.createElement('script');
        script.src = `${this.#cdnUrl}/widget.mjs?bot=${botId}`;
        script.id = 'chatness';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }
    }
  }

  get #widgetEl() {
    return document.querySelector(this.#selector);
  }

  get widget() {
    return {
      open: () => {
        this.#widgetEl?.dispatchEvent(new CustomEvent('ChatnessWidgetOpen'));
      },
      close: () => {
        this.#widgetEl?.dispatchEvent(new CustomEvent('ChatnessWidgetClose'));
      },
      message: ({ text }: { text: string }) => {
        this.#widgetEl?.dispatchEvent(
          new CustomEvent('ChatnessWidgetMessage', {
            detail: {
              text,
            },
          })
        );
      },
    };
  }

  get auth() {
    return {
      contacts: {
        login: ({
          token,
        }: {
          token?: string;
        } = {}) => {
          if (!token) {
            throw new Error('Token is required in order to log a contact in');
          }
          this.#widgetEl?.dispatchEvent(
            new CustomEvent('ChatnessAuthContactsLogin', {
              detail: {
                token,
              },
            })
          );
        },
        logout: () => {
          this.#widgetEl?.dispatchEvent(
            new CustomEvent('ChatnessAuthContactsLogout')
          );
        },
      },
    };
  }

  get when() {
    return {
      ready: () =>
        new Promise((resolve) => {
          this.#widgetEl?.addEventListener('ChatnessWhenReady', () => {
            resolve(null);
          });
        }),
    };
  }
}

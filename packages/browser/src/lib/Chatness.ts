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
  #selector = 'chat-widget';
  #cdnUrl = 'https://cdn.chatness.ai/scripts';

  #botId: string | null;

  constructor({
    botId,
    cdnUrl,
  }: {
    botId?: string;
    cdnUrl?: string;
  } = {}) {
    this.#botId = botId || null;
    if (cdnUrl) {
      this.#cdnUrl = cdnUrl;
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
      show: () => {
        this.#widgetEl?.dispatchEvent(new CustomEvent('ChatnessWidgetShow'));
      },
      hide: () => {
        this.#widgetEl?.dispatchEvent(new CustomEvent('ChatnessWidgetHide'));
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

  /**
   * Attaches the Chatness widget script to the DOM
   */
  attach() {
    if (!this.#botId) {
      throw new Error(
        'Bot ID is required when creating a new Chatness instance'
      );
    }
    // check if there's no script tag injected already
    if (!document.querySelector(`script[id="chatness"]`)) {
      const script = document.createElement('script');
      script.src = `${this.#cdnUrl}/widget.mjs?bot=${this.#botId}`;
      script.async = true;
      script.defer = true;

      document.head.appendChild(script);
    }
  }
}

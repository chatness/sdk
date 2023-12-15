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
  selector = 'cha-widget:not([ng-reflect-inline="true"])';

  get widgetEl() {
    return document.querySelector(this.selector);
  }

  get widget() {
    return {
      open: () => {
        this.widgetEl?.dispatchEvent(new CustomEvent('ChatnessWidgetOpen'));
      },
      close: () => {
        this.widgetEl?.dispatchEvent(new CustomEvent('ChatnessWidgetClose'));
      },
      message: ({ text }: { text: string }) => {
        this.widgetEl?.dispatchEvent(
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
          this.widgetEl?.dispatchEvent(
            new CustomEvent('ChatnessAuthContactsLogin', {
              detail: {
                token,
              },
            })
          );
        },
        logout: () => {
          this.widgetEl?.dispatchEvent(
            new CustomEvent('ChatnessAuthContactsLogout')
          );
        },
      },
    };
  }
}

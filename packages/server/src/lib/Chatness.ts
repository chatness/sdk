/**
 * @license
 * Copyright Chatness AI - All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/chatness/sdk/LICENSE
 */
import { fetcher } from './fetcher';

// check for node environment
if (typeof window !== 'undefined') {
  throw new Error('This library is only functional in a NodeJS environment');
}

const environment = {
  API_URL: 'https://api.chatness.ai',
};

export interface ClientParams {
  /**
   * The Org Token is a secret key that allows you to access the API. Grab it from the account settings.
   */
  orgToken: string;
  /**
   * The bot ID is the unique identifier of your bot. Grab it from the bot settings.
   */
  botId: string;
  /**
   * The API URL is the base URL of the Chatness API. You can use the default value or set your own (self-hosted version).
   */
  apiUrl?: string;
  /**
   * The API version is the version of the Chatness API. You can use the default value or set your own.
   */
  apiVersion?: number;
}

export interface Contact {
  name: string;
  email: string;
  phone?: string;
  wid?: string;
  mid?: string;
}

export type ContactUpsert = {
  index: number;
  id: string;
};

export class Chatness {
  baseUrl = '';
  apiVersion = '';
  orgToken: string;
  botId: string;

  constructor({
    orgToken,
    botId,
    apiVersion = 1,
    apiUrl = environment.API_URL,
  }: ClientParams) {
    if (!orgToken) throw new Error('Org token is required');

    this.orgToken = orgToken;
    this.botId = botId;
    this.apiVersion = `v${apiVersion}`;
    this.baseUrl = `${apiUrl}/${this.apiVersion}`;
  }

  get contacts() {
    return {
      create: (contact: Contact) => {
        if (!contact) throw new Error('Contact is required');
        return fetcher<Contact>(`${this.baseUrl}/bots/${this.botId}/contacts`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.orgToken}`,
          },
          body: contact,
          flatResponse: true,
        });
      },
      upsert: (contacts: Contact[]) => {
        if (!contacts) throw new Error('Contacts required');
        return fetcher<ContactUpsert[]>(
          `${this.baseUrl}/bots/${this.botId}/contacts`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${this.orgToken}`,
            },
            body: {
              data: contacts,
            },
            flatResponse: true,
          }
        );
      },
      search: ({
        query,
        page = 1,
        limit = 10,
      }: {
        /**
         * The query is the search query. It can be a name, email or phone number.
         */
        query?: string;
        /**
         * The page is the page number of the paginated results.
         */
        page?: number;
        /**
         * The limit is the number of results per page.
         */
        limit?: number;
      } = {}) => {
        let url = `${this.baseUrl}/bots/${this.botId}/contacts?`;
        if (query) {
          url += `&query=${query}`;
        }
        if (page) {
          url += `&page=${page}`;
        }
        if (limit) {
          url += `&limit=${limit}`;
        }

        return fetcher(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.orgToken}`,
          },
          flatResponse: true,
        });
      },
      retrieve: (contactId: string) => {
        return fetcher(
          `${this.baseUrl}/bots/${this.botId}/contacts/${contactId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${this.orgToken}`,
            },
            flatResponse: true,
          }
        );
      },
      update: (contactId: string, contact: Partial<Contact>) => {
        return fetcher(
          `${this.baseUrl}/bots/${this.botId}/contacts/${contactId}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${this.orgToken}`,
            },
            body: contact,
            flatResponse: true,
          }
        );
      },
      delete: (contactId: string) => {
        return fetcher(
          `${this.baseUrl}/bots/${this.botId}/contacts/${contactId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${this.orgToken}`,
            },
            flatResponse: true,
          }
        );
      },
    };
  }

  get auth() {
    return {
      contacts: {
        tokenize: ({
          id,
          email,
        }: {
          id?: string;
          email?: string;
        } = {}) => {
          if (!id && !email) {
            throw new Error('Either contact Id or email is required');
          }

          return fetcher(`${this.baseUrl}/bots/${this.botId}/auth/contacts`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${this.orgToken}`,
            },
            body: {
              id,
              email,
            },
            flatResponse: true,
          });
        },
        revoke: ({ contactToken }: { contactToken: string }) => {
          return fetcher(
            `${this.baseUrl}/bots/${this.botId}/auth/contacts/${contactToken}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${this.orgToken}`,
              },
            }
          );
        },
      },
    };
  }
}

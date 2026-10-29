/* Shared types for the mock router and its handlers (kept separate to avoid an import cycle). */

export class MockHttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export interface MockContext {
  method: string;
  /** Path without the query string, e.g. "/faqs/admin/faq-1" */
  pathname: string;
  query: URLSearchParams;
  params: string[];
  body: unknown;
}

export type MockHandler = (ctx: MockContext) => unknown;

export interface MockRoute {
  method?: string | string[];
  match: RegExp;
  handle: MockHandler;
}

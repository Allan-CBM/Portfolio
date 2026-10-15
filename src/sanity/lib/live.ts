import "server-only";

import { defineLive } from "next-sanity";

import { client } from "./client";
import { readToken } from "./token";

/**
 * Live Content API: published content updates without redeploys, and in Draft Mode
 * (Sanity Presentation) every keystroke streams to the page.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: readToken || false,
  browserToken: readToken || false,
});

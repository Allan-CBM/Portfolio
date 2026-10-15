import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@/sanity/lib/client";
import { readToken } from "@/sanity/lib/token";

/** Called by Sanity Presentation to turn on Draft Mode (validated with a signed secret). */
export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: readToken }),
});

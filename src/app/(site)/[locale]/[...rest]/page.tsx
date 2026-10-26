import { notFound } from "next/navigation";

/** Unknown paths under /en or /pt render the designed [locale]/not-found.tsx instead of Next's default 404. */
export default function CatchAll() {
  notFound();
}

import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";

type WebhookPayload = { _type?: string; slug?: string };

/**
 * Optional Sanity GROQ-powered webhook (Manage → API → Webhooks).
 * The Live Content API already refreshes content in real time; this endpoint additionally
 * regenerates statically built pages (sitemap, generateStaticParams) after publishing.
 *
 * URL:        https://<your-domain>/api/revalidate
 * Projection: { _type, "slug": slug.current }
 * Secret:     SANITY_REVALIDATE_SECRET
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: "Missing SANITY_REVALIDATE_SECRET" }, { status: 500 });
  }

  try {
    const { isValidSignature, body } = await parseBody<WebhookPayload>(request, secret, true);
    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }
    if (!body?._type) {
      return NextResponse.json({ message: "Bad request" }, { status: 400 });
    }

    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");

    return NextResponse.json({ revalidated: true, type: body._type, slug: body.slug ?? null, now: Date.now() });
  } catch (error) {
    console.error("[revalidate]", error);
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 });
  }
}

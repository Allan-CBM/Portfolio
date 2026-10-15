import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useClient } from "sanity";
import { IntentLink } from "sanity/router";
import { Badge, Box, Card, Container, Flex, Grid, Heading, Spinner, Stack, Text } from "@sanity/ui";
import {
  CaseIcon,
  ClockIcon,
  CommentIcon,
  DocumentTextIcon,
  EditIcon,
  StarFilledIcon,
} from "@sanity/icons";

type DocRow = { _id: string; _type: string; _updatedAt: string; title?: string | null };
type PostRow = { _id: string; title?: string | null; postType?: string; publishedAt?: string };

type DashboardData = {
  totalProjects: number;
  featuredProjects: number;
  totalPosts: number;
  totalTestimonials: number;
  draftCount: number;
  drafts: DocRow[];
  recentPosts: PostRow[];
  activity: DocRow[];
};

const notDraft = `!(_id in path("drafts.**"))`;
const titleExpr = `coalesce(title.en, author, company, "Untitled")`;

const DASHBOARD_QUERY = /* groq */ `{
  "totalProjects": count(*[_type == "project" && ${notDraft}]),
  "featuredProjects": count(*[_type == "project" && featured == true && ${notDraft}]),
  "totalPosts": count(*[_type == "post" && ${notDraft}]),
  "totalTestimonials": count(*[_type == "testimonial" && ${notDraft}]),
  "draftCount": count(*[_id in path("drafts.**")]),
  "drafts": *[_id in path("drafts.**")] | order(_updatedAt desc)[0...8]{ _id, _type, _updatedAt, "title": ${titleExpr} },
  "recentPosts": *[_type == "post" && ${notDraft}] | order(publishedAt desc)[0...6]{ _id, "title": title.en, postType, publishedAt },
  "activity": *[_type in ["project", "post", "testimonial", "experience", "service", "siteSettings"]]
    | order(_updatedAt desc)[0...12]{ _id, _type, _updatedAt, "title": ${titleExpr} }
}`;

const TYPE_LABELS: Record<string, string> = {
  project: "Project",
  post: "Post",
  testimonial: "Testimonial",
  experience: "Experience",
  service: "Service",
  siteSettings: "Settings",
};

const POST_LABELS: Record<string, string> = {
  article: "Article",
  caseStudy: "Case Study",
  designNote: "Design Note",
  aiExperiment: "AI Experiment",
};

const publishedId = (id: string) => id.replace(/^drafts\./, "");

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (diff < 60) return rtf.format(-Math.round(diff), "second");
  if (diff < 3600) return rtf.format(-Math.round(diff / 60), "minute");
  if (diff < 86400) return rtf.format(-Math.round(diff / 3600), "hour");
  return rtf.format(-Math.round(diff / 86400), "day");
}

function StatCard({ label, value, icon, tone }: { label: string; value: number; icon: ReactNode; tone?: "primary" | "positive" | "caution" | "default" }) {
  return (
    <Card padding={4} radius={3} shadow={1} tone={tone ?? "default"}>
      <Stack space={4}>
        <Flex align="center" justify="space-between">
          <Text size={1} muted weight="medium">
            {label.toUpperCase()}
          </Text>
          <Text size={2}>{icon}</Text>
        </Flex>
        <Heading size={5}>{value}</Heading>
      </Stack>
    </Card>
  );
}

function DocList({ title, rows, empty, icon }: { title: string; rows: DocRow[]; empty: string; icon: ReactNode }) {
  return (
    <Card padding={4} radius={3} shadow={1}>
      <Stack space={4}>
        <Flex align="center" gap={2}>
          <Text size={2}>{icon}</Text>
          <Heading size={1}>{title}</Heading>
        </Flex>
        {rows.length === 0 ? (
          <Text size={1} muted>
            {empty}
          </Text>
        ) : (
          <Stack space={1}>
            {rows.map((row) => (
              <Card
                key={row._id}
                as={IntentLink}
                // @ts-expect-error — IntentLink props are forwarded by Card's `as`
                intent="edit"
                params={{ id: publishedId(row._id), type: row._type }}
                padding={3}
                radius={2}
                tone="inherit"
                style={{ textDecoration: "none" }}
              >
                <Flex align="center" justify="space-between" gap={3}>
                  <Stack space={2} style={{ minWidth: 0 }}>
                    <Text size={1} weight="medium" textOverflow="ellipsis">
                      {row.title || "Untitled"}
                    </Text>
                    <Text size={0} muted>
                      {timeAgo(row._updatedAt)}
                    </Text>
                  </Stack>
                  <Badge tone={row._id.startsWith("drafts.") ? "caution" : "primary"} fontSize={0}>
                    {TYPE_LABELS[row._type] ?? row._type}
                  </Badge>
                </Flex>
              </Card>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}

export function DashboardTool() {
  const baseClient = useClient({ apiVersion: "2025-02-19" });
  const client = useMemo(() => baseClient.withConfig({ perspective: "raw" }), [baseClient]);
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    client
      .fetch<DashboardData>(DASHBOARD_QUERY)
      .then((result) => {
        setData(result);
        setError(null);
      })
      .catch((err: Error) => setError(err.message));
  }, [client]);

  useEffect(() => {
    load();
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const subscription = client
      .listen(`*[_type in ["project", "post", "testimonial", "experience", "service", "siteSettings"]]`, {}, {
        visibility: "query",
        includeResult: false,
      })
      .subscribe(() => {
        clearTimeout(timeout);
        timeout = setTimeout(load, 400);
      });
    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [client, load]);

  return (
    <Box padding={[4, 5, 6]} style={{ overflowY: "auto", height: "100%" }}>
      <Container width={4}>
        <Stack space={6}>
          <Stack space={3}>
            <Text size={1} muted weight="medium">
              ALLAN MARTINS — STUDIO
            </Text>
            <Heading size={4}>Dashboard</Heading>
            <Text size={2} muted>
              Live overview of your portfolio content. Updates in real time as you edit.
            </Text>
          </Stack>

          {error && (
            <Card padding={4} radius={3} tone="critical">
              <Text size={1}>{error}</Text>
            </Card>
          )}

          {!data && !error ? (
            <Flex justify="center" padding={6}>
              <Spinner muted />
            </Flex>
          ) : data ? (
            <>
              <Grid columns={[1, 2, 4]} gap={3}>
                <StatCard label="Total projects" value={data.totalProjects} icon={<CaseIcon />} tone="primary" />
                <StatCard label="Featured" value={data.featuredProjects} icon={<StarFilledIcon />} tone="positive" />
                <StatCard label="Journal posts" value={data.totalPosts} icon={<DocumentTextIcon />} />
                <StatCard label="Drafts" value={data.draftCount} icon={<EditIcon />} tone="caution" />
              </Grid>

              <Grid columns={[1, 1, 3]} gap={3}>
                <Card padding={4} radius={3} shadow={1}>
                  <Stack space={4}>
                    <Flex align="center" gap={2}>
                      <Text size={2}>
                        <DocumentTextIcon />
                      </Text>
                      <Heading size={1}>Recent posts</Heading>
                    </Flex>
                    {data.recentPosts.length === 0 ? (
                      <Text size={1} muted>
                        No published posts yet.
                      </Text>
                    ) : (
                      <Stack space={1}>
                        {data.recentPosts.map((post) => (
                          <Card
                            key={post._id}
                            as={IntentLink}
                            // @ts-expect-error — IntentLink props are forwarded by Card's `as`
                            intent="edit"
                            params={{ id: post._id, type: "post" }}
                            padding={3}
                            radius={2}
                            style={{ textDecoration: "none" }}
                          >
                            <Stack space={2}>
                              <Text size={1} weight="medium" textOverflow="ellipsis">
                                {post.title || "Untitled"}
                              </Text>
                              <Text size={0} muted>
                                {[POST_LABELS[post.postType ?? ""], post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : null]
                                  .filter(Boolean)
                                  .join(" · ")}
                              </Text>
                            </Stack>
                          </Card>
                        ))}
                      </Stack>
                    )}
                  </Stack>
                </Card>
                <DocList title="Drafts" rows={data.drafts} empty="No unpublished changes." icon={<EditIcon />} />
                <DocList title="Recent activity" rows={data.activity} empty="Nothing here yet." icon={<ClockIcon />} />
              </Grid>

              <Card padding={4} radius={3} tone="transparent" border>
                <Flex align="center" gap={3}>
                  <Text size={2}>
                    <CommentIcon />
                  </Text>
                  <Text size={1} muted>
                    {data.totalTestimonials} testimonial{data.totalTestimonials === 1 ? "" : "s"} published. Testimonials
                    appear on the homepage slider automatically.
                  </Text>
                </Flex>
              </Card>
            </>
          ) : null}
        </Stack>
      </Container>
    </Box>
  );
}

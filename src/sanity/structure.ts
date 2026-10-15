import type { StructureResolver } from "sanity/structure";
import {
  CaseIcon,
  CogIcon,
  CommentIcon,
  DocumentTextIcon,
  EarthGlobeIcon,
  SparklesIcon,
  StarFilledIcon,
} from "@sanity/icons";

const postTypeLists = [
  { id: "article", title: "Articles" },
  { id: "caseStudy", title: "Case Studies" },
  { id: "designNote", title: "Design Notes" },
  { id: "aiExperiment", title: "AI Experiments" },
];

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Projects")
        .icon(CaseIcon)
        .child(
          S.list()
            .title("Projects")
            .items([
              S.listItem()
                .title("All projects")
                .icon(CaseIcon)
                .child(S.documentTypeList("project").title("All projects").defaultOrdering([{ field: "publishedAt", direction: "desc" }])),
              S.listItem()
                .title("Featured")
                .icon(StarFilledIcon)
                .child(
                  S.documentList()
                    .title("Featured projects")
                    .schemaType("project")
                    .filter('_type == "project" && featured == true')
                    .defaultOrdering([{ field: "publishedAt", direction: "desc" }]),
                ),
            ]),
        ),
      S.listItem()
        .title("Journal")
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title("Journal")
            .items([
              S.listItem()
                .title("All posts")
                .icon(DocumentTextIcon)
                .child(S.documentTypeList("post").title("All posts")),
              S.divider(),
              ...postTypeLists.map((type) =>
                S.listItem()
                  .id(type.id)
                  .title(type.title)
                  .icon(DocumentTextIcon)
                  .child(
                    S.documentList()
                      .title(type.title)
                      .schemaType("post")
                      .filter('_type == "post" && postType == $postType')
                      .params({ postType: type.id })
                      .initialValueTemplates([
                        S.initialValueTemplateItem("post"),
                      ]),
                  ),
              ),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("testimonial").title("Testimonials").icon(CommentIcon),
      S.documentTypeListItem("experience").title("Experience").icon(EarthGlobeIcon),
      S.documentTypeListItem("service").title("Services").icon(SparklesIcon),
      S.divider(),
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .icon(CogIcon)
        .child(S.document().schemaType("siteSettings").documentId("siteSettings").title("Site Settings")),
    ]);

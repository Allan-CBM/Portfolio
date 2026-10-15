import { defineQuery } from "next-sanity";

const image = /* groq */ `{
  ...,
  "asset": asset->{ _id, url, mimeType, metadata { lqip, dimensions { width, height, aspectRatio } } }
}`;

const file = /* groq */ `{
  ...,
  "asset": asset->{ _id, url, mimeType, originalFilename }
}`;

const published = /* groq */ `defined(slug.current)`;

const projectCard = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  client,
  year,
  category,
  excerpt,
  projectColor,
  featured,
  publishedAt,
  "image": select(
    defined(thumbnail.asset) => thumbnail${image},
    defined(featuredImage.asset) => featuredImage${image},
    coverImage${image}
  ),
  "cover": select(
    defined(featuredImage.asset) => featuredImage${image},
    coverImage${image}
  )
`;

const pageBuilder = /* groq */ `
  pageBuilder[]{
    ...,
    _type == "heroBlock" => { image${image}, video${file} },
    _type == "imageBlock" => { image${image} },
    _type == "galleryBlock" => { images[]${image} },
    _type == "videoBlock" => { file${file}, poster${image} },
    _type == "twoColumnBlock" => { image${image} },
    _type == "quoteBlock" => { avatar${image} },
    _type == "processBlock" => { steps[]{ ..., image${image} } },
    _type == "fullWidthMediaBlock" => { image${image}, video${file} }
  }
`;

const postCard = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  postType,
  excerpt,
  publishedAt,
  tags,
  coverImage${image}
`;

export const settingsQuery = defineQuery(`*[_type == "siteSettings"][0]{
  ...,
  portrait${image},
  ogImage${image}
}`);

export const homeQuery = defineQuery(`{
  "settings": *[_type == "siteSettings"][0]{ ..., portrait${image}, ogImage${image} },
  "featured": *[_type == "project" && featured == true && ${published}] | order(publishedAt desc)[0...8]{ ${projectCard} },
  "projectCount": count(*[_type == "project" && ${published}]),
  "testimonials": *[_type == "testimonial" && defined(quote)] | order(coalesce(order, 999) asc, _createdAt desc){
    _id, quote, author, role, company, avatar${image}
  },
  "experiences": *[_type == "experience"] | order(coalesce(order, 999) asc, startDate desc){
    _id, company, role, location, startDate, endDate, current, description, highlights, url
  },
  "services": *[_type == "service"] | order(coalesce(order, 999) asc){ _id, title, description, deliverables }
}`);

export const projectsQuery = defineQuery(`*[_type == "project" && ${published}] | order(publishedAt desc){ ${projectCard} }`);

export const projectQuery = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  ...,
  "slug": slug.current,
  featuredImage${image},
  coverImage${image},
  thumbnail${image},
  gallery[]${image},
  video${file},
  testimonial->{ _id, quote, author, role, company, avatar${image} },
  ${pageBuilder},
  "next": coalesce(
    *[_type == "project" && ${published} && _id != ^._id && publishedAt < ^.publishedAt] | order(publishedAt desc)[0]{ ${projectCard} },
    *[_type == "project" && ${published} && _id != ^._id] | order(publishedAt desc)[0]{ ${projectCard} }
  )
}`);

export const projectSlugsQuery = defineQuery(`*[_type == "project" && ${published}]{ "slug": slug.current, _updatedAt }`);

export const projectSeoQuery = defineQuery(`*[_type == "project" && slug.current == $slug][0]{
  title, excerpt, seoTitle, seoDescription, client, category, year, publishedAt, _updatedAt,
  "image": select(
    defined(featuredImage.asset) => featuredImage{ ..., "asset": asset->{ _id, url } },
    coverImage{ ..., "asset": asset->{ _id, url } }
  )
}`);

export const postsQuery = defineQuery(`*[_type == "post" && ${published}] | order(publishedAt desc){ ${postCard} }`);

export const postQuery = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  ${postCard},
  body,
  _updatedAt,
  relatedProject->{ ${projectCard} },
  "next": *[_type == "post" && ${published} && _id != ^._id && publishedAt < ^.publishedAt] | order(publishedAt desc)[0]{ ${postCard} }
}`);

export const postSlugsQuery = defineQuery(`*[_type == "post" && ${published}]{ "slug": slug.current, _updatedAt }`);

export const postSeoQuery = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  title, excerpt, seoTitle, seoDescription, publishedAt, _updatedAt,
  "image": coverImage{ ..., "asset": asset->{ _id, url } }
}`);

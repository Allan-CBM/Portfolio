import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Allan Martins — Portfolio",
    short_name: "Allan Martins",
    description: "Graphic Designer, Product Designer & Creative Technologist based in Florianópolis, Brazil.",
    start_url: "/",
    display: "standalone",
    background_color: "#050505",
    theme_color: "#050505",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}

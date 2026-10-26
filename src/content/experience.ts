import type { Localized } from "./types";

export type ExperienceEntry = {
  /** Unique, URL-safe id (used for accessibility ids). */
  id: string;
  company: string;
  role: Localized;
  location: Localized;
  /** ISO year-month, e.g. "2025-09". */
  start: string;
  end: string;
  /** Optional one-line summary shown above the bullets. */
  intro?: Localized;
  bullets: Localized<string[]>;
  /** Optional tool chips. Tool names are the same in both languages. */
  tools?: string[];
};

/** Most recent first: the timeline renders in this order. */
export const experience: ExperienceEntry[] = [
  {
    id: "pregao-de-guerra",
    // Full name: "Pregão de Guerra - Consultoria e Projeto de Vendas"
    company: "Pregão de Guerra",
    role: { en: "Graphic Designer", pt: "Designer Gráfico" },
    location: { en: "Florianópolis, SC", pt: "Florianópolis, SC" },
    start: "2026-02",
    end: "2026-10",
    intro: {
      en: "Sole designer on the team, responsible for all visual assets used at corporate events.",
      pt: "Único designer da equipe, responsável por todos os materiais visuais usados em eventos corporativos.",
    },
    bullets: {
      en: [
        "Developed and applied the visual identity across multiple platforms, including social media and in-house presentations, focused on ease of use and creative solutions.",
        "Created designs, logos and print-ready templates for major sales events for brands like Chevrolet, Nissan, Lumis Engineering and large car dealership brands.",
      ],
      pt: [
        "Desenvolvi e apliquei a identidade visual em diversas plataformas, incluindo redes sociais e apresentações internas, com foco em facilidade de uso e soluções criativas.",
        "Criei peças, logotipos e templates prontos para impressão para grandes eventos de vendas de marcas como Chevrolet, Nissan, Lumis Engineering e grandes redes de concessionárias.",
      ],
    },
  },
  {
    id: "glamour-beauty-show",
    company: "Glamour Beauty Show",
    role: { en: "Graphic Designer", pt: "Designer Gráfico" },
    location: { en: "Florianópolis, SC", pt: "Florianópolis, SC" },
    start: "2025-09",
    end: "2025-12",
    intro: {
      en: "Design and production support for the Glamour Beauty Show in Balneário Camboriú, an event with 25,000+ attendees.",
      pt: "Design e apoio à produção no Glamour Beauty Show, em Balneário Camboriú, evento com mais de 25.000 participantes.",
    },
    bullets: {
      en: [
        "Adapted existing creative concepts into new formats for social media.",
        "Produced videos, ads and Instagram posts aligned with the event's branding and optimized for digital platforms.",
        "Turned ideas into visually appealing, platform-ready content, strengthening the event's online visibility.",
        "Collaborated with the production team during the physical event and managed the Nails and Lashes Congress.",
      ],
      pt: [
        "Adaptei conceitos criativos existentes para novos formatos de redes sociais.",
        "Produzi vídeos, anúncios e posts de Instagram alinhados à marca do evento e otimizados para plataformas digitais.",
        "Transformei ideias em conteúdo visualmente atraente e pronto para cada plataforma, fortalecendo a presença online do evento.",
        "Atuei junto à equipe de produção durante o evento presencial e fiquei responsável pelo Congresso de Unhas e Cílios.",
      ],
    },
  },
  {
    id: "tdbusiness",
    company: "TDBusiness",
    role: { en: "Graphic Designer", pt: "Designer Gráfico" },
    location: { en: "Florianópolis, SC", pt: "Florianópolis, SC" },
    start: "2025-02",
    end: "2025-05",
    intro: {
      en: "Part of the communication and design team for 4 months, working on visual design, communication and customer experience.",
      pt: "Integrei a equipe de comunicação e design por 4 meses, atuando em design visual, comunicação e experiência do cliente.",
    },
    bullets: {
      en: [
        "Created visual intelligence assets and supported internal and external communication plans.",
        "Suggested customer-experience improvements through design and functionality.",
        "Researched, developed and applied the project's visual identity across dashboards, presentations and institutional documents.",
        "Designed layouts focused on clarity, consistency and brand alignment.",
        "Edited videos for TD and 3Lírios, combining visual design with storytelling.",
        "Collaborated on the visual identity of a major project presented at the Empreende Brasil event.",
      ],
      pt: [
        "Criei ativos de inteligência visual e apoiei planos de comunicação interna e externa.",
        "Sugeri melhorias na experiência do cliente por meio de design e funcionalidade.",
        "Pesquisei, desenvolvi e apliquei a identidade visual do projeto em dashboards, apresentações e documentos institucionais.",
        "Desenhei layouts com foco em clareza, consistência e alinhamento à marca.",
        "Editei vídeos para a TD e a 3Lírios, unindo design visual e storytelling.",
        "Colaborei na identidade visual de um grande projeto apresentado no evento Empreende Brasil.",
      ],
    },
    tools: ["CapCut", "Canva", "Adobe Illustrator", "Figma", "ChatGPT", "Sora"],
  },
  {
    id: "advb-sc",
    company: "ADVB/SC",
    role: { en: "Marketing Intern", pt: "Estagiário de Marketing" },
    location: { en: "Florianópolis, SC", pt: "Florianópolis, SC" },
    start: "2023-09",
    end: "2024-08",
    bullets: {
      en: [
        "Created marketing graphics for company events.",
        "Designed banners and backdrops used at events and supported the team during them.",
        "Developed marketing campaigns to increase brand awareness and customer acquisition.",
      ],
      pt: [
        "Criei peças gráficas de marketing para eventos da empresa.",
        "Desenhei banners e backdrops usados nos eventos e dei suporte à equipe durante eles.",
        "Desenvolvi campanhas de marketing para aumentar o reconhecimento da marca e a captação de clientes.",
      ],
    },
  },
  {
    id: "otus-engenharia",
    company: "Otus Engenharia",
    role: { en: "Creative Internship", pt: "Estágio Criativo" },
    location: { en: "Santa Catarina, Brazil", pt: "Santa Catarina, Brasil" },
    start: "2022-10",
    end: "2023-08",
    bullets: {
      en: [
        "Oversaw video and sales ad editing, social media, and YouTube vignette creation.",
        "Created and managed digital ad campaigns, increasing website visits.",
      ],
      pt: [
        "Conduzi a edição de vídeos e anúncios de vendas, as redes sociais e a criação de vinhetas para o YouTube.",
        "Criei e gerenciei campanhas de anúncios digitais, aumentando as visitas ao site.",
      ],
    },
  },
];

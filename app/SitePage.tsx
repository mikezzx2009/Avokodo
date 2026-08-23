import Link from "next/link";
import type { ImageRef, LinkItem, ProjectItem, SiteContent } from "@/lib/content";
import type { CatalogCategory } from "@/lib/catalog";
import { CatalogCategoryView, CatalogIndex } from "./CatalogLibrary";

type SmartLinkProps = LinkItem & {
  className?: string;
  children?: React.ReactNode;
  currentSection?: SectionSlug;
};

export type SectionSlug =
  | "catalog"
  | "about"
  | "services"
  | "work"
  | "process"
  | "contact";

const SECTION_SLUGS = new Set<SectionSlug>([
  "catalog",
  "about",
  "services",
  "work",
  "process",
  "contact",
]);

const PRACTICE_PROJECTS: ProjectItem[] = [
  {
    id: "consumer-electronics",
    title: "Consumer electronics",
    category: "Capability area",
    description:
      "Product form, component architecture, and everyday usability considered as one system.",
    image: null,
    href: null,
  },
  {
    id: "wearable-products",
    title: "Wearable products",
    category: "Capability area",
    description:
      "Human-centred concepts refined around fit, material, interaction, and production.",
    image: null,
    href: null,
  },
  {
    id: "soft-goods-accessories",
    title: "Soft goods & accessories",
    category: "Capability area",
    description:
      "Practical design direction for products where construction and finish define the experience.",
    image: null,
    href: null,
  },
  {
    id: "manufacturing-development",
    title: "Manufacturing development",
    category: "Capability area",
    description:
      "Design-for-manufacture thinking that carries a concept toward an achievable physical product.",
    image: null,
    href: null,
  },
];

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

function sectionFromHref(href: string): SectionSlug | null {
  const match = href.match(/^(?:#|\/)(catalog|about|services|work|process|contact)\/?$/);
  const section = match?.[1];
  return section && SECTION_SLUGS.has(section as SectionSlug)
    ? (section as SectionSlug)
    : null;
}

function pageHref(href: string) {
  const section = sectionFromHref(href);
  return section ? `/${section}/` : href;
}

function SmartLink({
  href,
  label,
  className,
  children,
  currentSection,
}: SmartLinkProps) {
  const resolvedHref = pageHref(href);
  const external = isExternal(resolvedHref);
  const linkedSection = sectionFromHref(resolvedHref);
  const content = children ?? label;

  if (resolvedHref.startsWith("/")) {
    return (
      <Link
        className={className}
        href={resolvedHref}
        aria-current={linkedSection === currentSection ? "page" : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <a
      className={className}
      href={resolvedHref}
      aria-current={linkedSection === currentSection ? "page" : undefined}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {content}
    </a>
  );
}

function ImageOrArtwork({
  image,
  variant,
  eager = false,
  fit = "cover",
}: {
  image: ImageRef | null;
  variant: number;
  eager?: boolean;
  fit?: "cover" | "contain";
}) {
  if (image?.url) {
    return (
      // Native images keep bundled and remote portfolio media flexible.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        className="avk-media-image"
        src={image.url}
        alt={image.alt}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        style={{ display: "block", height: "100%", objectFit: fit, width: "100%" }}
      />
    );
  }

  return (
    <div
      className={`avk-artwork avk-artwork--${variant}`}
      role="img"
      aria-label="Avokodo abstract industrial design study"
    >
      <span className="avk-artwork-code" aria-hidden="true">
        FORM/{String(variant).padStart(2, "0")}
      </span>
      <span className="avk-artwork-shape" aria-hidden="true" />
    </div>
  );
}

function ProjectMedia({ project, index }: { project: ProjectItem; index: number }) {
  const media = (
    <div className="avk-project-media">
      <ImageOrArtwork image={project.image} variant={(index % 4) + 1} />
      <span className="avk-project-index" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
    </div>
  );

  if (!project.href) return media;

  return (
    <a
      className="avk-project-link"
      href={project.href}
      aria-label={`View ${project.title}`}
      target={isExternal(project.href) ? "_blank" : undefined}
      rel={isExternal(project.href) ? "noreferrer" : undefined}
    >
      {media}
    </a>
  );
}

export default function SitePage({
  content,
  section,
  catalogCategory,
}: {
  content: SiteContent;
  section?: SectionSlug;
  catalogCategory?: CatalogCategory;
}) {
  const { site, navigation, hero, about, services, work, process, contact, footer } =
    content;
  const displayedProjects = work.items.length ? work.items : PRACTICE_PROJECTS;
  const shows = (target: SectionSlug) => section === target;

  return (
    <div className="avk-site" id="top">
      <a className="avk-skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="avk-header">
        <Link
          className="avk-wordmark"
          href="/"
          aria-label={`${site.name.toUpperCase()} home`}
        >
          <span className="avk-wordmark-seed" aria-hidden="true" />
          {site.name.toUpperCase()}
        </Link>

        <nav className="avk-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <SmartLink
              key={`${item.label}-${item.href}`}
              {...item}
              currentSection={section}
            />
          ))}
        </nav>

        <SmartLink className="avk-header-cta" {...hero.primaryCta}>
          <span>{hero.primaryCta.label}</span>
          <span className="avk-arrow" aria-hidden="true">
            ↗
          </span>
        </SmartLink>
      </header>

      <main className={section ? "avk-page-main" : undefined} id="main-content">
        {!section ? (
        <section className="avk-hero" aria-labelledby="hero-title">
          <div className="avk-rule-label">
            <span>{hero.eyebrow}</span>
            <span>{site.tagline}</span>
          </div>

          <h1
            id="hero-title"
            style={{
              fontSize: "clamp(0.8rem, 3vw, 2.5rem)",
              maxWidth: "none",
              textAlign: "center",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            {hero.title}
          </h1>

          <div className="avk-hero-bottom">
            <div className="avk-hero-visual">
              <ImageOrArtwork image={hero.image} variant={0} eager />
            </div>

            <div className="avk-hero-copy">
              <p>{hero.description}</p>
              <div className="avk-hero-actions">
                <SmartLink className="avk-button avk-button--dark" {...hero.primaryCta}>
                  <span>{hero.primaryCta.label}</span>
                  <span className="avk-arrow" aria-hidden="true">
                    ↗
                  </span>
                </SmartLink>
                {hero.secondaryCta ? (
                  <SmartLink className="avk-text-link" {...hero.secondaryCta} />
                ) : null}
              </div>
            </div>
          </div>
        </section>
        ) : null}

        {shows("work") ? (
        <section className="avk-work avk-section" id="work" aria-labelledby="work-title">
          <div className="avk-section-heading">
            <p className="avk-eyebrow">{work.eyebrow}</p>
            <h2
              id="work-title"
              style={{
                fontSize: "clamp(0.8rem, 3vw, 2.5rem)",
                maxWidth: "none",
                textAlign: "center",
                textTransform: "uppercase",
                whiteSpace: "nowrap",
              }}
            >
              {work.title}
            </h2>
            <p className="avk-section-intro">{work.intro}</p>
          </div>

          <div className="avk-project-grid">
            {displayedProjects.map((project, index) => (
              <article className="avk-project" key={project.id}>
                <ProjectMedia project={project} index={index} />
                <div className="avk-project-meta">
                  <h3>{project.title}</h3>
                  <p>{project.category}</p>
                </div>
                <p className="avk-project-description">{project.description}</p>
              </article>
            ))}
          </div>
        </section>
        ) : null}

        {shows("catalog") ? (
        <section
          className="avk-work avk-section"
          id="catalog"
          aria-labelledby="catalog-title"
        >
          {catalogCategory ? (
            <CatalogCategoryView category={catalogCategory} />
          ) : (
            <CatalogIndex />
          )}
        </section>
        ) : null}

        {shows("services") ? (
        <section
          className="avk-services avk-section avk-section--ink"
          id="services"
          aria-labelledby="services-title"
        >
          <div className="avk-section-heading avk-section-heading--split">
            <p className="avk-eyebrow">{services.eyebrow}</p>
            <h2 id="services-title">{services.title}</h2>
            <p className="avk-section-intro">{services.intro}</p>
          </div>

          <div className="avk-service-list">
            {services.items.map((service) => (
              <article className="avk-service" key={service.id}>
                <p className="avk-service-number">{service.number}</p>
                <h3>{service.title}</h3>
                <p className="avk-service-description">{service.description}</p>
                {service.capabilities.length ? (
                  <ul className="avk-capabilities" aria-label={`${service.title} capabilities`}>
                    {service.capabilities.map((capability) => (
                      <li key={capability}>{capability}</li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </section>
        ) : null}

        {shows("about") ? (
        <section className="avk-about avk-section" id="about" aria-labelledby="about-title">
          <div className="avk-about-copy">
            <p className="avk-eyebrow">{about.eyebrow}</p>
            <h2 id="about-title">{about.title}</h2>
            <div className="avk-about-paragraphs">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>

          <div className="avk-about-visual">
            <ImageOrArtwork image={about.image} variant={5} />
          </div>

          {about.facts.length ? (
            <dl className="avk-facts" aria-label="Studio at a glance">
              {about.facts.map((fact) => (
                <div key={fact.id}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </section>
        ) : null}

        {shows("process") ? (
        <section className="avk-process avk-section" id="process" aria-labelledby="process-title">
          <div className="avk-section-heading avk-section-heading--split">
            <p className="avk-eyebrow">{process.eyebrow}</p>
            <h2 id="process-title">{process.title}</h2>
            <p className="avk-section-intro">{process.intro}</p>
          </div>

          <ol className="avk-process-list">
            {process.steps.map((step) => (
              <li key={step.id}>
                <span className="avk-process-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </li>
            ))}
          </ol>
        </section>
        ) : null}

        {shows("contact") ? (
        <section className="avk-contact" id="contact" aria-labelledby="contact-title">
          <p className="avk-eyebrow">{contact.eyebrow}</p>
          <h2 id="contact-title">{contact.title}</h2>
          <div className="avk-contact-bottom">
            <p>{contact.description}</p>
            <div className="avk-contact-actions">
              <a
                className="avk-contact-link"
                href={contact.ctaHref}
                target={isExternal(contact.ctaHref) ? "_blank" : undefined}
                rel={isExternal(contact.ctaHref) ? "noreferrer" : undefined}
              >
                <span>{contact.ctaLabel}</span>
                <span aria-hidden="true">↗</span>
              </a>
              {contact.email ? (
                <a className="avk-email-link" href={`mailto:${contact.email}`}>
                  {contact.email}
                </a>
              ) : null}
            </div>
          </div>
        </section>
        ) : null}
      </main>

      <footer className="avk-footer">
        <div className="avk-footer-brand">
          <Link className="avk-wordmark avk-wordmark--footer" href="/">
            <span className="avk-wordmark-seed" aria-hidden="true" />
            {site.name.toUpperCase()}
          </Link>
          <p>{footer.tagline || site.tagline}</p>
        </div>

        <nav className="avk-footer-links" aria-label="Footer navigation">
          <SmartLink href="/catalog/" label="Catalog" currentSection={section} />
          {footer.links.map((item) => (
            <SmartLink
              key={`${item.label}-${item.href}`}
              {...item}
              currentSection={section}
            />
          ))}
        </nav>

        <div className="avk-footer-meta">
          <a className="avk-admin-link" href="/admin/">
            Manage site
          </a>
          <p>{footer.copyright}</p>
        </div>
      </footer>
    </div>
  );
}

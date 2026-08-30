import Link from "next/link";
import type { ImageRef, LinkItem, ProjectItem, SiteContent } from "@/lib/content";
import type { CatalogCategory } from "@/lib/catalog";
import { CatalogCategoryView, CatalogIndex } from "./CatalogLibrary";
import HeroSlideshow from "./HeroSlideshow";

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
            className="avk-page-title avk-page-title--uppercase"
            id="hero-title"
          >
            {hero.title}
          </h1>

          <div className="avk-hero-bottom">
            <div className="avk-hero-visual">
              <HeroSlideshow image={hero.image} />
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
        <section
          className="avk-work avk-section avk-page-section--flush"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="avk-section-heading avk-page-heading">
            <p className="avk-eyebrow">{work.eyebrow}</p>
            <h2
              className="avk-page-title avk-page-title--uppercase"
              id="work-title"
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
          className={
            catalogCategory
              ? "avk-work avk-section avk-page-section--compact"
              : "avk-work avk-section avk-catalog-index-section avk-page-section--flush"
          }
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
          className="avk-services avk-section avk-section--ink avk-page-section--flush"
          id="services"
          aria-labelledby="services-title"
        >
          <div className="avk-section-heading avk-page-heading avk-section-heading--split">
            <p className="avk-eyebrow">{services.eyebrow}</p>
            <h2 className="avk-page-title" id="services-title">
              {services.title}
            </h2>
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
        <section
          className="avk-about avk-section avk-page-section--compact"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="avk-section-heading avk-page-heading avk-page-heading--plain avk-about-heading">
            <p className="avk-eyebrow">{about.eyebrow}</p>
            <h2 className="avk-page-title" id="about-title">
              {about.title}
            </h2>
          </div>

          <div className="avk-about-copy">
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

          <div className="avk-about-subsection" aria-labelledby="about-gallery-title">
            <div className="avk-about-subheading">
              <p className="avk-eyebrow">Inside Avokodo</p>
              <h3 id="about-gallery-title">Design thinking, made physical.</h3>
            </div>
            <div className="avk-about-gallery">
              {about.gallery.map((item) => (
                <figure className="avk-about-gallery-item" key={item.id}>
                  <div className="avk-about-gallery-media">
                    <ImageOrArtwork image={item.image} variant={5} />
                  </div>
                  <figcaption>{item.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>

          <div className="avk-about-subsection" aria-labelledby="about-capabilities-title">
            <div className="avk-about-subheading">
              <p className="avk-eyebrow">Integrated capabilities</p>
              <h3 id="about-capabilities-title">
                Product development and manufacturing, connected.
              </h3>
            </div>
            <div className="avk-about-capability-grid">
              {about.capabilities.map((capability) => (
                <article className="avk-about-capability" key={capability.id}>
                  <p className="avk-about-number">{capability.number}</p>
                  <h4>{capability.title}</h4>
                  <p>{capability.description}</p>
                </article>
              ))}
            </div>
            <div className="avk-about-materials">
              <p>Materials &amp; program types</p>
              <ul aria-label="Materials and program types">
                {about.materials.map((material) => (
                  <li key={material}>{material}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="avk-about-subsection" aria-labelledby="about-process-title">
            <div className="avk-about-subheading">
              <p className="avk-eyebrow">From brief to production</p>
              <h3 id="about-process-title">One integrated path.</h3>
            </div>
            <ol className="avk-about-process">
              {about.process.map((step) => (
                <li key={step.id}>
                  <span>{step.number}</span>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="avk-about-subsection" aria-labelledby="about-locations-title">
            <div className="avk-about-subheading">
              <p className="avk-eyebrow">Our locations</p>
              <h3 id="about-locations-title">Two teams, one connected operation.</h3>
            </div>
            <div className="avk-about-location-grid">
              {about.locations.map((location) => (
                <article className="avk-about-location" key={location.id}>
                  <p>{location.location}</p>
                  <h4>{location.title}</h4>
                  <p>{location.description}</p>
                  <a
                    className="avk-about-map-link"
                    href={location.mapHref}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${location.title} location in Google Maps`}
                  >
                    <span>Open in Google Maps</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                </article>
              ))}
            </div>
          </div>

          <aside className="avk-about-closing">
            <p className="avk-eyebrow">Why Avokodo</p>
            <h3>{about.closing.title}</h3>
            <p>{about.closing.description}</p>
          </aside>
        </section>
        ) : null}

        {shows("process") ? (
        <section
          className="avk-process avk-section avk-page-section--flush"
          id="process"
          aria-labelledby="process-title"
        >
          <div className="avk-section-heading avk-page-heading avk-section-heading--split">
            <p className="avk-eyebrow">{process.eyebrow}</p>
            <h2 className="avk-page-title" id="process-title">
              {process.title}
            </h2>
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
        <section
          className="avk-contact avk-page-section--compact"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="avk-section-heading avk-page-heading avk-page-heading--plain">
            <p className="avk-eyebrow">{contact.eyebrow}</p>
            <h2 className="avk-page-title" id="contact-title">
              {contact.title}
            </h2>
          </div>
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

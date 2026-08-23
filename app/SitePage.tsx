import type { ImageRef, LinkItem, ProjectItem, SiteContent } from "@/lib/content";

type SmartLinkProps = LinkItem & {
  className?: string;
  children?: React.ReactNode;
};

type CatalogItem = Omit<ProjectItem, "image"> & {
  productImage: ImageRef;
  factoryImage: ImageRef;
};

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

const CATALOG_ITEMS: CatalogItem[] = [
  {
    id: "catalog-3d-printing",
    title: "3D printing",
    category: "Product + factory",
    description:
      "Colorful printed components paired with a view of the model finishing workspace.",
    productImage: {
      id: "catalog-3d-print-product",
      url: "/catalog/3d-print-product.webp",
      alt: "Colorful 3D-printed components",
    },
    factoryImage: {
      id: "catalog-3d-print-factory",
      url: "/catalog/3d-print-factory.webp",
      alt: "3D-print model finishing workstation",
    },
    href: null,
  },
  {
    id: "catalog-aluminum-bottles",
    title: "Aluminum bottles",
    category: "Product + factory",
    description:
      "A range of finished aluminum bottles shown alongside the powder-coating line.",
    productImage: {
      id: "catalog-aluminum-bottle-product",
      url: "/catalog/aluminum-bottle-product.webp",
      alt: "Aluminum bottles in assorted colors",
    },
    factoryImage: {
      id: "catalog-aluminum-bottle-factory",
      url: "/catalog/aluminum-bottle-factory.webp",
      alt: "Aluminum bottles on the factory powder-coating line",
    },
    href: null,
  },
  {
    id: "catalog-fitness-gloves",
    title: "Fitness gloves",
    category: "Product + factory",
    description:
      "Multiple fitness glove styles paired with a view of the factory material warehouse.",
    productImage: {
      id: "catalog-fitness-gloves-product",
      url: "/catalog/fitness-gloves-product.webp",
      alt: "Collection of fitness glove styles",
    },
    factoryImage: {
      id: "catalog-fitness-gloves-factory",
      url: "/catalog/fitness-gloves-factory.webp",
      alt: "Factory warehouse storing materials for fitness gloves",
    },
    href: null,
  },
  {
    id: "catalog-wooden-puzzles",
    title: "Wooden puzzles",
    category: "Product + factory",
    description:
      "A finished wooden puzzle paired with CNC woodworking on the factory floor.",
    productImage: {
      id: "catalog-puzzle-product",
      url: "/catalog/puzzle-product.webp",
      alt: "Finished wooden barrel puzzle",
    },
    factoryImage: {
      id: "catalog-puzzle-factory",
      url: "/catalog/puzzle-factory.webp",
      alt: "CNC machine processing wooden puzzle parts",
    },
    href: null,
  },
];

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

function SmartLink({ href, label, className, children }: SmartLinkProps) {
  const external = isExternal(href);

  return (
    <a
      className={className}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
    >
      {children ?? label}
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

function CatalogMediaPair({ item, index }: { item: CatalogItem; index: number }) {
  const media = [
    { label: "Product", image: item.productImage },
    { label: "Factory", image: item.factoryImage },
  ];

  return (
    <div
      className="avk-catalog-pair"
      style={{
        display: "grid",
        gap: "0.75rem",
        gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))",
      }}
    >
      {media.map(({ label, image }, mediaIndex) => (
        <figure
          className="avk-catalog-figure"
          key={label}
          style={{ margin: 0, minWidth: 0 }}
        >
          <div
            className="avk-catalog-media"
            style={{ aspectRatio: "4 / 3", overflow: "hidden" }}
          >
            <ImageOrArtwork
              image={image}
              variant={((index + mediaIndex) % 4) + 1}
              fit="contain"
            />
          </div>
          <figcaption
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.12em",
              marginTop: "0.5rem",
              textTransform: "uppercase",
            }}
          >
            {label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function SitePage({ content }: { content: SiteContent }) {
  const { site, navigation, hero, about, services, work, process, contact, footer } =
    content;
  const displayedProjects = work.items.length ? work.items : PRACTICE_PROJECTS;

  return (
    <div className="avk-site">
      <a className="avk-skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="avk-header">
        <a className="avk-wordmark" href="#top" aria-label={`${site.name} home`}>
          <span className="avk-wordmark-seed" aria-hidden="true" />
          {site.name}
        </a>

        <nav className="avk-nav" aria-label="Primary navigation">
          <SmartLink href="#catalog" label="Catalog" />
          {navigation.map((item) => (
            <SmartLink key={`${item.label}-${item.href}`} {...item} />
          ))}
        </nav>

        <SmartLink className="avk-header-cta" {...hero.primaryCta}>
          <span>{hero.primaryCta.label}</span>
          <span className="avk-arrow" aria-hidden="true">
            ↗
          </span>
        </SmartLink>
      </header>

      <main id="main-content">
        <section className="avk-hero" id="top" aria-labelledby="hero-title">
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

        <section className="avk-work avk-section" id="work" aria-labelledby="work-title">
          <div className="avk-section-heading">
            <p className="avk-eyebrow">{work.eyebrow}</p>
            <h2 id="work-title">{work.title}</h2>
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

        <section
          className="avk-work avk-section"
          id="catalog"
          aria-labelledby="catalog-title"
        >
          <div className="avk-section-heading">
            <p className="avk-eyebrow">Catalog</p>
            <h2
              id="catalog-title"
              style={{ fontSize: "clamp(1.2rem, 3.2vw, 2.5rem)", whiteSpace: "nowrap" }}
            >
              PRODUCT AND FACTORY
            </h2>
            <p className="avk-section-intro">
              A focused overview of product development and factory-ready production.
            </p>
          </div>

          <div className="avk-project-grid">
            {CATALOG_ITEMS.map((item, index) => (
              <article className="avk-project" key={item.id}>
                <CatalogMediaPair item={item} index={index} />
                <div className="avk-project-meta">
                  <h3>{item.title}</h3>
                  <p>{item.category}</p>
                </div>
                <p className="avk-project-description">{item.description}</p>
              </article>
            ))}
          </div>
        </section>

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
      </main>

      <footer className="avk-footer">
        <div className="avk-footer-brand">
          <a className="avk-wordmark avk-wordmark--footer" href="#top">
            <span className="avk-wordmark-seed" aria-hidden="true" />
            {site.name}
          </a>
          <p>{footer.tagline || site.tagline}</p>
        </div>

        <nav className="avk-footer-links" aria-label="Footer navigation">
          <SmartLink href="#catalog" label="Catalog" />
          {footer.links.map((item) => (
            <SmartLink key={`${item.label}-${item.href}`} {...item} />
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

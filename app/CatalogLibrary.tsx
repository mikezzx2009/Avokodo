import Link from "next/link";
import {
  CATALOG_CATEGORIES,
  getCatalogCategory,
  mediaCountLabel,
  type CatalogCategory,
  type CatalogMedia,
  type CatalogProduct,
} from "@/lib/catalog";
import { CatalogTabs } from "./CatalogTabs";

function CatalogImage({
  src, alt, eager = false,
}: { src: string; alt: string; eager?: boolean }) {
  // Native images preserve the full proportions of the checked-in catalog assets.
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="avk-catalog-image" src={src} alt={alt}
    loading={eager ? "eager" : "lazy"} decoding="async" />;
}

function Breadcrumb({ items }: {
  items: { title: string; href?: string }[];
}) {
  return (
    <nav className="catalog-breadcrumb" aria-label="Breadcrumb">
      <ol>
        <li><Link href="/">Home</Link></li>
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? <Link href={item.href}>{item.title}</Link> :
              <span aria-current="page">{item.title}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

function ShopCard({ title, href, cover, note, label, eager = false }: {
  title: string; href: string; cover: string; note: string;
  label: string; eager?: boolean;
}) {
  return (
    <article className="catalog-shop-card">
      <Link className="catalog-shop-card-link" href={href}>
        <div className="catalog-shop-card-media">
          <CatalogImage src={cover} alt={title} eager={eager} />
        </div>
        <h2>{title}</h2>
      </Link>
      <p className="catalog-shop-card-note">{note}</p>
      <Link className="catalog-outline-button" href={href}
        aria-label={`${label}: ${title}`}>
        {label}<span aria-hidden="true">↗</span>
      </Link>
    </article>
  );
}

export function CatalogIndex() {
  return (
    <>
      <Breadcrumb items={[{ title: "Catalog" }]} />
      <header className="catalog-shop-heading">
        <p className="catalog-kicker">The Avokodo collection</p>
        <h1 id="catalog-title">Product catalog.</h1>
        <p>Explore our products, materials and manufacturing capabilities.</p>
      </header>
      <div className="catalog-shop-toolbar">
        <p>{CATALOG_CATEGORIES.length} collections</p>
        <p>Designed. Developed. Made.</p>
      </div>
      <div className="catalog-shop-grid">
        {CATALOG_CATEGORIES.map((category, index) => (
          <ShopCard key={category.slug} title={category.title}
            href={`/catalog/${category.slug}/`} cover={category.cover}
            note={category.slug === "pu-foam-toys" ? "Custom foam toys & stress relievers" :
              "Products & manufacturing"}
            label="View collection" eager={index < 4} />
        ))}
      </div>
    </>
  );
}

function CatalogMediaItem({ title, media, index }: {
  title: string; media: CatalogMedia; index: number;
}) {
  const label = `${title} — ${media.kind} ${index + 1}`;
  return (
    <figure className="avk-catalog-gallery-item">
      <div className="avk-catalog-gallery-media">
        {media.kind === "image" ? (
          <a href={media.src} target="_blank" rel="noreferrer"
            aria-label={`Open full image: ${label}`}>
            <CatalogImage src={media.src} alt={label} />
          </a>
        ) : (
          // Factory clips have no supplied caption tracks.
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video className="avk-catalog-video" src={media.src} controls playsInline
            preload="metadata" aria-label={label} />
        )}
      </div>
      <figcaption><span>{title}</span><span>{String(index + 1).padStart(2, "0")}</span></figcaption>
    </figure>
  );
}

export function CatalogCategoryView({ category }: { category: CatalogCategory }) {
  const productGroup = category.groups.find((group) => group.productHref);
  const factoryGroups = category.groups.filter((group) => group.slug === "factory");
  return (
    <>
      <Breadcrumb items={[{ title: "Catalog", href: "/catalog/" }, { title: category.title }]} />
      <header className="catalog-shop-heading">
        <p className="catalog-kicker">Product collection</p>
        <h1 id="catalog-title">{category.title}</h1>
        <p>{productGroup ? "Soft forms. Bright ideas. Discover our PU foam toy collection." :
          "Explore product samples and a closer look at how they are made."}</p>
      </header>
      {productGroup?.productHref && productGroup.productTitle && productGroup.productCover ? (
        <CatalogTabs
          product={
            <>
              <div className="catalog-shop-toolbar"><p>1 product</p><p>Customisation available</p></div>
              <div className="catalog-shop-grid">
                <ShopCard title={productGroup.productTitle} href={productGroup.productHref}
                  cover={productGroup.productCover} note="PU foam · Fast rebound"
                  label="View product" eager />
              </div>
            </>
          }
          factory={
            factoryGroups.some((group) => group.media.length) ? (
              <div className="avk-catalog-gallery">
                {factoryGroups.flatMap((group) => group.media).map((media, index) => (
                  <CatalogMediaItem title="Factory" media={media} index={index} key={media.src} />
                ))}
              </div>
            ) : (
              <div className="catalog-factory-empty">
                <p className="catalog-kicker">Behind the product</p>
                <h2>Factory</h2>
                <p>Factory photography will be added soon.</p>
                <Link className="catalog-outline-button" href="/contact/">Discuss your project<span aria-hidden="true">↗</span></Link>
              </div>
            )
          }
        />
      ) : (
        <div className="avk-catalog-groups">
          {category.groups.map((group) => (
            <section className="avk-catalog-group" aria-labelledby={`group-${group.slug.replaceAll("/", "-")}`} key={group.slug}>
              <header className="avk-catalog-group-heading">
                <div><h2 id={`group-${group.slug.replaceAll("/", "-")}`}>{group.title}</h2></div>
                <p>{mediaCountLabel(group.imageCount, group.videoCount)}</p>
              </header>
              <div className="avk-catalog-gallery">
                {group.media.map((media, index) => (
                  <CatalogMediaItem title={group.title} media={media} index={index} key={media.src} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

function FullImage({ media, alt, className = "", eager = false }: {
  media: CatalogMedia; alt: string; className?: string; eager?: boolean;
}) {
  return (
    <a className={`catalog-full-image ${className}`} href={media.src}
      target="_blank" rel="noreferrer" aria-label={`View full image: ${alt}`}>
      <CatalogImage src={media.src} alt={alt} eager={eager} />
    </a>
  );
}

export function CatalogProductView({ product }: { product: CatalogProduct }) {
  const category = getCatalogCategory(product.categorySlug);
  const categoryTitle = category?.title ?? "Products";
  return (
    <article className="catalog-product-page">
      <Breadcrumb items={[
        { title: "Catalog", href: "/catalog/" },
        { title: categoryTitle, href: `/catalog/${product.categorySlug}/` },
        { title: "Product", href: `/catalog/${product.categorySlug}/#product` },
        { title: product.title },
      ]} />
      <section className="catalog-product-hero" aria-labelledby="catalog-title">
        <div className="catalog-product-hero-copy">
          <p className="catalog-kicker">{categoryTitle} / Product</p>
          <h1 id="catalog-title">{product.title}</h1>
          <p className="catalog-product-intro">{product.description}</p>
          <dl className="catalog-product-specs">
            <div><dt>Rebound time</dt><dd>Approx. 0.5 s</dd></div>
            <div><dt>Size · L × W × H</dt><dd>Approx. 15 × 9 × 9 cm</dd></div>
          </dl>
          <Link className="catalog-outline-button" href="/contact/">
            Enquire about this product<span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="catalog-product-hero-art">
          <FullImage media={product.renders[0]} alt={`${product.title}, three-quarter studio render`}
            className="catalog-product-hero-main" eager />
          <FullImage media={product.renders[2]} alt={`${product.title}, front studio render`}
            className="catalog-product-hero-inset" />
        </div>
      </section>

      <section className="catalog-product-details" aria-label="Product details">
        <div>
          <h2>Key features</h2>
          <ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
        </div>
        <div>
          <h2>Customisation</h2>
          <p>{product.customisation}</p>
          <p><strong>Size:</strong> {product.size}</p>
        </div>
      </section>

      <nav className="catalog-product-sections" aria-label="Product sections">
        <a href="#sketch"><span>01</span>Sketch</a>
        <a href="#render"><span>02</span>Render</a>
        <a href="#picture"><span>03</span>Picture</a>
      </nav>

      <section className="catalog-editorial-section" id="sketch" aria-labelledby="sketch-title">
        <div className="catalog-editorial-media catalog-editorial-media--sketch">
          {product.sketch.map((media) => (
            <FullImage key={media.src} media={media}
              alt="Full industrial design sketch sheet of the PU foam rugby ball" />
          ))}
        </div>
        <div className="catalog-editorial-copy">
          <p className="catalog-kicker">01 / Sketch</p>
          <h2 id="sketch-title">From idea<br />to form.</h2>
          <p>A study of the rugby ball’s silhouette, surface texture and raised lace detail. Multiple views bring the design together.</p>
          <a className="catalog-inline-link" href={product.sketch[0].src} target="_blank" rel="noreferrer">
            Explore the sketch ↗
          </a>
        </div>
      </section>

      <section className="catalog-editorial-section catalog-editorial-section--reverse" id="render" aria-labelledby="render-title">
        <div className="catalog-editorial-copy">
          <p className="catalog-kicker">02 / Render</p>
          <h2 id="render-title">Colour.<br />Texture.<br />Character.</h2>
          <p>Vivid red and yellow panels, a textured surface and contrasting white laces. Studio renders show the form from different angles.</p>
          <a className="catalog-inline-link" href={product.renders[1].src} target="_blank" rel="noreferrer">
            Take a closer look ↗
          </a>
        </div>
        <div className="catalog-editorial-media catalog-editorial-media--render">
          <FullImage media={product.renders[1]} alt="Diagonal three-quarter studio render of the rugby ball" />
        </div>
        <div className="catalog-editorial-extras">
          {[product.renders[0], product.renders[2]].map((media, index) => (
            <figure className="catalog-editorial-figure" key={media.src}>
              <FullImage media={media} alt={index === 0 ? "Three-quarter studio render" : "Front studio render"} />
              <figcaption>{index === 0 ? "Three-quarter view" : "Front view"}<span>Studio render</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="catalog-editorial-section" id="picture" aria-labelledby="picture-title">
        <div className="catalog-editorial-media">
          <FullImage media={product.pictures[1]} alt="Real PU foam rugby ball sample being squeezed by hand" />
        </div>
        <div className="catalog-editorial-copy">
          <p className="catalog-kicker">03 / Picture</p>
          <h2 id="picture-title">Made to<br />be held.</h2>
          <p>See the actual sample up close. These photographs show its finish, handheld scale and foam compression.</p>
          <p>Approximately 0.5-second recovery after release.</p>
          <Link className="catalog-outline-button" href="/contact/">Request a sample<span aria-hidden="true">↗</span></Link>
        </div>
        <div className="catalog-editorial-extras catalog-editorial-extras--pictures">
          {[product.pictures[0], product.pictures[2]].map((media, index) => (
            <figure className="catalog-editorial-figure" key={media.src}>
              <FullImage media={media} alt={index === 0 ? "Handheld finished rugby ball sample" : "Actual sample detail and squeeze demonstration"} />
              <figcaption>{index === 0 ? "The finished sample" : "Surface & feel"}<span>Actual product</span></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <footer className="catalog-editorial-footer">
        <div><p className="catalog-kicker">Your next product</p><h2>Make it your own.</h2><p>Let’s discuss your colours, branding and packaging.</p></div>
        <Link className="catalog-outline-button" href="/contact/">Start a conversation<span aria-hidden="true">↗</span></Link>
      </footer>
    </article>
  );
}

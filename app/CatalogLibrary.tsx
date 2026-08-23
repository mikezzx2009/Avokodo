import Link from "next/link";
import {
  CATALOG_CATEGORIES,
  mediaCountLabel,
  type CatalogCategory,
  type CatalogMedia,
} from "@/lib/catalog";

function CatalogImage({
  src,
  alt,
  eager = false,
}: {
  src: string;
  alt: string;
  eager?: boolean;
}) {
  return (
    // Catalog files are checked-in static assets and do not need image optimization.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      className="avk-catalog-image"
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

function CatalogMediaItem({
  category,
  groupTitle,
  media,
  index,
}: {
  category: CatalogCategory;
  groupTitle: string;
  media: CatalogMedia;
  index: number;
}) {
  const sequence = String(index + 1).padStart(2, "0");
  const label = `${category.title} — ${groupTitle}, ${media.kind} ${index + 1}`;

  return (
    <figure className="avk-catalog-gallery-item">
      <div className="avk-catalog-gallery-media">
        {media.kind === "image" ? (
          <CatalogImage src={media.src} alt={label} />
        ) : (
          // Source factory clips do not include caption tracks.
          // eslint-disable-next-line jsx-a11y/media-has-caption
          <video
            className="avk-catalog-video"
            src={media.src}
            controls
            playsInline
            preload="metadata"
            aria-label={label}
          />
        )}
      </div>
      <figcaption>
        <span>{sequence}</span>
        <span>{media.kind}</span>
      </figcaption>
    </figure>
  );
}

export function CatalogIndex() {
  return (
    <>
      <div className="avk-section-heading avk-page-heading">
        <p className="avk-eyebrow">Catalog</p>
        <h2 className="avk-page-title" id="catalog-title">
          Product &amp; Factory Library
        </h2>
        <p className="avk-section-intro">
          Browse the material library by folder. Each category opens into its full
          collection of product, factory, and supporting media.
        </p>
      </div>

      <div className="avk-catalog-index">
        {CATALOG_CATEGORIES.map((category, index) => (
          <Link
            className="avk-catalog-card"
            href={`/catalog/${category.slug}/`}
            key={category.slug}
          >
            <div className="avk-catalog-card-media">
              <CatalogImage
                src={category.cover}
                alt={`${category.title} catalog cover`}
                eager={index < 2}
              />
              <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className="avk-catalog-card-heading">
              <h3>{category.title}</h3>
              <span aria-hidden="true">↗</span>
            </div>
            <p>{mediaCountLabel(category.imageCount, category.videoCount)}</p>
            <ul aria-label={`${category.title} folders`}>
              {category.groups.map((group) => (
                <li key={group.slug}>{group.title}</li>
              ))}
            </ul>
          </Link>
        ))}
      </div>
    </>
  );
}

export function CatalogCategoryView({ category }: { category: CatalogCategory }) {
  return (
    <>
      <Link className="avk-catalog-back" href="/catalog/">
        <span aria-hidden="true">←</span>
        All catalog categories
      </Link>

      <div className="avk-section-heading avk-page-heading avk-catalog-detail-heading">
        <p className="avk-eyebrow">Catalog / {category.title}</p>
        <h2 className="avk-page-title" id="catalog-title">
          {category.title}
        </h2>
        <p className="avk-section-intro">
          {mediaCountLabel(category.imageCount, category.videoCount)} organized in the
          same folder structure as the source material.
        </p>
      </div>

      <div className="avk-catalog-groups">
        {category.groups.map((group) => {
          const headingId = `catalog-group-${group.slug.replaceAll("/", "-")}`;

          return (
            <section
              className="avk-catalog-group"
              aria-labelledby={headingId}
              key={group.slug}
            >
              <header className="avk-catalog-group-heading">
                <div>
                  <p>Folder</p>
                  <h3 id={headingId}>{group.title}</h3>
                </div>
                <p>{mediaCountLabel(group.imageCount, group.videoCount)}</p>
              </header>

              <div className="avk-catalog-gallery">
                {group.media.map((media, index) => (
                  <CatalogMediaItem
                    category={category}
                    groupTitle={group.title}
                    media={media}
                    index={index}
                    key={media.src}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}

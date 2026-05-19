import type { Testimonial } from "@/lib/travel-data"
import {
  getReviewAttribution,
  getReviewDisplayName,
  getReviewHref,
  getReviewInitials,
  getReviewMeta,
  getReviewRating,
} from "@/lib/reviews"

interface ReviewCardProps {
  review: Testimonial
  destinationName?: string
  destinationPrefix?: string
  compact?: boolean
  ctaFallbackHref?: string
  className?: string
}

function cx(...classes: Array<string | false | undefined>): string {
  return classes.filter(Boolean).join(" ")
}

export default function ReviewCard({
  review,
  destinationName,
  destinationPrefix,
  compact = false,
  ctaFallbackHref,
  className,
}: ReviewCardProps) {
  const displayName = getReviewDisplayName(review.name)
  const initials = getReviewInitials(review.name)
  const rating = getReviewRating(review.rating)
  const meta = getReviewMeta(review, destinationName, destinationPrefix)
  const attribution = getReviewAttribution(review)
  const href = getReviewHref(review, ctaFallbackHref)

  return (
    <article
      className={cx(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md",
        compact ? "p-4" : "p-5 sm:p-6",
        className,
      )}
    >
      <div className="absolute left-5 right-5 top-0 h-1 rounded-b-full bg-gradient-to-r from-coral to-yellow-sun" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          {review.image ? (
            <img
              src={review.image}
              alt={`Foto de ${displayName}`}
              width={48}
              height={48}
              loading="lazy"
              className={cx("shrink-0 rounded-full object-cover", compact ? "h-9 w-9" : "h-11 w-11")}
            />
          ) : (
            <div
              className={cx(
                "flex shrink-0 items-center justify-center rounded-full bg-teal-deep text-xs font-bold text-sand",
                compact ? "h-9 w-9" : "h-11 w-11",
              )}
            >
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-foreground">{displayName}</p>
            {meta && <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{meta}</p>}
          </div>
        </div>

        <div className="flex shrink-0 gap-0.5 pt-1" aria-label={`${rating} de 5 estrellas`}>
          {Array.from({ length: rating }).map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              width={compact ? 13 : 15}
              height={compact ? 13 : 15}
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-yellow-sun"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          ))}
        </div>
      </div>

      <blockquote className={cx("flex-1", compact ? "mt-4" : "mt-5")}>
        <p className={cx("italic leading-relaxed text-foreground", compact ? "text-sm" : "text-[15px] sm:text-base")}>
          "{review.quote}"
        </p>
      </blockquote>

      {(attribution || href) && (
        <div className={cx("mt-5 flex flex-wrap items-center gap-3 border-t border-border/40 pt-4", compact && "mt-4 pt-3")}>
          {attribution && (
            <span className="rounded-full bg-teal-deep/10 px-3 py-1 text-[11px] font-semibold leading-none text-teal-deep">
              {attribution}
            </span>
          )}

          {href && (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto text-xs font-bold text-coral transition-colors hover:text-coral/80"
            >
              Ver en Trustpilot
            </a>
          )}
        </div>
      )}
    </article>
  )
}

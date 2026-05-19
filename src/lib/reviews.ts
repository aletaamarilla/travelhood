import type { Testimonial } from "./travel-data"

const REVIEW_SORT_FALLBACK = 9999
const TRUSTPILOT_ATTRIBUTION = "Reseña publicada originalmente en Trustpilot"

type ReviewSource = Testimonial["source"]

type ReviewLike = Pick<
  Testimonial,
  | "age"
  | "city"
  | "destinationId"
  | "externalReviewUrl"
  | "featured"
  | "id"
  | "image"
  | "isVisible"
  | "name"
  | "rating"
  | "sortOrder"
  | "source"
  | "verificationStatus"
>

interface LandingReviewOptions {
  destinationIds?: Iterable<string>
  limit?: number
}

function isTrustpilotSource(source?: ReviewSource): boolean {
  return source === "trustpilot"
}

function isVerifiedTrustpilot(
  review: Pick<ReviewLike, "source" | "verificationStatus">,
): boolean {
  if (!isTrustpilotSource(review.source)) return false
  return (
    review.verificationStatus === "individual-link" ||
    review.verificationStatus === "profile-link"
  )
}

function isReliableTrustpilotUrl(href?: string | null): href is string {
  if (!href) return false
  try {
    const url = new URL(href)
    return url.protocol === "https:" && /(^|\.)trustpilot\.com$/i.test(url.hostname)
  } catch {
    return false
  }
}

export function getTrustpilotProfileLink(href?: string | null): string | undefined {
  return isReliableTrustpilotUrl(href) ? href : undefined
}

export function getReviewAttribution(
  review: Pick<ReviewLike, "source" | "verificationStatus">,
): string | undefined {
  return isVerifiedTrustpilot(review) ? TRUSTPILOT_ATTRIBUTION : undefined
}

export function getReviewHref(
  review: Pick<ReviewLike, "externalReviewUrl" | "source" | "verificationStatus">,
  fallbackHref?: string,
): string | undefined {
  if (!isVerifiedTrustpilot(review)) return undefined

  if (isReliableTrustpilotUrl(review.externalReviewUrl)) {
    return review.externalReviewUrl
  }

  return isReliableTrustpilotUrl(fallbackHref) ? fallbackHref : undefined
}

export function sortReviews<T extends Pick<ReviewLike, "sortOrder">>(reviews: T[]): T[] {
  return [...reviews].sort(
    (a, b) => (a.sortOrder ?? REVIEW_SORT_FALLBACK) - (b.sortOrder ?? REVIEW_SORT_FALLBACK),
  )
}

export function filterVisibleReviews<T extends Pick<ReviewLike, "isVisible" | "verificationStatus">>(
  reviews: T[],
): T[] {
  return reviews.filter(
    (review) =>
      review.isVisible !== false && review.verificationStatus !== "retired",
  )
}

export function selectVisibleReviews<
  T extends Pick<ReviewLike, "isVisible" | "sortOrder" | "verificationStatus">,
>(reviews: T[], limit?: number): T[] {
  const selectedReviews = sortReviews(filterVisibleReviews(reviews))

  return typeof limit === "number" ? selectedReviews.slice(0, limit) : selectedReviews
}

export function selectLandingReviews<
  T extends Pick<
    ReviewLike,
    "destinationId" | "featured" | "id" | "isVisible" | "sortOrder" | "verificationStatus"
  >,
>(reviews: T[], { destinationIds, limit = 4 }: LandingReviewOptions = {}): T[] {
  const editorialDestinationIds = new Set(destinationIds ?? [])
  const visibleReviews = selectVisibleReviews(reviews)
  const destinationReviews =
    editorialDestinationIds.size > 0
      ? visibleReviews.filter((review) =>
          review.destinationId ? editorialDestinationIds.has(review.destinationId) : false,
        )
      : visibleReviews

  const selectedReviews = [
    ...destinationReviews.filter((review) => review.featured === true),
    ...destinationReviews.filter((review) => review.featured !== true),
    ...visibleReviews.filter((review) => review.featured === true),
  ].filter((review, index, list) => list.findIndex((item) => item.id === review.id) === index)

  return selectedReviews.slice(0, limit)
}

export function getReviewDisplayName(name?: string): string {
  return name?.trim().split(/\s+/)[0] || "Viajero"
}

export function getReviewInitials(name?: string): string {
  return getReviewDisplayName(name).charAt(0).toUpperCase()
}

export function getReviewRating(rating?: number): number {
  if (!rating || Number.isNaN(rating)) return 1
  return Math.min(5, Math.max(1, Math.round(rating)))
}

export function getReviewMeta(
  review: Pick<ReviewLike, "age" | "city">,
  destinationName?: string,
  destinationPrefix = "",
): string {
  const destination = destinationName
    ? `${destinationPrefix}${destinationPrefix ? " " : ""}${destinationName}`
    : undefined

  return [review.age ? `${review.age} años` : undefined, review.city, destination]
    .filter(Boolean)
    .join(" · ")
}

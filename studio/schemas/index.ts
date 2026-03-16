import seoFields from './objects/seoFields'
import faqItem from './objects/faqItem'
import socialLink from './objects/socialLink'
import climateMonth from './objects/climateMonth'
import budgetPerDay from './objects/budgetPerDay'
import destinationSeo from './objects/destinationSeo'
import itineraryDay from './objects/itineraryDay'
import blogSection from './objects/blogSection'
import blogSeo from './objects/blogSeo'
import statItem from './objects/statItem'
import siteSettings from './documents/siteSettings'
import continent from './documents/continent'
import country from './documents/country'
import destination from './documents/destination'
import coordinator from './documents/coordinator'
import trip from './documents/trip'
import testimonial from './documents/testimonial'
import tripCategory from './documents/tripCategory'
import season from './documents/season'
import comparison from './documents/comparison'
import blogPost from './documents/blogPost'
import landingPage from './documents/landingPage'

export const schemaTypes = [
  // Objects (reutilizables)
  seoFields,
  faqItem,
  socialLink,
  climateMonth,
  budgetPerDay,
  destinationSeo,
  itineraryDay,
  blogSection,
  blogSeo,
  statItem,

  // Documents
  siteSettings,
  continent,
  country,
  destination,
  coordinator,
  trip,
  testimonial,
  tripCategory,
  season,
  comparison,
  blogPost,
  landingPage,
]

import { useState } from "react"
import type { BlogPost } from "@/lib/blog-data"

const categories = ["Todos", "Inspiración", "Destinos", "Guías", "Comunidad"]

function PostCard({ post, featured }: { post: BlogPost; featured?: boolean }) {
  return (
    <a href={`/blog/${post.slug}`} className="group">
      <article
        className={`flex h-full flex-col overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
          featured ? "bg-card" : "bg-card"
        }`}
      >
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.image}
            alt={post.imageAlt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <span className="mb-2 inline-block w-fit rounded-full bg-coral/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-coral">
            {post.category}
          </span>
          <h3 className="font-serif text-base font-bold text-foreground leading-snug group-hover:text-secondary transition-colors">
            {post.title}
          </h3>
          {!featured && (
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {post.excerpt}
            </p>
          )}
          <div className="mt-auto flex items-center gap-3 pt-3 text-xs text-muted-foreground">
            <span>{post.date}</span>
            <span>·</span>
            <span>{post.readTime} lectura</span>
          </div>
        </div>
      </article>
    </a>
  )
}

export default function BlogContent({ posts }: { posts: BlogPost[] }) {
  const [active, setActive] = useState("Todos")

  const filtered = active === "Todos" ? posts : posts.filter((p) => p.category === active)
  const featured = filtered.filter((p) => p.featured)
  const regular = filtered.filter((p) => !p.featured)

  return (
    <>
      {/* Categories */}
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-7xl px-6">
          <div className="scrollbar-hide flex gap-1 overflow-x-auto py-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold transition-all ${
                  active === cat
                    ? "bg-teal-deep text-sand"
                    : "text-muted-foreground hover:bg-teal-deep/10 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured posts */}
      {featured.length > 0 && (
        <section className="bg-background py-14">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-extrabold text-foreground">
                Artículos destacados
              </h2>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              {/* Main featured */}
              <a href={`/blog/${featured[0].slug}`} className="group lg:col-span-2">
                <article className="relative overflow-hidden rounded-3xl bg-card shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                  <div className="aspect-[16/9] overflow-hidden">
                    <img
                      src={featured[0].image}
                      alt={featured[0].imageAlt}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-teal-deep/80 via-teal-deep/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <span className="inline-block rounded-full bg-coral px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white">
                      {featured[0].category}
                    </span>
                    <h3 className="mt-3 font-serif text-xl font-extrabold text-white sm:text-2xl leading-tight">
                      {featured[0].title}
                    </h3>
                    <p className="mt-2 hidden text-sm text-sand/80 sm:block leading-relaxed">
                      {featured[0].excerpt}
                    </p>
                    <div className="mt-4 flex items-center gap-4 text-xs text-sand/60">
                      <span>{featured[0].date}</span>
                      <span>·</span>
                      <span>{featured[0].readTime} lectura</span>
                    </div>
                  </div>
                </article>
              </a>

              {/* Side featured */}
              <div className="flex flex-col gap-6">
                {featured.slice(1, 3).map((post) => (
                  <PostCard key={post.slug} post={post} featured />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Regular posts */}
      {regular.length > 0 && (
        <section className="bg-card py-14">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-extrabold text-foreground">
                {featured.length > 0 ? "Últimos artículos" : "Artículos"}
              </h2>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {regular.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <section className="bg-background py-20">
          <div className="mx-auto max-w-md px-6 text-center">
            <p className="font-serif text-xl font-bold text-foreground">
              No hay artículos en esta categoría todavía.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prueba con otra categoría o vuelve pronto.
            </p>
            <button
              onClick={() => setActive("Todos")}
              className="mt-6 inline-flex items-center rounded-full bg-coral px-6 py-2.5 text-sm font-bold text-white transition-all hover:brightness-110"
            >
              Ver todos los artículos
            </button>
          </div>
        </section>
      )}
    </>
  )
}

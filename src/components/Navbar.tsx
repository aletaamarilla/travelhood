import { useState, useEffect, useCallback } from "react"

const navLinks = [
  { label: "Destinos", href: "/viajes/#resultados" },
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Testimonios", href: "/#testimonios" },
  { label: "Travelhood", href: "/travelhood/" },
  { label: "Blog", href: "/blog/" },
  { label: "FAQ", href: "/#faq" },
]

export default function Navbar({ solid = false }: { solid?: boolean }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(solid)

  useEffect(() => {
    if (solid) { setScrolled(true); return }
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [solid])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [open])

  const closeMenu = useCallback(() => setOpen(false), [])

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      const hashIndex = href.indexOf("#")
      if (hashIndex === -1) return

      const path = href.slice(0, hashIndex) || "/"
      const hash = href.slice(hashIndex + 1)
      const isHome = window.location.pathname === "/" || window.location.pathname === ""

      if (path === "/" && isHome) {
        e.preventDefault()
        const el = document.getElementById(hash)
        if (el) {
          setOpen(false)
          setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 50)
        }
      } else {
        setOpen(false)
      }
    },
    []
  )

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          open
            ? "bg-teal-deep"
            : scrolled
              ? "bg-white/90 backdrop-blur-lg shadow-sm"
              : "bg-transparent"
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5">
          <a href="/" className="relative z-50 flex items-center gap-2">
            <img
              src="/images/logo.jpeg"
              alt="Travelhood"
              width={28}
              height={28}
              className="rounded-md"
            />
            <span
              className={`font-serif text-sm font-bold tracking-tight transition-colors duration-300 ${
                open || !scrolled ? "text-white" : "text-foreground"
              }`}
            >
              Travelhood
            </span>
          </a>

          <ul className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className={`text-xs font-medium tracking-wide transition-colors duration-300 hover:opacity-100 ${
                    scrolled
                      ? "text-foreground/60 hover:text-foreground"
                      : "text-white/65 hover:text-white"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden lg:block">
            <a
              href="/viajes/#resultados"
              className={`inline-flex items-center rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-300 ${
                scrolled
                  ? "bg-coral text-white hover:bg-coral/90"
                  : "bg-white/15 text-white backdrop-blur-sm hover:bg-white/25"
              }`}
            >
              Ver viajes
            </a>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className={`relative z-50 flex h-10 w-10 items-center justify-center lg:hidden transition-colors duration-300 ${
              open || !scrolled ? "text-white" : "text-foreground"
            }`}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
          >
            <div className="flex h-4 w-5 flex-col justify-between">
              <span
                className={`block h-[2px] w-full rounded-full bg-current transition-all duration-300 origin-center ${
                  open ? "translate-y-[7px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-full rounded-full bg-current transition-all duration-200 ${
                  open ? "scale-x-0 opacity-0" : ""
                }`}
              />
              <span
                className={`block h-[2px] w-full rounded-full bg-current transition-all duration-300 origin-center ${
                  open ? "-translate-y-[7px] -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 overflow-hidden transition-all duration-500 ease-in-out lg:pointer-events-none lg:hidden ${
          open
            ? "opacity-100 visible"
            : "opacity-0 invisible pointer-events-none"
        }`}
      >
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-deep via-[#1a4f5e] to-teal-deep" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(232,112,74,0.15)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(245,200,66,0.1)_0%,_transparent_50%)]" />

        {/* Decorative shapes */}
        <div
          className={`absolute -top-20 -right-20 h-64 w-64 rounded-full bg-coral/8 transition-all duration-700 ease-out ${
            open ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
        <div
          className={`absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-yellow-sun/8 transition-all duration-700 ease-out ${
            open ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
          style={{ transitionDelay: open ? "150ms" : "0ms" }}
        />
        <div
          className={`absolute top-1/3 right-8 h-24 w-24 rounded-full border border-sand/8 transition-all duration-700 ease-out ${
            open ? "scale-100 opacity-100" : "scale-75 opacity-0"
          }`}
          style={{ transitionDelay: open ? "300ms" : "0ms" }}
        />

        {/* Content */}
        <div className="relative flex h-full flex-col justify-between px-8 pt-24 pb-10">
          <nav>
            <ul className="flex flex-col">
              {navLinks.map((link, i) => (
                <li
                  key={link.href}
                  className={`transform transition-all duration-500 ease-out ${
                    open
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-8 opacity-0"
                  }`}
                  style={{
                    transitionDelay: open ? `${i * 70 + 120}ms` : "0ms",
                  }}
                >
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="group flex items-center gap-4 border-b border-sand/8 py-5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sand/10 text-[11px] font-bold tabular-nums text-coral transition-colors duration-200 group-hover:bg-coral group-hover:text-white">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-serif text-[1.5rem] font-bold text-sand transition-colors duration-200 group-hover:text-white">
                      {link.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div
            className={`flex flex-col gap-5 transform transition-all duration-500 ease-out ${
              open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
            style={{ transitionDelay: open ? "550ms" : "0ms" }}
          >
            <a
              href="/viajes/#resultados"
              onClick={closeMenu}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-coral px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-coral/25 transition-all hover:shadow-xl hover:brightness-110"
            >
              Ver próximos viajes
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </a>

            <div className="flex items-center justify-between rounded-xl bg-sand/5 px-4 py-3">
              <p className="text-[11px] tracking-wide text-sand/50">
                Viajes en grupo · 20–35 años
              </p>
              <a
                href="https://instagram.com/travelhood"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[11px] font-medium text-sand/60 transition-colors hover:text-coral"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                @travelhood
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

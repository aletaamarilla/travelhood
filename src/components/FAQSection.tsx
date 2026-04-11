import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Props {
  faqs: { question: string; answer: string }[]
}

export default function FAQSection({ faqs }: Props) {
  return (
    <section id="faq" className="bg-background py-14">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-10 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-secondary">
            Preguntas frecuentes
          </span>
          <h2 className="mt-3 font-serif text-2xl font-extrabold text-foreground sm:text-3xl text-balance">
            Todo lo que necesitas saber
          </h2>
        </div>

        <Accordion type="single" collapsible className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="rounded-xl bg-card px-6 border-none shadow-sm"
            >
              <AccordionTrigger className="text-left font-serif text-base font-bold text-foreground hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <a
          href="/preguntas-frecuentes/"
          className="mt-8 block text-center text-sm font-semibold text-coral hover:text-coral/80 transition-colors"
        >
          Ver todas las preguntas frecuentes →
        </a>
      </div>
    </section>
  )
}

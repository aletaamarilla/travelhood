import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "¿Puedo ir solo/a al viaje?",
    answer:
      "Por supuesto. La mayoría de nuestros viajeros vienen solos. Esa es precisamente la gracia: llegas sin conocer a nadie y vuelves con un grupo de amigos. El coordinador se encarga de que todos se integren desde el primer momento.",
  },
  {
    question: "¿Qué está incluido en el precio?",
    answer:
      "Alojamiento, transporte interno, actividades programadas y coordinador Travelhood en destino. El vuelo internacional no está incluido, pero te asesoramos para encontrar las mejores opciones.",
  },
  {
    question: "¿Qué edad tiene la gente que va?",
    answer:
      "Nuestros viajes están diseñados para personas de 20 a 35 años. Es un rango cómodo donde todos conectan fácilmente y comparten el mismo momento vital.",
  },
  {
    question: "¿Cómo reservo y qué pasa si tengo que cancelar?",
    answer:
      "Reservas con un formulario simple y una señal inicial. Tenemos política de cancelación flexible: si cancelas con más de 30 días de antelación, te devolvemos el 100% de la señal.",
  },
  {
    question: "¿Son viajes seguros?",
    answer:
      "Totalmente. Todos los viajes incluyen un coordinador con experiencia en destino y protocolos de seguridad. Somos agencia registrada y trabajamos con proveedores locales verificados.",
  },
]

export default function FAQSection() {
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
      </div>
    </section>
  )
}

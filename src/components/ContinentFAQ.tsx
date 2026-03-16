import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface Props {
  faqs: { question: string; answer: string }[]
}

export default function ContinentFAQ({ faqs }: Props) {
  return (
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
  )
}

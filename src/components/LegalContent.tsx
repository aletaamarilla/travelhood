interface PortableTextSpan {
  _type: 'span'
  _key: string
  text: string
  marks?: string[]
}

interface PortableTextBlock {
  _type: 'block'
  _key: string
  style?: string
  children: PortableTextSpan[]
  markDefs?: { _key: string; _type: string; href?: string }[]
  listItem?: string
  level?: number
}

function renderSpan(span: PortableTextSpan, markDefs: PortableTextBlock['markDefs'] = []) {
  let content: React.ReactNode = span.text

  for (const mark of span.marks ?? []) {
    if (mark === 'strong') {
      content = <strong key={`${span._key}-strong`}>{content}</strong>
    } else if (mark === 'em') {
      content = <em key={`${span._key}-em`}>{content}</em>
    } else if (mark === 'underline') {
      content = <u key={`${span._key}-u`}>{content}</u>
    } else {
      const def = markDefs?.find((d) => d._key === mark)
      if (def?._type === 'link' && def.href) {
        content = (
          <a
            key={`${span._key}-link`}
            href={def.href}
            target={def.href.startsWith('http') ? '_blank' : undefined}
            rel={def.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-teal-vivid hover:underline"
          >
            {content}
          </a>
        )
      }
    }
  }

  return <span key={span._key}>{content}</span>
}

function renderBlock(block: PortableTextBlock) {
  const children = block.children.map((child) => renderSpan(child, block.markDefs))

  if (block.listItem === 'bullet') {
    return (
      <li key={block._key} className="ml-6 list-disc text-muted-foreground leading-relaxed">
        {children}
      </li>
    )
  }

  if (block.listItem === 'number') {
    return (
      <li key={block._key} className="ml-6 list-decimal text-muted-foreground leading-relaxed">
        {children}
      </li>
    )
  }

  switch (block.style) {
    case 'h2':
      return (
        <h2
          key={block._key}
          className="mt-10 mb-4 font-serif text-xl font-extrabold text-foreground sm:text-2xl"
        >
          {children}
        </h2>
      )
    case 'h3':
      return (
        <h3
          key={block._key}
          className="mt-8 mb-3 font-serif text-lg font-bold text-foreground sm:text-xl"
        >
          {children}
        </h3>
      )
    case 'h4':
      return (
        <h4
          key={block._key}
          className="mt-6 mb-2 font-serif text-base font-bold text-foreground"
        >
          {children}
        </h4>
      )
    default:
      return (
        <p key={block._key} className="mb-4 text-muted-foreground leading-relaxed">
          {children}
        </p>
      )
  }
}

interface Props {
  body: PortableTextBlock[]
}

export default function LegalContent({ body }: Props) {
  const elements: React.ReactNode[] = []
  let currentListItems: PortableTextBlock[] = []
  let currentListType: string | undefined

  function flushList() {
    if (currentListItems.length === 0) return
    const Tag = currentListType === 'number' ? 'ol' : 'ul'
    elements.push(
      <Tag key={`list-${currentListItems[0]._key}`} className="mb-4">
        {currentListItems.map(renderBlock)}
      </Tag>
    )
    currentListItems = []
    currentListType = undefined
  }

  for (const block of body) {
    if (block._type !== 'block') continue

    if (block.listItem) {
      if (currentListType && currentListType !== block.listItem) {
        flushList()
      }
      currentListType = block.listItem
      currentListItems.push(block)
    } else {
      flushList()
      elements.push(renderBlock(block))
    }
  }
  flushList()

  return <article className="prose-legal">{elements}</article>
}

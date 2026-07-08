'use client'

import MarkdownIt from 'markdown-it'

const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
})

interface Props {
  content: string
}

export function MarkdownRenderer({ content }: Props) {
  const html = md.render(content)

  return (
    <div
      className="prose prose-slate max-w-none break-words"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
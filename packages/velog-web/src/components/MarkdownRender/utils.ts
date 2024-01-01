import katexWhitelist from '@/lib/katexWhiteList'
import sanitize from 'sanitize-html'

function sanitizeEventScript(htmlString: string) {
  return htmlString.replace(/ on\w+="[^"]*"/g, '')
}

export function htmlFilter(html: string) {
  const presanitized = sanitizeEventScript(html)
  return sanitize(presanitized, {
    allowedTags: [
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'p',
      'a',
      'ul',
      'ol',
      'nl',
      'li',
      'b',
      'i',
      'strong',
      'em',
      'strike',
      'code',
      'hr',
      'br',
      'div',
      'table',
      'thead',
      'caption',
      'tbody',
      'tr',
      'th',
      'td',
      'pre',
      'iframe',
      'span',
      'img',
      'del',
      'input',
      ...katexWhitelist.tags,
    ],
    allowedAttributes: {
      a: ['href', 'name', 'target'],
      img: ['src'],
      iframe: ['src', 'allow', 'allowfullscreen', 'scrolling', 'class'],
      '*': ['class', 'id', 'aria-hidden'],
      span: ['style'],
      input: ['type'],
      ol: ['start'],
      ...katexWhitelist.attributes,
    },
    allowedStyles: {
      '*': {
        // Match HEX and RGB
        color: [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
        'text-align': [/^left$/, /^right$/, /^center$/],
      },
      span: {
        ...katexWhitelist.styles,
      },
    },
    allowedIframeHostnames: ['www.youtube.com', 'codesandbox.io', 'codepen.io'],
  })
}

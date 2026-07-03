import React from 'react';

// A simple but robust markdown parser that returns React elements styled with the site's design language
export function parseMarkdown(md: string): React.ReactNode[] {
  if (!md) return [];

  // Replace double newlines with block separators, but ignore block separators inside code blocks
  // For simplicity, we can split by code blocks first
  const parts = md.split(/(```[\s\S]*?```)/g);

  let elementKey = 0;
  const elements: React.ReactNode[] = [];

  parts.forEach((part) => {
    if (part.startsWith('```')) {
      // Code Block
      const lines = part.split('\n');
      const firstLine = lines[0];
      const lang = firstLine.slice(3).trim();
      const code = lines.slice(1, -1).join('\n');
      elements.push(
        React.createElement(
          'pre',
          {
            key: `code-${elementKey++}`,
            className: 'bg-luxury-charcoal border border-luxury-border/30 rounded-xl p-5 my-6 overflow-x-auto text-[11px] font-mono text-gray-300'
          },
          React.createElement('code', { className: lang ? `language-${lang}` : '' }, code)
        )
      );
    } else {
      // Regular text, split into blocks (paragraphs, headers, quotes, lists, tables)
      const blocks = part.split(/\n\s*\n/);
      blocks.forEach((block) => {
        const trimmed = block.trim();
        if (!trimmed) return;

        // 1. Heading
        if (trimmed.startsWith('#')) {
          const match = trimmed.match(/^(#{1,6})\s+(.*)$/);
          if (match) {
            const level = match[1].length;
            const text = match[2];
            const headingClass =
              level === 1
                ? 'text-3xl font-serif text-white mt-10 mb-4 border-b border-luxury-border/10 pb-2'
                : level === 2
                ? 'text-2xl font-serif text-white mt-8 mb-4 border-b border-luxury-border/10 pb-1'
                : level === 3
                ? 'text-xl font-serif text-luxury-gold mt-6 mb-3'
                : 'text-lg font-serif text-white mt-4 mb-2';

            elements.push(
              React.createElement(
                `h${Math.min(level + 1, 6)}`,
                { key: `h-${elementKey++}`, className: headingClass },
                parseInline(text)
              )
            );
            return;
          }
        }

        // 2. Blockquote / Callout Box
        if (trimmed.startsWith('>')) {
          const quoteLines = trimmed.split('\n').map(l => l.replace(/^>\s?/, ''));
          const quoteText = quoteLines.join('\n').trim();

          // Check if it's a special callout
          if (quoteText.startsWith('[!NOTE]') || quoteText.startsWith('[!TIP]') || quoteText.startsWith('[!IMPORTANT]') || quoteText.startsWith('[!WARNING]')) {
            const lines = quoteText.split('\n');
            const typeMatch = lines[0].match(/\[!(NOTE|TIP|IMPORTANT|WARNING)\]/);
            const type = typeMatch ? typeMatch[1] : 'NOTE';
            const body = lines.slice(1).join('\n');

            let calloutClass = 'bg-luxury-dark border-l-2 border-luxury-gold/50 p-5 rounded-r-xl my-6 space-y-1.5';
            let titleClass = 'text-[9px] uppercase tracking-widest text-luxury-gold font-bold block';
            const title = type;

            if (type === 'WARNING') {
              calloutClass = 'bg-red-500/5 border-l-2 border-red-500/50 p-5 rounded-r-xl my-6 space-y-1.5';
              titleClass = 'text-[9px] uppercase tracking-widest text-red-400 font-bold block';
            }

            elements.push(
              React.createElement(
                'div',
                { key: `callout-${elementKey++}`, className: calloutClass },
                React.createElement('span', { className: titleClass }, title),
                React.createElement('p', { className: 'text-xs text-gray-300 leading-relaxed font-light' }, parseInline(body))
              )
            );
            return;
          }

          elements.push(
            React.createElement(
              'blockquote',
              {
                key: `quote-${elementKey++}`,
                className: 'border-l-2 border-luxury-gold pl-6 py-2 my-8 text-base italic text-gray-300 font-light font-serif leading-relaxed'
              },
              parseInline(quoteText)
            )
          );
          return;
        }

        // 3. Lists
        if (trimmed.startsWith('-') || trimmed.startsWith('*') || /^\d+\./.test(trimmed)) {
          const listLines = trimmed.split('\n');
          const isOrdered = /^\d+\./.test(listLines[0].trim());
          const listItems = listLines.map((line) => {
            const itemText = line.replace(/^[-*\d+.]\s+/, '');
            return React.createElement(
              'li',
              { key: `li-item-${elementKey++}`, className: 'text-xs text-gray-400 leading-relaxed font-light mb-1.5' },
              parseInline(itemText)
            );
          });

          elements.push(
            React.createElement(
              isOrdered ? 'ol' : 'ul',
              {
                key: `list-${elementKey++}`,
                className: `${isOrdered ? 'list-decimal' : 'list-disc'} pl-5 my-5 space-y-1 text-luxury-gold`
              },
              listItems
            )
          );
          return;
        }

        // 4. Tables
        if (trimmed.startsWith('|')) {
          const rows = trimmed.split('\n').map((row) =>
            row.split('|').map((cell) => cell.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1)
          ).filter(row => row.length > 0);

          if (rows.length >= 2) {
            const headers = rows[0];
            // Skip rows[1] because it is the divider |---|
            const dataRows = rows.slice(2);

            elements.push(
              React.createElement(
                'div',
                { key: `table-container-${elementKey++}`, className: 'overflow-x-auto my-6 border border-luxury-border/30 rounded-xl bg-luxury-dark' },
                React.createElement(
                  'table',
                  { className: 'w-full text-left border-collapse text-xs' },
                  React.createElement(
                    'thead',
                    null,
                    React.createElement(
                      'tr',
                      { className: 'border-b border-luxury-border/20 text-luxury-gold bg-luxury-charcoal/20 font-bold uppercase tracking-wider text-[9px]' },
                      headers.map((h, i) => React.createElement('th', { key: `th-${i}`, className: 'py-3 px-5' }, h))
                    )
                  ),
                  React.createElement(
                    'tbody',
                    { className: 'divide-y divide-luxury-border/10 text-gray-300 font-light' },
                    dataRows.map((row, rIdx) =>
                      React.createElement(
                        'tr',
                        { key: `tr-${rIdx}`, className: 'hover:bg-luxury-charcoal/5 transition-colors' },
                        row.map((cell, cIdx) => React.createElement('td', { key: `td-${cIdx}`, className: 'py-3 px-5' }, parseInline(cell)))
                      )
                    )
                  )
                )
              )
            );
            return;
          }
        }

        // 5. Video embed syntax @[youtube](id)
        if (trimmed.startsWith('@[youtube]')) {
          const match = trimmed.match(/^@\[youtube\]\((.*?)\)$/);
          if (match) {
            const videoId = match[1];
            elements.push(
              React.createElement(
                'div',
                { key: `youtube-${elementKey++}`, className: 'aspect-video w-full my-6 rounded-2xl overflow-hidden border border-luxury-border/30 shadow-xl' },
                React.createElement('iframe', {
                  src: `https://www.youtube.com/embed/${videoId}`,
                  className: 'w-full h-full',
                  allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
                  allowFullScreen: true,
                  frameBorder: 0
                })
              )
            );
            return;
          }
        }

        // Default: Paragraph
        elements.push(
          React.createElement(
            'p',
            { key: `p-${elementKey++}`, className: 'text-xs sm:text-sm text-gray-400 leading-relaxed font-light my-4' },
            parseInline(trimmed)
          )
        );
      });
    }
  });

  return elements;
}

// Simple parser for inline elements (bold, italic, links, images, inline code)
function parseInline(text: string): React.ReactNode[] {
  let parts: React.ReactNode[] = [text];

  // 1. Parse Images: ![alt](url)
  parts = flatMap(parts, (part) => {
    if (typeof part !== 'string') return [part];
    const regex = /!\[(.*?)\]\((.*?)\)/g;
    const split = part.split(regex);
    const result: React.ReactNode[] = [];
    for (let i = 0; i < split.length; i += 3) {
      result.push(split[i]);
      if (i + 1 < split.length) {
        const alt = split[i + 1];
        const url = split[i + 2];
        result.push(
          React.createElement(
            'span',
            { key: `img-container-${i}`, className: 'block my-6 space-y-2 text-center' },
            React.createElement('img', {
              src: url,
              alt: alt,
              className: 'rounded-2xl border border-luxury-border/30 max-h-[450px] mx-auto object-cover w-full shadow-2xl'
            }),
            alt && React.createElement('span', { className: 'block text-[10px] tracking-wider text-gray-500 font-light italic uppercase' }, alt)
          )
        );
      }
    }
    return result;
  });

  // 2. Parse Links: [text](url)
  parts = flatMap(parts, (part) => {
    if (typeof part !== 'string') return [part];
    const regex = /\[(.*?)\]\((.*?)\)/g;
    const split = part.split(regex);
    const result: React.ReactNode[] = [];
    for (let i = 0; i < split.length; i += 3) {
      result.push(split[i]);
      if (i + 1 < split.length) {
        const linkText = split[i + 1];
        const url = split[i + 2];
        result.push(
          React.createElement(
            'a',
            {
              key: `link-${i}`,
              href: url,
              target: url.startsWith('http') ? '_blank' : '_self',
              rel: 'noopener noreferrer',
              className: 'text-luxury-gold hover:underline font-medium transition-all'
            },
            linkText
          )
        );
      }
    }
    return result;
  });

  // 3. Parse Bold: **text**
  parts = flatMap(parts, (part) => {
    if (typeof part !== 'string') return [part];
    const regex = /\*\*(.*?)\*\*/g;
    const split = part.split(regex);
    const result: React.ReactNode[] = [];
    for (let i = 0; i < split.length; i += 2) {
      result.push(split[i]);
      if (i + 1 < split.length) {
        result.push(React.createElement('strong', { key: `bold-${i}`, className: 'text-white font-semibold' }, split[i + 1]));
      }
    }
    return result;
  });

  // 4. Parse Italic: *text*
  parts = flatMap(parts, (part) => {
    if (typeof part !== 'string') return [part];
    const regex = /\*(.*?)\*/g;
    const split = part.split(regex);
    const result: React.ReactNode[] = [];
    for (let i = 0; i < split.length; i += 2) {
      result.push(split[i]);
      if (i + 1 < split.length) {
        result.push(React.createElement('em', { key: `italic-${i}`, className: 'italic text-gray-300 font-light' }, split[i + 1]));
      }
    }
    return result;
  });

  // 5. Parse Inline Code: `code`
  parts = flatMap(parts, (part) => {
    if (typeof part !== 'string') return [part];
    const regex = /`(.*?)`/g;
    const split = part.split(regex);
    const result: React.ReactNode[] = [];
    for (let i = 0; i < split.length; i += 2) {
      result.push(split[i]);
      if (i + 1 < split.length) {
        result.push(
          React.createElement(
            'code',
            { key: `code-inline-${i}`, className: 'bg-luxury-charcoal border border-luxury-border/30 rounded px-1.5 py-0.5 text-[11px] font-mono text-luxury-gold' },
            split[i + 1]
          )
        );
      }
    }
    return result;
  });

  return parts;
}

// FlatMap helper
function flatMap<T, R>(arr: T[], fn: (val: T) => R[]): R[] {
  const result: R[] = [];
  arr.forEach((x) => {
    result.push(...fn(x));
  });
  return result;
}

"use client";

import { useMemo } from "react";

type Block =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; ordered: boolean; items: string[] };

function parseBlocks(content: string): Block[] {
  const lines = content.replace(/\r/g, "").split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let listItems: string[] | null = null;
  let listOrdered = false;

  const flushParagraph = () => {
    if (paragraph.length > 0) {
      blocks.push({ kind: "paragraph", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (listItems && listItems.length > 0) {
      blocks.push({ kind: "list", ordered: listOrdered, items: listItems });
      listItems = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    const bullet = line.match(/^([•\-*▪–—]|\d+[.)])\s+(.*)$/);
    if (bullet) {
      flushParagraph();
      const ordered = /^\d+[.)]$/.test(bullet[1]);
      if (listItems === null || ordered !== listOrdered) {
        flushList();
        listItems = [];
        listOrdered = ordered;
      }
      listItems.push(bullet[2].trim());
    } else if (line.length <= 90 && /^(#{1,3}\s|[A-ZÀ-Þ\u0600-\u06FF][^.!?]*:?)$/.test(line) && lines.length > 1) {
      flushParagraph();
      flushList();
      blocks.push({ kind: "paragraph", text: line.replace(/^#{1,3}\s/, "") });
    } else {
      flushList();
      paragraph.push(line);
    }
  }
  flushParagraph();
  flushList();
  return blocks.length > 0 ? blocks : [{ kind: "paragraph", text: content.trim() }];
}

/**
 * Structured rendering for system-generated text: preserves paragraphs,
 * bullet/numbered lists and line breaks instead of one dense block.
 * Content itself is never rewritten.
 */
export function RichText({ content, className }: { content: string; className?: string }) {
  const blocks = useMemo(() => parseBlocks(content), [content]);

  return (
    <div className={className}>
      {blocks.map((block, i) =>
        block.kind === "list" ? (
          block.ordered ? (
            <ol key={i} className="my-2 list-decimal space-y-1.5 ps-5">
              {block.items.map((item, j) => (
                <li key={j} className="leading-7">{item}</li>
              ))}
            </ol>
          ) : (
            <ul key={i} className="my-2 list-disc space-y-1.5 ps-5">
              {block.items.map((item, j) => (
                <li key={j} className="leading-7">{item}</li>
              ))}
            </ul>
          )
        ) : (
          <p key={i} className="leading-7 [overflow-wrap:anywhere] [&:not(:last-child)]:mb-2.5">
            {block.text}
          </p>
        ),
      )}
    </div>
  );
}

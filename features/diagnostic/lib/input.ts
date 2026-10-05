/**
 * Whether a draft has anything that could be read as an answer: at least one letter or digit, in any script.
 *
 * Only a quick, kind check before sending — spaces, ".", "???", emoji. The orientation service makes the real
 * decision (it also catches "aaaa" and keyboard mashing), so nothing here is a rule the server relies on.
 */
export function hasReadableContent(text: string): boolean {
  return /[\p{L}\p{N}]/u.test(text);
}

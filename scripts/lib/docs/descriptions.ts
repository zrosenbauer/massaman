const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n)*/u
const DESCRIPTION = /^description:\s*.*$/mu

export function withReferenceDescription(content: string): string {
  const description = extractReferenceDescription(content)
  const match = content.match(FRONTMATTER)

  if (match === null) {
    return `---\ndescription: ${JSON.stringify(description)}\n---\n\n${content}`
  }

  const matter = match[1]
  const nextMatter = DESCRIPTION.test(matter)
    ? matter.replace(DESCRIPTION, `description: ${JSON.stringify(description)}`)
    : `${matter}\ndescription: ${JSON.stringify(description)}`
  return content.replace(FRONTMATTER, `---\n${nextMatter}\n---\n\n`)
}

export function extractReferenceDescription(content: string): string {
  const body = content
    .replace(FRONTMATTER, '')
    .replace(/<details>[\s\S]*?<\/details>/gu, '')
    .replace(/```[\s\S]*?```/gu, '')
    .replace(/^import\s.+$/gmu, '')
  const paragraph = body
    .split(/\r?\n\s*\r?\n/gu)
    .map((block) => block.trim())
    .find(
      (block) =>
        block.length > 0 &&
        !block.startsWith('#') &&
        !block.startsWith('<') &&
        !block.startsWith('|') &&
        !block.startsWith('- ')
    )

  if (paragraph === undefined) throw new Error('Reference page has no descriptive paragraph')

  const plain = paragraph
    .replace(/\[([^\]]+)\]\([^)]+\)/gu, '$1')
    .replace(/[`*_]/gu, '')
    .replace(/\s+/gu, ' ')
    .trim()
  const sentence = plain.match(/^.*?[.!?](?:\s|$)/u)?.[0]?.trim() ?? plain
  return sentence
}

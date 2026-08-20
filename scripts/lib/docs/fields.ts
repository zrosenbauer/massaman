const FIELD_IMPORT = "import { Field } from '@ciderpress/ui/theme'"
const LEGACY_FIELD_IMPORT = "import { Field, FieldGroup } from '@ciderpress/ui/theme'"
const PARAMETERS_HEADING = '#### Parameters'
const RETURNS_HEADING = '#### Returns'
const SECTION_HEADING = /^#{2,4} /u
const RETURN_BOUNDARY = /^(?:#{2,4} |---$)/u
const PARAMETER = /^- `([^`]+)` \(`([^`]+)`(?:, (optional))?\):\s*(.*)$/u
const RETURN = /^\(`([^`]+)`\):\s*(.*)$/u
const ATTRIBUTE_ENTITIES = new Map([
  ['&', '&amp;'],
  ['"', '&quot;'],
  ['<', '&lt;'],
  ['>', '&gt;'],
])

type Field = {
  name: string
  type: string
  optional: boolean
  body: string[]
}

type FieldState = {
  fields: Field[]
  current: Field | null
  valid: boolean
}

type TransformState = {
  output: string[]
  skipUntil: number
  count: number
}

type Section = {
  end: number
  replacement: string[]
}

type TransformResult = {
  content: string
  count: number
  changed: boolean
}

const escapeAttribute = (value: string): string =>
  value.replace(/[&"<>]/gu, (character: string) => ATTRIBUTE_ENTITIES.get(character) ?? character)

const requiredAttribute = (optional: boolean): string => {
  if (optional) return ''
  return ' required'
}

const appendCurrent = (fields: Field[], current: Field | null): Field[] => {
  if (current === null) return fields
  return [...fields, current]
}

const renderField = ({ name, type, optional, body }: Field): string => {
  const required = requiredAttribute(optional)
  const description = body.join('\n').trimEnd()

  return `<Field name="${escapeAttribute(name)}" type="${escapeAttribute(type)}"${required}>\n${description}\n</Field>`
}

const parseFields = (lines: string[]): Field[] | null => {
  const parsed = lines.reduce<FieldState>(
    (state, line) => {
      const match = line.match(PARAMETER)

      if (match === null) {
        if (state.current === null) {
          return {
            fields: state.fields,
            current: state.current,
            valid: line.trim() === '' && state.valid,
          }
        }
        return {
          fields: state.fields,
          current: { ...state.current, body: state.current.body.concat(line) },
          valid: state.valid,
        }
      }

      const fields = appendCurrent(state.fields, state.current)
      return {
        fields,
        current: {
          name: match[1],
          type: match[2],
          optional: match[3] === 'optional',
          body: [match[4]],
        },
        valid: state.valid,
      }
    },
    { fields: [], current: null, valid: true }
  )
  const fields = appendCurrent(parsed.fields, parsed.current)

  if (!parsed.valid || fields.length === 0) return null
  return fields
}

const transformParameterSection = (lines: string[], start: number): Section | null => {
  const contentStart = blankLineOffset(lines[start + 1]) + start + 1
  const relativeEnd = lines.slice(contentStart).findIndex((line) => SECTION_HEADING.test(line))
  const end = sectionEnd(lines.length, contentStart, relativeEnd)
  const fields = parseFields(lines.slice(contentStart, end))

  if (fields === null) return null
  return {
    end,
    replacement: [PARAMETERS_HEADING, ...fields.flatMap((field) => ['', renderField(field)]), ''],
  }
}

const blankLineOffset = (line: string | undefined): number => {
  if (line?.trim() === '') return 1
  return 0
}

const sectionEnd = (lineCount: number, contentStart: number, relativeEnd: number): number => {
  if (relativeEnd === -1) return lineCount
  return contentStart + relativeEnd
}

const transformSections = (lines: string[]): TransformState => {
  const transformed = lines.reduce<TransformState>(
    (state, line, index) => {
      if (index < state.skipUntil) return state
      if (line !== PARAMETERS_HEADING) return { ...state, output: [...state.output, line] }

      const section = transformParameterSection(lines, index)
      if (section === null) return { ...state, output: [...state.output, line] }
      return {
        output: [...state.output, ...section.replacement],
        skipUntil: section.end,
        count: state.count + 1,
      }
    },
    { output: [], skipUntil: 0, count: 0 }
  )

  return transformed
}

const trimBlankLines = (lines: string[]): string[] => {
  const start = lines.findIndex((line) => line.trim() !== '')
  if (start === -1) return []
  const reversedEnd = lines.toReversed().findIndex((line) => line.trim() !== '')
  return lines.slice(start, lines.length - reversedEnd)
}

const transformReturnSection = (lines: string[], start: number): Section | null => {
  const contentStart = blankLineOffset(lines[start + 1]) + start + 1
  const match = lines[contentStart]?.match(RETURN)
  if (match === null || match === undefined) return null
  const relativeEnd = lines.slice(contentStart + 1).findIndex((line) => RETURN_BOUNDARY.test(line))
  const end = sectionEnd(lines.length, contentStart + 1, relativeEnd)
  const description = trimBlankLines([match[2], ...lines.slice(contentStart + 1, end)])

  return {
    end,
    replacement: [RETURNS_HEADING, '', ...description, '', '```typescript', match[1], '```', ''],
  }
}

const transformReturns = (lines: string[]): TransformState =>
  lines.reduce<TransformState>(
    (state, line, index) => {
      if (index < state.skipUntil) return state
      if (line !== RETURNS_HEADING) return { ...state, output: [...state.output, line] }

      const section = transformReturnSection(lines, index)
      if (section === null) return { ...state, output: [...state.output, line] }
      return {
        output: [...state.output, ...section.replacement],
        skipUntil: section.end,
        count: state.count + 1,
      }
    },
    { output: [], skipUntil: 0, count: 0 }
  )

const normalizeFieldGroups = (content: string): string =>
  content
    .replace(LEGACY_FIELD_IMPORT, FIELD_IMPORT)
    .replaceAll('<FieldGroup title="Parameters">', PARAMETERS_HEADING)
    .replaceAll(/\n\n<\/FieldGroup>(?=\n\n#### Returns)/gu, '')

const addFieldImport = (content: string): string => {
  if (content.includes(FIELD_IMPORT)) return content
  return `${FIELD_IMPORT}\n\n${content}`
}

const addFieldImportWhenNeeded = (content: string, parameterCount: number): string => {
  if (parameterCount === 0) return content
  return addFieldImport(content)
}

export const transformReferenceFields = (content: string): TransformResult => {
  const normalized = normalizeFieldGroups(content)
  const parameters = transformSections(normalized.split('\n'))
  const returns = transformReturns(parameters.output)
  const output = returns.output.join('\n')
  const count = parameters.count + returns.count
  const changed = normalized !== content || count > 0

  if (!changed) return { content, count: 0, changed: false }
  const transformed = addFieldImportWhenNeeded(output, parameters.count)
  return { content: transformed, count, changed: true }
}

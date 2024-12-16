export function humanLogger(input: string) {
  const words = input.replace(/\"/g, "").split(" ")
  const result: string[] = []
  const suffixMap = new Map() // Tracks suffixes for current groups
  const processed = new Set() // Tracks bases processed in the current position

  words.forEach((word) => {
    const [base, suffix] = word.split(".")

    if (!suffix) {
      // Standalone word: finalize any ongoing groups, then add to result
      suffixMap.forEach((suffixes, key) => {
        result.push(`${key}[${[...suffixes].join(" ")}]`)
      })
      suffixMap.clear() // Clear the current grouping
      processed.clear() // Reset tracking for interrupted groups
      result.push(base) // Add standalone word
    } else {
      // Grouped word: check if we need to start a new group
      if (!processed.has(base)) {
        // If the base hasn't been processed yet in this context, finalize any previous group
        if (suffixMap.has(base)) {
          result.push(`${base}[${[...suffixMap.get(base)].join(" ")}]`)
          suffixMap.delete(base) // Clear the previous group for the base
        }
        processed.add(base) // Mark base as processed
        suffixMap.set(base, new Set())
      }
      // Add suffix to the current group
      suffixMap.get(base).add(suffix)
    }
  })

  return (
    " --- " +
    result
      .join(" ")
      .replace(/(\w+)\[/g, "\x1b[33m$1\x1b[0m\x1b[32m[")
      .replace(/,]/g, "]")
      .replace(/\]/g, "]\x1b[0m")
  )
}

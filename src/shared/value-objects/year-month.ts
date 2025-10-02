export type YearMonth = `${number}-${number}`

export const yearMonth = (value: Date | string | number): YearMonth | null => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    console.error('Invalid date', value)
    return null
  }

  const [year, month] = date.toISOString().split('-').map(Number)
  if (year === undefined || month === undefined) {
    console.error('Invalid date', value)
    return null
  }

  return `${year}-${month}`
}

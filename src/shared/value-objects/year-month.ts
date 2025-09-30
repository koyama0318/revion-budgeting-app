export type YearMonth = `${number}-${number}`

export const yearMonth = (date: Date): YearMonth | null => {
  const [year, month] = date.toISOString().split('-').map(Number)
  if (year === undefined || month === undefined) {
    console.error('Invalid date', date)
    return null
  }
  return `${year}-${month}`
}

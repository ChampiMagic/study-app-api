// CONSTANTS
const days = [
  1,
  1,
  1,
  1
]

export const getDate = (index) => {
  const date = new Date()
  // date.setDate(date.getDate() + days[index])
  date.setMinutes(date.getMinutes() + days[index])
  return date
}

export const sortByDate = (a, b) => {
  return new Date(b.data.date) - new Date(a.data.date)
}

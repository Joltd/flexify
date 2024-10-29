export function localStorageApi(field: string) {
  let data = JSON.parse(localStorage.getItem(field) || '{}')

  const set = (newData: any) => {
    data = newData
    localStorage.setItem(field, JSON.stringify(data))
  }

  const update = (newData: any) => {
    set({ ...data, ...newData })
  }

  return {
    data,
    set,
    update,
  }
}
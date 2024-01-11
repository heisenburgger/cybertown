type Wrap<K extends string, D> = {
  [key in K]: D
}

export async function fetchios<K extends string, D>(url: string) {
  try {
    const res = await fetch(url, {
      credentials: 'include',
    })
    const data = await res.json()
    return data as Wrap<K, D>
  } catch(err) {
    console.error("fetchios:", err)
    throw err
  }
}

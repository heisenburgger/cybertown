type Wrap<K extends string | undefined, D> = {
  [key in K as `${K}`]: D | null
}

export async function fetchios<K extends string | undefined, D = undefined>(url: string, options: RequestInit = {}) {
  try {
    const res = await fetch(url, {
      ...options,
      credentials: 'include',
    })
    const data = await res.json()
    if(!res.ok) {
      console.error("fetchios:", data.error)
      return null
    }
    return data as Wrap<K, D>
  } catch(err) {
    console.error("fetchios:", err)
    return null
  }
}

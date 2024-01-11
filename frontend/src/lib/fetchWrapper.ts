type Wrap<T extends string, D> = {
  [Key in T]: D
}

type PromiseWrap<T extends string, D> = Promise<Wrap<T, D>>

export async function fetchWrapper<K extends string, D>(url: string, options: RequestInit = {}): PromiseWrap<K, D> {
  try {
    const resp = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    // it is assumed that the api we are interacting always returns json
    const data = await resp.json()
    if (!resp.ok) {
      throw new Error(data.error ?? "Failed")
    }
    return data
  } catch (err) {
    console.error("fetchWrapper:", err)
    throw err
  }
}

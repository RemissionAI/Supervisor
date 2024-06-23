interface FetchOptions {
  headers?: Record<string, string>
  body?: Record<string, any>
}

interface UseStreamingFetchReturn {
  result: Ref<string>
  fetchData: () => Promise<void>
  error: Ref<Error | undefined>
  stop: () => void
  input: Ref<string>
  handleSubmit: (event: Event) => void
  isLoading: Ref<boolean>
}

export function useStreamingFetch(
  url: string,
  options: FetchOptions = {},
): UseStreamingFetchReturn {
  const input = ref<string>('')
  const result = ref<string>('')
  const error = ref<Error | undefined>(undefined)
  const isLoading = ref<boolean>(false)
  let abortController = new AbortController()

  const fetchData = async (): Promise<void> => {
    isLoading.value = true
    error.value = undefined
    abortController = new AbortController()

    const requestBody = {
      ...options.body,
      prompt: input.value,
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        body: JSON.stringify(requestBody),
        signal: abortController.signal,
      })

      if (!response.body) {
        throw new Error('ReadableStream not supported')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let resultText = ''
      let eventData = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done)
          break

        const decodedValue = decoder.decode(value, { stream: true })
        eventData += decodedValue

        const lines = eventData.split('\n')
        eventData = lines.pop()!

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataContent = line.replace('data: ', '').trim()

            if (dataContent)
              resultText += JSON.parse(dataContent)
          }
        }

        result.value = resultText
      }

      isLoading.value = false
    }
    catch (err: any) {
      if (err.name === 'AbortError') {
        error.value = new Error('Request was aborted')
      }
      else {
        error.value = err
      }
      isLoading.value = false
    }
  }

  const stop = (): void => {
    abortController.abort()
  }

  const setInput = (newInput: string): void => {
    input.value = newInput
  }

  const handleSubmit = (event: Event): void => {
    event.preventDefault()
    fetchData()
    setInput('')
  }

  return {
    result,
    fetchData,
    error,
    stop,
    input,
    handleSubmit,
    isLoading,
  }
}

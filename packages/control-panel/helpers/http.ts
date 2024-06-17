interface ApiResponse<T> {
  success: false;
  errors?: Array<{ code?: string; message: string; field?: string }>;
  data?: T;
}

class Client {
  headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  public async get<T>(path: string): Promise<ApiResponse<T>> {
    return await this.request<T>(path, "GET");
  }

  public async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return await this.request<T>(path, "POST", body);
  }

  public async put<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return await this.request<T>(path, "PUT", body);
  }

  public async delete<T>(path: string): Promise<ApiResponse<T>> {
    return await this.request<T>(path, "DELETE");
  }

  public addHeaders(headers: HeadersInit) {
    this.headers = {
      ...this.headers,
      ...headers,
    };
  }

  private getHeaders(body?: unknown): HeadersInit {
    if (body instanceof FormData) {
      return {
      };
    }

    return {
      ...this.headers,
    };
  }

  private async request<T>(
    path: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const baseUrl = useRuntimeConfig().public.apiBaseUrl;

    const url = `${baseUrl}${path}`;
    const headers = this.getHeaders(body);

    const requestOptions: RequestInit = {
      method,
      headers,
    };

    if (body)
      requestOptions.body =
        body instanceof FormData ? body : JSON.stringify(body);
    try {
      const response = await fetch(url, requestOptions);

      return await response.json();
    } catch (error) {
      if (error instanceof Error)
        return { success: false, errors: [{ message: error.message }] };
      else throw error;
    }
  }
}

export default new Client();

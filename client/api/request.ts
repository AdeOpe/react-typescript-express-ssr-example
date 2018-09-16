export class RequestApi {
  constructor(private baseUrl: string, private defaultOptions?: Object) {}

  public get(url: string, options?: Object) {
    return this.createRequest('GET', url, options);
  }

  public post(url: string, body?: Object, options?: Object) {
    const fullOptions = Object.assign({}, { body: JSON.stringify(body) }, options);
    return this.createRequest('POST', url, fullOptions);
  }

  public put(url: string, body?: Object, options?: Object) {
    const fullOptions = Object.assign({}, { body: JSON.stringify(body) }, options);
    return this.createRequest('PUT', url, fullOptions);
  }

  public patch(url: string, body?: Object, options?: Object) {
    const fullOptions = Object.assign({}, { body: JSON.stringify(body) }, options);
    return this.createRequest('PATCH', url, fullOptions);
  }

  public delete(url: string, body?: Object, options?: Object) {
    const fullOptions = Object.assign({}, { body: JSON.stringify(body) }, options);
    return this.createRequest('DELETE', url, fullOptions);
  }

  private createRequest(method: string, url?: string, options?: Object) {
    const fullOptions = Object.assign({ method }, this.defaultOptions, options);
    return fetch(`${this.baseUrl}${url}`, fullOptions).then(res => res.json());
  }
}

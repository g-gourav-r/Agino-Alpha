export const GET = 'get';
export const POST = 'post';
export const PUT = 'put';

const createApiCall =
  (url, method) =>
  (params = {}) => {

    let apiEndpoint = "http://127.0.0.1:8000/" + url;

    const { body, urlParams, pathVariables } = params;

    if (urlParams) {
      apiEndpoint = `${apiEndpoint}?${new URLSearchParams(urlParams)}`;
    }

    if (pathVariables) {
      apiEndpoint = Object.keys(pathVariables).reduce(
        (acc, curr) => acc.replace(`{${curr}}`, String(pathVariables[curr])),
        apiEndpoint,
      );
    }

    return fetch(apiEndpoint, {
      method,
      body: JSON.stringify(body),
    }).then(async res => {
      const resp = await res.json();
      if (res.ok) return Promise.resolve(resp);
      return Promise.reject(resp);
    });
  };

export default createApiCall;
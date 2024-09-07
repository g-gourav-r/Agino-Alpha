export const GET = 'get';
export const POST = 'post';
export const PUT = 'put';

const createApiCall = (url, method) => (params = {}) => {
    let apiEndpoint = "http://127.0.0.1:3000/" + url;
    const { body, urlParams, pathVariables, headers = {} } = params;

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
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: method !== GET ? JSON.stringify(body) : undefined,
    })
    .then(async res => {
        const resp = await res.json();
        if (res.ok) return Promise.resolve(resp);
        return Promise.reject(resp);
    });
};

export default createApiCall;

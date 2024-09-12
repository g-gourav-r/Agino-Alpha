export const GET = 'get';
export const POST = 'post';
export const PUT = 'put';

const createApiCall = (url, method) => (params = {}) => {
    let apiEndpoint = "https://primus-1ppt.onrender.com/" + url;
    const { body, urlParams, pathVariables, headers = {} } = params;

    if (urlParams) {
        apiEndpoint = `${apiEndpoint}?${new URLSearchParams(urlParams)}`;
    }

    if (pathVariables) {
        apiEndpoint = Object.keys(pathVariables).reduce(
            (acc, curr) => acc.replace(`{${curr}}`, String(pathVariables[curr])),
            apiEndpoint
        );
    }

    const fetchOptions = {
        method,
        headers: {
            ...headers,
        },
        body: method !== GET ? body : undefined,
    };

    // Set Content-Type for JSON requests only
    if (body && !(body instanceof FormData)) {
        fetchOptions.headers['Content-Type'] = 'application/json';
    }

    return fetch(apiEndpoint, fetchOptions)
        .then(async (res) => {
            const resp = await res.json();
            if (res.ok) return Promise.resolve(resp);
            return Promise.reject(resp);
        });
};

export default createApiCall;

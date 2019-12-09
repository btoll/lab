let apiEl;
let menuEl;
let methodEl;
let modalEl;
let requestHeadersEl;
let responseBodyEl;
let responseHeadersEl;
let roundAfterEl;
let selectedNodeEl;
let statusCodeEl;
let statusTextEl;

const changeNode = node => {
    openModal(templates.changeNode);

    NODE = node;
    selectedNodeEl.innerHTML = node;
    methodEl.innerHTML = "GET";
    apiEl.innerHTML = "http://127.0.0.1:8080";
    statusCode.innerHTML = "200";
    statusText.innerHTML = "OK";
    requestHeadersEl.innerHTML = responseHeadersEl.innerHTML = responseBodyEl.innerHTML = "";

    setClassnames("error", "success");
    setNodeInfo().finally(closeModal);
};

const closeModal = (withDelay = true) => {
    if (withDelay) {
        setTimeout(() => {
            modalEl.close();
            modalEl.innerHTML = "";
        }, 300);
    } else {
        modalEl.close();
    }
};

const openModal = (modalType = templates.spinner) => {
    modalEl.innerHTML = modalType;

    if (!modalEl.open) {
        modalEl.showModal();
    }
};

const get =
    document.getElementById.bind(document);

const getFromDisk = async (f, parseResponseText = true) => {
    openModal();

    const data = await fetch(f);

    const {
        status,
        statusText,
        url
    } = data;

    apiEl.innerHTML = url;
    statusCodeEl.innerHTML = status;
    statusTextEl.innerHTML = statusText;
    requestHeadersEl.innerHTML = "";
    responseHeadersEl.innerHTML =
        // Process the 2D array of response headers.
        Array.from(data.headers).map(e =>
            e.join(": ")
        ).join("\n");

    responseBodyEl.innerHTML =
        !parseResponseText ? await data.text() : prettify(await data.json());

    setClassnames("error", "success");
    closeModal();
};

const prettify = o =>
    JSON.stringify(o, null, 4);

const processError = err => {
    if (err.clientError || err.response) {
        // A `clientError` indicates a 400 Bad Request or 401 Unauthorized.
        const {
            error,
            body,
            headers: responseHeaders,
            statusCode,
            statusText,
            text,
            req: {
                header: requestHeaders,
                method,
                url
            }
        } = !err.clientError ? err.response : err;

        apiEl.innerHTML = url;
        methodEl.innerHTML = method;
        requestHeadersEl.innerHTML = prettify(requestHeaders);
        statusCodeEl.innerHTML = statusCode;
        statusTextEl.innerHTML = `${statusText}: ${error.message} (${text})`;
        responseHeadersEl.innerHTML = prettify(responseHeaders);
        responseBodyEl.innerHTML = prettify(body || error);
    } else {
        statusTextEl.innerHTML = responseBodyEl.innerHTML = err.message;
        statusCodeEl.innerHTML = "500";

        apiEl.innerHTML =
        methodEl.innerHTML =
        requestHeadersEl.innerHTML =
        responseHeadersEl.innerHTML = "";
    }

    setClassnames("success", "error");
};

const processPromise = promise => {
    openModal();

    promise.then(({
        req: {
            url,
            method,
            header: requestHeaders
        },
        body,
        header: responseHeaders,
        statusCode,
        statusText
    }) => {
        apiEl.innerHTML = url;
        methodEl.innerHTML = method;
        requestHeadersEl.innerHTML = prettify(requestHeaders);
        statusCodeEl.innerHTML = statusCode;
        statusTextEl.innerHTML = statusText;
        responseHeadersEl.innerHTML = prettify(responseHeaders);
        responseBodyEl.innerHTML = prettify(body);

        setClassnames("error", "success");
    })
    .catch(processError)
    .finally(closeModal);
};

const setClassnames = (from, to) => {
    methodEl.classList.replace(from, to);
    apiEl.classList.replace(from, to);
    statusCodeEl.classList.replace(from, to);
};

const setElementReferences = () => {
    apiEl = get("api");
    menuEl = get("menu");
    methodEl = get("method");
    modalEl = get("modal");
    requestHeadersEl = get("requestHeaders");
    responseBodyEl = get("responseBody");
    responseHeadersEl = get("responseHeaders");
    roundAfterEl = get("round");
    selectedNodeEl = get("selectedNode");
    statusCodeEl = get("statusCode");
    statusTextEl = get("statusText");
};

const setNodeInfo = () => {
    const pathToNode = `${NETWORK}/${NODE}`;
    const pathToKmd = `${pathToNode}/${KMD_VERSION}`;

    return Promise.all([
        fetch(`${pathToNode}/algod.token`),
        fetch(`${pathToNode}/algod.net`),
        fetch(`${pathToKmd}/kmd.token`),
        fetch(`${pathToKmd}/kmd.net`)
    ])
    .then(async ([
        algodToken,
        algodNet,
        kmdToken,
        kmdNet
    ]) => {
        ALGOD_TOKEN = await algodToken.text();
        ALGOD_PORT = (await algodNet.text()).split(":")[1];
        algod = new algosdk.Algod(ALGOD_TOKEN, SERVER, ALGOD_PORT);

        KMD_TOKEN = await kmdToken.text();
        KMD_PORT = (await kmdNet.text()).split(":")[1];
        kmd = new algosdk.Kmd(KMD_TOKEN, SERVER, KMD_PORT);
    })
    .catch(err => {
        // TODO
    });
};


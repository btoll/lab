const FUNCTION_SIGNATURE = `<div id="signature">{{SIGNATURE}}</div>`;
const INITIATE_PROCESS = `Enter the wallet handle token to initiate the process.`;
const RE_TOKENS = /{{([A-Z_]*)}}/gm;

const parseTemplate = (tpl, fn) =>
    tpl.replace(RE_TOKENS, fn);

const makeList = (id, options) => {
    const opts =
        options
        .map(({id, name}) => `<option value="${id}">${name || id}</option>`)
        .sort();

    return `<select id="${id || "default"}">${opts.join("")}</select>`;
};

const htmlSnippets = {
    // Note that not every template will need all the hidden fields, but that's ok.
    hidden: `
        <input type="hidden" id="callback" value="{{CALLBACK}}">
        <input type="hidden" id="walletHandleToken" value="{{WALLET_HANDLE_TOKEN}}">
        <input type="hidden" id="walletPassword" value="{{WALLET_PASSWORD}}">
    `,
    submit: `
        <div>
            <label></label>
            <button id="{{SUBMIT_ID}}" type="submit">Confirm</button>
            <button id="cancelModal">Cancel</button>
        </div>
    `,
    walletHandleToken: `
        <div>
            <label for="walletHandleToken">Wallet Handle Token</label>
            <input id="walletHandleToken" type="text">
        </div>
    `,
    walletID: `
        <div>
            <label for="walletID">Wallet ID</label>
            {{SELECT}}
        </div>
    `,
    walletPassword: `
        <div>
            <label for="walletPassword">Wallet Password</label>
            <input type="password" id="walletPassword">
        </div>
    `
};

const templates = {
    changeNode: `<h1>Changing Node</h1>`,
    createWallet: `
        ${FUNCTION_SIGNATURE}
        <form>
            <div>
                <label for="walletName">Wallet Name</label>
                <input type="text" id="walletName">
            </div>
            ${htmlSnippets.walletPassword}
            <div>
                <label for="walletDriverName">Wallet Driver Name</label>
                <input type="text" id="walletDriverName" value="sqlite">
            </div>
            <div>
                <label for="mdk">Master Deriviation Key</label>
                <input type="text" id="mdk">
            </div>
            ${parseTemplate(htmlSnippets.submit, () => "submitCreateWalletModal")}
        </form>
    `,
    // TODO
    deleteKey: `
        ${FUNCTION_SIGNATURE}
        <form>
            {{SELECT}}
            ${parseTemplate(htmlSnippets.submit, () => "submitKeyModal")}
            ${htmlSnippets.hidden}
        </form>
    `,
    // TODO
    exportKey: `
        ${FUNCTION_SIGNATURE}
        <form>
            {{SELECT}}
            ${parseTemplate(htmlSnippets.submit, () => "submitKeyModal")}
            ${htmlSnippets.hidden}
        </form>
    `,
    generateAccount: `
        <div id="generateAccount">
            ${FUNCTION_SIGNATURE}
            <div>
                <div>
                    <h3>Address</h3>
                    <p id="address">{{ADDRESS}}</p>
                </div>
                <div>
                    <h3>Mnemonic</h3>
                    <p id="mnemonic">{{MNEMONIC}}</p>
                </div>
                <div>
                    <h3>Secret Key</h3>
                    <div id="secretKey">{{SECRET_KEY}}</div>
                </div>
            </div>
        </div>
    `,
    getNumber: `
        ${FUNCTION_SIGNATURE}
        <form>
            <div>
                <label for="round">Round</label>
                <input id="round" type="number" min="1" value="1">
            </div>
            ${parseTemplate(htmlSnippets.submit, () => "submitGetNumberModal")}
            ${htmlSnippets.hidden}
        </form>
    `,
    importKey: `
        ${FUNCTION_SIGNATURE}
        <form>
            ${htmlSnippets.walletHandleToken}
            <div>
                <label for="secretKey">Secret Key</label>
                <input id="secretKey" type="text" value="{{SECRET_KEY}}">
            </div>
            ${parseTemplate(htmlSnippets.submit, () => "submitImportKeyModal")}
        </form>
    `,
    initWalletHandle: `
        ${FUNCTION_SIGNATURE}
        <form>
            ${htmlSnippets.walletID}
            ${htmlSnippets.walletPassword}
            ${parseTemplate(htmlSnippets.submit, () => "submitInitWalletHandleModal")}
        </form>
    `,
    renameWallet: `
        ${FUNCTION_SIGNATURE}
        <form>
            ${htmlSnippets.walletID}
            ${htmlSnippets.walletPassword}
            <div>
                <label for="walletRename">New Wallet Name</label>
                <input type="text" id="walletRename">
            </div>
            ${parseTemplate(htmlSnippets.submit, () => "submitRenameWalletModal")}
        </form>
    `,
    sendRawTransaction: `
        ${FUNCTION_SIGNATURE}
        <form>
            <div>
                <label for="rawTxn">Raw Transaction</label>
                <textarea cols="60" rows="10" id="rawTxn" readonly>{{TRANSACTION}}</textarea>
            </div>
            ${parseTemplate(htmlSnippets.submit, () => "submitSendRawTransactionModal")}
        </form>
    `,
    spinner: `<img src="/static/image/algorand.jpeg">`,
    transaction: `
        ${FUNCTION_SIGNATURE}
        <form>
            <div>
                <label for="fromAddress">From Address</label>
                {{SELECT}}
            </div>
            <div>
                <label for="toAddress">To Address</label>
                <input id="toAddress" type="text">
            </div>
            <div>
                <label for="fee">Fee</label>
                <input id="fee" type="number" min="1" value="{{MIN_FEE}}">
            </div>
            <div>
                <label for="amount">Amount</label>
                <input id="amount" type="number" min="1" value="1">
            </div>
            <div>
                <label for="firstRound">First Round</label>
                <input id="firstRound" type="number" min="1" value="{{FIRST_ROUND}}">
            </div>
            <div>
                <label for="lastRound">Last Round</label>
                <input id="lastRound" type="number" min="1" value="{{LAST_ROUND}}">
            </div>
            <div>
                <label for="genesisID">Genesis ID</label>
                <input id="genesisID" type="text" value="{{GENESIS_ID}}">
            </div>
            <div>
                <label for="genesisHash">Genesis Hash</label>
                <input id="genesisHash" type="text" value="{{GENESIS_HASH}}">
            </div>
            ${parseTemplate(htmlSnippets.submit, () => "submitTransactionModal")}
            ${htmlSnippets.hidden}
        </form>
    `,
    // This is different from the `walletHandle` template because it sets the
    // `walletHandleToken` string in a variable for other templates to use.
    getWalletHandle: `
        ${FUNCTION_SIGNATURE}
        <form>
            ${htmlSnippets.walletHandleToken}
            ${htmlSnippets.walletPassword}
            ${parseTemplate(htmlSnippets.submit, () => "getWalletHandleModal")}
            ${htmlSnippets.hidden}
        </form>
    `,
    walletHandle: `
        ${FUNCTION_SIGNATURE}
        <form>
            ${htmlSnippets.walletHandleToken}
            ${parseTemplate(htmlSnippets.submit, () => "submitWalletHandleModal")}
            ${htmlSnippets.hidden}
        </form>
    `
};

const templateFunctions = {
    // TODO
    deleteKey: () => {
        const walletHandleToken = get("walletHandleToken").value;

        return kmd.listKeys(walletHandleToken)
        .then((
            {
                body: {
                    addresses
                }
            }
        ) => {
            openModal(
                parseTemplate(
                    templates.deleteKey,
                    (_, $1) => ({
                        CALLBACK: "deleteKey",
                        SELECT: makeList(
                            "address",
                            addresses.map(address =>
                                ({
                                    id: address,
                                    name: address
                                })
                            )
                        ),
                        WALLET_HANDLE_TOKEN: walletHandleToken,
                        WALLET_PASSWORD: get("walletPassword").value || "",
                        SIGNATURE: `func <span class="func">deleteKey</span>(<span class="param">walletHandle</span> string, <span class="param">walletPassword</span> string, <span class="param">addr</span> string)`
                    })[$1]
                )
            );
        });
    },
    // TODO
    exportKey: () => {
        const walletHandleToken = get("walletHandleToken").value;

        return kmd.listKeys(walletHandleToken)
        .then((
            {
                body: {
                    addresses
                }
            }
        ) => {
            openModal(
                parseTemplate(
                    templates.exportKey,
                    (_, $1) => ({
                        CALLBACK: "exportKey",
                        SELECT: makeList(
                            "address",
                            addresses.map(address =>
                                ({
                                    id: address,
                                    name: address
                                })
                            )
                        ),
                        WALLET_HANDLE_TOKEN: walletHandleToken,
                        WALLET_PASSWORD: get("walletPassword").value || "",
                        SIGNATURE: `func <span class="func">exportKey</span>(<span class="param">walletHandle</span> string, <span class="param">walletPassword</span> string, <span class="param">addr</span> string)`
                    })[$1]
                )
            );
        });
    },
    signTransaction: () => {
        const walletHandleToken = get("walletHandleToken").value;

        return Promise.all([
            kmd.listKeys(walletHandleToken),
            algod.getTransactionParams()
        ]).then(([
            {
                body: {
                    addresses
                }
            }, {
                body: {
                    lastRound,
                    genesishashb64,
                    genesisID,
                    minFee
                }
            }
        ]) => {
            openModal(
                parseTemplate(
                    templates.transaction,
                    (_, $1) => ({
                        SELECT: makeList(
                            "fromAddress",
                            addresses.map(address =>
                                ({
                                    id: address,
                                    name: address
                                })
                            )
                        ),
                        FIRST_ROUND: lastRound + 1,
                        LAST_ROUND: lastRound + 6,
                        GENESIS_HASH: genesishashb64,
                        GENESIS_ID: genesisID,
                        MIN_FEE: minFee,
                        WALLET_HANDLE_TOKEN: walletHandleToken,
                        WALLET_PASSWORD: get("walletPassword").value || "",
                        SIGNATURE: `func <span class="func">signTransaction</span>(<span class="param">walletHandle</span> string, <span class="param">walletPassword</span> string, <span class="param">transaction</span> object)`
                    })[$1]
                )
            )
        });
    }
};


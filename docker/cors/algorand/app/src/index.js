document.addEventListener("DOMContentLoaded", () => {
    setElementReferences();
    setNodeInfo();

    menuEl.addEventListener("click", async e => {
        e.preventDefault();

        switch (e.target.textContent) {
            /* ----------------------------------------------------------- */
            // Network.
            /* ----------------------------------------------------------- */

            case "Genesis Block":
                getFromDisk(`${NETWORK}/genesis.json`);
                break;

            case "Network Template":
                getFromDisk('template.json');
                break;

            /* ----------------------------------------------------------- */
            // Nodes.
            /* ----------------------------------------------------------- */

            case "Primary":
                changeNode("Primary");
                break;

            case "Kilgore":
                changeNode("Kilgore");
                break;

            case "Trout":
                changeNode("Trout");
                break;

            case "config.json":
                getFromDisk(`${NETWORK}/${NODE}/config.json`);
                break;

            case "algod.net":
                getFromDisk(`${NETWORK}/${NODE}/algod.net`, false);
                break;

            case "algod.pid":
                getFromDisk(`${NETWORK}/${NODE}/algod.pid`, false);
                break;

            case "algod.token":
                getFromDisk(`${NETWORK}/${NODE}/algod.token`, false);
                break;

            case "kmd.net":
                getFromDisk(`${NETWORK}/${NODE}/${KMD_VERSION}/kmd.net`, false);
                break;

            case "kmd.pid":
                getFromDisk(`${NETWORK}/${NODE}/${KMD_VERSION}/kmd.pid`, false);
                break;

            case "kmd.token":
                getFromDisk(`${NETWORK}/${NODE}/${KMD_VERSION}/kmd.token`, false);
                break;

            /* ----------------------------------------------------------- */
            // algod API.
            /* ----------------------------------------------------------- */

            case "assetInformation()":
                processPromise(algod.assetInformation(0));
                break;

            case "block()":
                openModal(
                    parseTemplate(
                        templates.getNumber,
                        (_, $1) => ({
                            CALLBACK: "block",
                            SIGNATURE: `func <span class="func">block</span>(<span class="param">roundNumber</span> int, <span class="param">headers={}</span> object)`
                        })[$1]
                    )
                );
                break;

            case "generateAccount()":
                const account = lastGeneratedAccount = algosdk.generateAccount();
                const mnemonic = algosdk.secretKeyToMnemonic(account.sk);
                const secretKey = algosdk.mnemonicToSecretKey(mnemonic);

                openModal(
                    parseTemplate(
                        templates.generateAccount,
                        (_, $1) => ({
                            ADDRESS: account.addr,
                            MNEMONIC: mnemonic,
                            SECRET_KEY: JSON.stringify(algosdk.mnemonicToSecretKey(mnemonic), null, 4),
                            SIGNATURE: `func <span class="func">generateAccount</span>()`
                        })[$1]
                    )
                );
                break;

            case "healthCheck()":
                processPromise(algod.healthCheck());
                break;

            case "ledgerSupply()":
                processPromise(algod.ledgerSupply());
                break;

            case "pendingTransactions()":
                openModal(
                    parseTemplate(
                        templates.getNumber,
                        (_, $1) => ({
                            CALLBACK: "pendingTransactions",
                            SIGNATURE: `func <span class="func">pendingTransactions</span>(<span class="param">maxTxns</span> int, <span class="param">headers={}</span> object)`
                        })[$1]
                    )
                );
                break;

            case "sendRawTransaction()":
                _rawTransaction = algosdk.signTransaction(_signedTransaction, lastGeneratedAccount.sk);

                openModal(
                    parseTemplate(
                        templates.sendRawTransaction,
                        (_, $1) => ({
                            TRANSACTION: _rawTransaction.blob,
                            SIGNATURE: `func <span class="func">sendRawTransaction</span>(<span class="param">txn</span> string, <span class="param">headers={}</span> object)`
                        })[$1]
                    )
                );
                break;

            case "status()":
                processPromise(algod.status());
                break;

            case "suggestedFee()":
                processPromise(algod.suggestedFee());
                break;

            case "transactionParams()":
                processPromise(algod.getTransactionParams());
                break;

            case "versions()":
                processPromise(algod.versions());
                break;

            case "waitForBlock()":
                openModal(
                    parseTemplate(
                        templates.getNumber,
                        (_, $1) => ({
                            CALLBACK: "statusAfterBlock",
                            SIGNATURE: `func <span class="func">statusAfterBlock</span>(<span class="param">roundNumber</span> int, <span class="param">headers={}</span> object)`
                        })[$1]
                    )
                );
                break;

            /* ----------------------------------------------------------- */
            // kmd API.
            /* ----------------------------------------------------------- */

            case "createWallet()":
                openModal(
                    parseTemplate(
                        templates.createWallet,
                        (_, $1) => ({
                            CALLBACK: "createWallet",
                            SIGNATURE: `func <span class="func">createWallet</span>(<span class="param">walletName</span> string, <span class="param">walletPassword</span> string, <span class="param">walletMDK = ""</span> string, <span class="param">walletDriverName = "sqlite"</span> string)`
                        })[$1]
                    )
                );
                break;

            case "deleteKey()":
                openModal(
                    parseTemplate(
                        templates.getWalletHandle,
                        (_, $1) => ({
                            CALLBACK: "deleteKey", // This is the in the templateFunction object (for now).
                            SIGNATURE: INITIATE_PROCESS
                        })[$1]
                    )
                );
                break;

            case "exportKey()":
                openModal(
                    parseTemplate(
                        templates.getWalletHandle,
                        (_, $1) => ({
                            CALLBACK: "exportKey", // This is the in the templateFunction object (for now).
                            SIGNATURE: INITIATE_PROCESS
                        })[$1]
                    )
                );
                break;

            case "getVersion()":
                processPromise(kmd.versions());
                break;

            case "generateKey()":
                openModal(
                    parseTemplate(
                        templates.walletHandle,
                        (_, $1) => "generateKey"
                    )
                );
                break;

            case "getWallet()":
                openModal(
                    parseTemplate(
                        templates.walletHandle,
                        (_, $1) => ({
                            CALLBACK: "getWallet",
                            SIGNATURE: `func <span class="func">getWallet</span>(<span class="param">walletHandle</span> string)`
                        })[$1]
                    )
                );
                break;

            case "importKey()":
                openModal(
                    parseTemplate(
                        templates.importKey,
                        (_, $1) => ({
                            SECRET_KEY: lastGeneratedAccount.addr || "",
                            CALLBACK: "importKey",
                            SIGNATURE: `func <span class="func">importKey</span>(<span class="param">walletHandle</span> string, <span class="param">secretKey</span> UInt8Array)`
                        })[$1]
                    )
                );
                break;

            case "initWalletHandle()": {
                // TODO
                const {
                    body: {
                        wallets
                    }
                } = await kmd.listWallets();

                openModal(
                    parseTemplate(
                        templates.initWalletHandle,
                        (_, $1) => ({
                            SELECT: makeList("walletID", wallets),
                            SIGNATURE: `func <span class="func">initWalletHandle</span>(<span class="param">walletID</span> string, <span class="param">walletPassword</span> string)`
                        })[$1]
                    )
                );
                break;
            }

            case "listKeys()":
                openModal(
                    parseTemplate(
                        templates.walletHandle,
                        (_, $1) => ({
                            CALLBACK: "listKeys",
                            SIGNATURE: `func <span class="func">listKeys</span>(<span class="param">walletHandle</span> string)`
                        })[$1]
                    )
                );
                break;

            case "listWallets()":
                processPromise(kmd.listWallets());
                break;

            case "releaseWalletHandle()":
                openModal(
                    parseTemplate(
                        templates.walletHandle,
                        (_, $1) => ({
                            CALLBACK: "releaseWalletHandle",
                            SIGNATURE: `func <span class="func">releaseWalletHandle</span>(<span class="param">walletHandle</span> string)`
                        })[$1]
                    )
                );
                break;

            case "renameWallet()": {
                // TODO
                const {
                    body: {
                        wallets
                    }
                } = await kmd.listWallets();

                openModal(
                    parseTemplate(
                        templates.renameWallet,
                        (_, $1) => ({
                            CALLBACK: "renameWallet",
                            SELECT: makeList("walletID", wallets),
                            SIGNATURE: `func <span class="func">renameWallet</span>(<span class="param">walletID</span> string, <span class="param">walletPassword</span> string, <span class="param">newWalletName</span> string)`
                        })[$1]
                    )
                );
                break;
            }

            case "renewWalletHandle()":
                openModal(
                    parseTemplate(
                        templates.walletHandle,
                        (_, $1) => ({
                            CALLBACK: "renewWalletHandle",
                            SIGNATURE: `func <span class="func">renewWalletHandle</span>(<span class="param">walletHandle</span> string)`
                        })[$1]
                    )
                );
                break;

            case "signTransaction()":
                openModal(
                    parseTemplate(
                        templates.getWalletHandle,
                        (_, $1) => ({
                            CALLBACK: "signTransaction",
                            SIGNATURE: INITIATE_PROCESS
                        })[$1]
                    )
                );
                break;
        }
    });

    modalEl.addEventListener("click", e => {
        e.preventDefault();

        switch (e.target.id) {
            case "cancelModal":
                closeModal(/*withDelay=*/ false);
                break;

            case "getWalletHandleModal":
                closeModal(/*withDelay=*/ false);

                templateFunctions[get("callback").value]()
                .catch(processError);
                break;

            case "submitCreateWalletModal":
                closeModal(/*withDelay=*/ false);
                processPromise(
                    kmd.createWallet(
                        get("walletName").value,
                        get("walletPassword").value,
                        get("mdk").value,
                        get("walletDriverName").value
                    )
                );
                break;

            case "submitKeyModal":
                closeModal(/*withDelay=*/ false);
                processPromise(
                    kmd[get("callback").value](
                        get("walletHandleToken").value,
                        get("walletPassword").value,
                        get("address").value
                    )
                );
                break;

            case "submitGetNumberModal":
                closeModal();
                processPromise(
                    algod[get("callback").value](
                        parseInt(get("round").value)
                    )
                );
                break;

            case "submitImportKeyModal":
                closeModal(/*withDelay=*/ false);
                processPromise(
                    kmd.importKey(
                        get("walletHandleToken").value,
                        lastGeneratedAccount.sk
                    )
                );
                break;

            case "submitInitWalletHandleModal":
                closeModal(/*withDelay=*/ false);
                processPromise(
                    kmd.initWalletHandle(
                        get("walletID").value,
                        get("walletPassword").value
                    )
                );
                break;

            case "submitRenameWalletModal":
                processPromise(
                    kmd.renameWallet(
                        get("walletID").value,
                        get("walletPassword").value,
                        get("walletRename").value,
                    )
                );
                break;

            case "submitSendRawTransactionModal":
                closeModal(/*withDelay=*/ false);
                processPromise(
                    algod.sendRawTransaction(_rawTransaction.blob)
                );
                break;

            case "submitTransactionModal":
                closeModal(/*withDelay=*/ false);

                _signedTransaction = {
                    from: get("fromAddress").value,
                    to: get("toAddress").value,
                    fee: parseInt(get("fee").value),
                    amount: parseInt(get("amount").value),
                    firstRound: parseInt(get("firstRound").value),
                    lastRound: parseInt(get("lastRound").value),
                    genesisID: get("genesisID").value,
                    genesisHash: get("genesisHash").value
                };

                processPromise(
                    kmd.signTransaction(
                        get("walletHandleToken").value,
                        get("walletPassword").value,
                        _signedTransaction
                    )
                );
                break;

            case "submitWalletHandleModal":
                closeModal(/*withDelay=*/ false);
                processPromise(
                    kmd[get("callback").value](
                        get("walletHandleToken").value
                    )
                );
                break;
        }
    });
});


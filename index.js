const Sha256 = CryptoJS.SHA256
const Aes = CryptoJS.AES
const Enc = CryptoJS.enc

const _contentInput = document.querySelector("textarea[id='contentInput']")
const _passphraseInput = document.querySelector("input[id='passphraseInput']")
const _encryptButton = document.querySelector("button[id='encryptButton']")
const _decryptButton = document.querySelector("button[id='decryptButton']")
const _copyButton = document.querySelector("button[id='copyButton']")
const _result = document.querySelector("div[id='result']")

_encryptButton.addEventListener("click", () => {
    showSpinner()
    try {
        const content = _contentInput.value
        const passphrase = _passphraseInput.value
        const encryptedContent = Aes.encrypt(content, passphrase).toString()
        _result.innerText = encryptedContent.substring(10)
    } catch (err) {
        console.log("ERROR", err)
    }
    hideSpinner()
})

_decryptButton.addEventListener("click", () => {
    showSpinner()
    try {
        const content = "U2FsdGVkX1" + _contentInput.value
        const passphrase = _passphraseInput.value
        const decryptedBytes = Aes.decrypt(content, passphrase)
        const decryptedContent = decryptedBytes.toString(Enc.Utf8)
        _result.innerText = decryptedContent
    } catch (err) {
        console.log("ERROR", err)
    }
    hideSpinner()
})

_copyButton.addEventListener("click", () => {
    const clipboardItem = new ClipboardItem({ "text/plain": new Blob([_result.innerText]) });
    navigator.clipboard.write([clipboardItem]).then(
        function () {
            window.alert("Copy Successfully")
            console.log("Copy Successfully")
        },
        function (err) {
            window.alert("Copy Failed")
            console.error("ERROR", err)
        }
    )
})
const Sha256 = CryptoJS.SHA256
const Aes = CryptoJS.AES
const Enc = CryptoJS.enc

const _contentInput = document.querySelector("input[id='contentInput']")
const _passphraseInput = document.querySelector("input[id='passphraseInput']")
const _encryptButton = document.querySelector("button[id='encryptButton']")
const _decryptButton = document.querySelector("button[id='decryptButton']")
const _result = document.querySelector("textarea[id='result']")

let content = _contentInput.value
let passphrase = _passphraseInput.value

_encryptButton.addEventListener("click", () => {
    const content = _contentInput.value
    const passphrase = _passphraseInput.value
    const encryptedContent = Aes.encrypt(content, passphrase).toString()
    _result.value = encryptedContent
})

_decryptButton.addEventListener("click", () => {
    const content = _contentInput.value
    const passphrase = _passphraseInput.value
    const decryptedBytes = Aes.decrypt(content, passphrase)
    const decryptedContent = decryptedBytes.toString(Enc.Utf8)
    // console.log(decryptedContent)
    _result.value = decryptedContent
})
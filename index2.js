const _fileUpload2 = document.querySelector("input[id='fileUpload2']")
const _passphraseInput2 = document.querySelector("input[id='passphraseInput2']")
const _encryptButton2 = document.querySelector("button[id='encryptButton2']")
const _decryptButton2 = document.querySelector("button[id='decryptButton2']")
const _copyButton2 = document.querySelector("button[id='copyButton2']")
const _downloadLink2 = document.querySelector("a[id='downloadLink2']")

_encryptButton2.addEventListener("click", () => {

    // 获取 file
    const file = _fileUpload2.files[0]
    
    // 获取 passphrase
    const passphrase = _passphraseInput2.value

    // 获取 fileName 和 fileType
    const fileName = file.name 
    const fileType = file.type

    // 读取 file 内容，得到 ArrayBuffer
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = evt => {

        // 得到 arrayBuffer
        const fileArrayBuffer = evt.target.result
        
        // 转为 uint8Array
        const filePlainBytes = new Uint8Array(fileArrayBuffer)

        // 转为 base64
        const fileBase64 = btoa(String.fromCharCode.apply(null, filePlainBytes))

        // 对 (文件类型 + base64 字符串) 加密
        const encryptedFileBase64 = Aes.encrypt(fileType.padStart(64, "0") + fileBase64, passphrase).toString().substring(10)
        
        // 对 文件名 加密
        const encryptedFileName = (Aes.encrypt(fileName, passphrase).toString().substring(10)+".hc").replace(/\//g, "_")

        // 将加密后的 (文件类型 + base64 字符串) 转为 blob
        const encryptedFileBlob = new Blob([encryptedFileBase64], { type: "application/octet-stream" });

        // 将 blob 转为 file
        const encryptedFile = new File([encryptedFileBlob], encryptedFileName, { type: "application/octet-stream" })

        // 生成 URL
        const encryptedFileLink = URL.createObjectURL(encryptedFile)

        // 渲染页面 <a> 标签
        _downloadLink2.href = encryptedFileLink
        _downloadLink2.download = encryptedFileName

        window.alert("Encrypt Successfully")
    }
})

_decryptButton2.addEventListener("click", () => {

    // 获取 file
    const file = _fileUpload2.files[0]
    
    // 获取 passphrase
    const passphrase = _passphraseInput2.value

    // 获取 fileName 和 fileType
    const fileName = file.name 
    const fileType = file.type

    // 读取 file 内容，得到 ArrayBuffer
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = evt => {
        
        // 得到 arrayBuffer
        const fileArrayBuffer = evt.target.result
        
        // 转为 uint8Array
        const filePlainBytes = new Uint8Array(fileArrayBuffer)

        // 转为 utf-8 字符串
        const decoder = new TextDecoder("utf-8")
        const fileStr = decoder.decode(filePlainBytes)

        // 对 字符串 解密
        const decryptedFileStr = Aes.decrypt("U2FsdGVkX1" + fileStr, passphrase).toString(Enc.Utf8)

        // 对 文件名 解密
        const decryptedFileName = Aes.decrypt(("U2FsdGVkX1" + fileName.replace(/_/g, "/")).substring(0, fileName.length+7), passphrase).toString(Enc.Utf8)

        // 提取 数据类型
        const tmp = decryptedFileStr.substring(0, 64)
        let decryptedFileType = ""
        for(let i=0;i<64;i++) {
            if(tmp[i]!="0") {
                decryptedFileType = tmp.substring(i)
                break
            }
        }

        // 提取 原文件二进制数据
        const decryptedFileBase64 = decryptedFileStr.substring(64)
        const decryptedFileArray = atob(decryptedFileBase64)
        const byteNumbers = new Array(decryptedFileArray.length);
        for (let i = 0; i < decryptedFileArray.length; i++) {
          byteNumbers[i] = decryptedFileArray.charCodeAt(i);
        }
        const decryptedFileByteArray = new Uint8Array(byteNumbers);

        // 转为 blob
        const decryptedFileBlob = new Blob([decryptedFileByteArray], { type: decryptedFileType });

        // 将 blob 转为 file
        const decryptedFile = new File([decryptedFileBlob], decryptedFileName, { type: decryptedFileName })

        // 生成 URL
        const decryptedFileLink = URL.createObjectURL(decryptedFile)

        // 渲染页面 <a> 标签
        _downloadLink2.href = decryptedFileLink
        _downloadLink2.download = decryptedFileName

        window.alert("Decrypt Successfully")
    }
})
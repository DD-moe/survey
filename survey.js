        // aes unique key generation
        function generateKeys() {
            let iv = CryptoJS.lib.WordArray.random(16);
            let key = CryptoJS.lib.WordArray.random(16);
            return {
                iv: CryptoJS.enc.Base64.stringify(iv),
                key: CryptoJS.enc.Base64.stringify(key)
            }
        }
        //aes text encryption
        function encryptText(iv, key, plainText) {
            let encrypted = CryptoJS.AES.encrypt(plainText, key, {
                iv: iv,
                mode: CryptoJS.mode.GCM,
                padding: CryptoJS.pad.NoPadding
            });
            
            return encrypted.toString();
        }   

        // rsa encryption of aes key
        function encrypt(publicKey, rawText) {
            const aes = generateKeys();
            let encryptor = new JSEncrypt();
            encryptor.setPublicKey(publicKey);
            return {
                key: encryptor.encrypt(aes.key),
                iv: aes.iv,
                data: encryptText(aes.iv, aes.key, rawText)
            };
        }

        async function send(formData, command, publicKeyPem) {
            // encrypt data that should be shadowed           
            const shadow = encrypt(publicKeyPem, JSON.stringify(formData));
            // create database object
            const record = {shadow: shadow};
            // stringify object
            const output = JSON.stringify(record);

            const response = await fetch(`https://frog01-21435.wykr.es/${command}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: output
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
            } else {
                alert(data.error);
            }
        }        
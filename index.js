const app = require('express')()
require('dotenv').config()
const fs = require('fs')
const PORT = process.env.PORT || 3030

app.get('/', (req, res) => {
    try {
        const { status, nama, value } = req.query
        const strRegExPattern = '\\b' + nama + '\\b';
        const regex = new RegExp(strRegExPattern, 'g')
        const bahan = String(fs.readFileSync('./.env'))
        if (!fs.existsSync('./.env')) {
            fs.writeFileSync('.env', `PORT=3000`)
        }
        if (status === 'tambah') {
            let data = bahan
            if (bahan
                .split('\n')
                .filter(x => x.match(regex)).length > 0) {
                return res.status(300).send('nama sudah ada !')
            }
            data += `\n${nama}=${value}`
            fs.writeFileSync('./.env', data)
        }
        if (status === 'hapus') {
            if (bahan
                .split('\n')
                .filter(x => x.match(regex)).length === 0) {
                return res.status(300).send('nama tidak ditemukan !')
            }
            const data = bahan
                .split('\n')
                .filter(x => !x.match(regex))
                .join()
                .replace(/,/gm, '\n')

            fs.writeFileSync('./.env', data)
        }
        if (status === 'edit') {
            if (bahan
                .split('\n')
                .filter(x => x.match(regex)).length === 0) {
                return res.status(300).send('nama tidak ditemukan !')
            }
            const data = bahan
                .split('\n')
                .map((x) => {
                    let item = x
                    item = x.split('=')[0] === nama ? x.split('=')[0] + `=${value}` : x
                    return item
                })
                .join()
                .replace(/,/gm, '\n')
            // console.log(data);
            fs.writeFileSync('./.env', data)
        }
        if (status === 'ls') {
            return res.status(200).send(
                bahan
                    .split('\n')
                    .map((x) => {
                        let item = x
                        item = x.split('=')
                        return { [item[0]]: item[1] }
                    })
            )
        }
        return res.status(200).send('sukses')
    } catch (error) {
        console.log(error);
        return res.status(500).send(error)
    }
})

app.listen(PORT, () => console.log(`running on port ${PORT}`))
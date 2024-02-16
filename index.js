const app = require('express')()
require('dotenv').config()
const fs = require('fs')
const PORT = process.env.PORT || 3030

app.get('/env', (req, res) => {
    try {
        const { status, nama, value } = req.query
        if (!fs.existsSync('./.env')) {
            fs.writeFileSync('.env', `PORT=3000`)
        }
        const strRegExPattern = '\\b' + nama + '\\b';
        const regex = new RegExp(strRegExPattern, 'g')
        const bahan = String(fs.readFileSync('./.env'))
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

app.get('/json', (req, res) => {
    try {
        const { status, nama, value, id } = req.query
        const DB_NAME = `database.json`
        const strRegExPattern = '\\b' + nama + '\\b';
        const regex = new RegExp(strRegExPattern, 'g')

        if (!fs.existsSync(`./${DB_NAME}`)) {
            fs.writeFileSync(DB_NAME, nama ? `[{"id" : 1,"${nama}" : "${value}"}]` : `[]`)
            return
        }
        const bahan = String(fs.readFileSync(`./${DB_NAME}`))
            ? JSON.parse(String(fs.readFileSync(`./${DB_NAME}`)))
            : []
        if (status === 'tambah') {
            const data = bahan
            data.push({ "id": bahan.length + 1, [nama]: value })
            // console.log();
            fs.writeFileSync(`./${DB_NAME}`, JSON.stringify(data))
        }
        if (status === 'hapus') {
            // return console.log(bahan.filter(x => x.id === Number(id)));
            if (bahan.filter(x => x.id === Number(id)).length === 0) {
                return res.status(300).send('nama tidak ditemukan !')
            }
            const data = bahan.filter(x => x.id !== Number(id))
            fs.writeFileSync(`./${DB_NAME}`, JSON.stringify(data))
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
                    item = x.split('=')[0] === nama ? x.split('=')[0] + `= ${value}` : x
                    return item
                })
                .join()
                .replace(/,/gm, '\n')
            // console.log(data);
            fs.writeFileSync(`./${DB_NAME}`, data)
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
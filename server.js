const express = require('express')
const Utils = require('./utils/utils');
const app = express()
const port = 3000
const PDFExtract = require('pdf.js-extract').PDFExtract;
const multer  = require('multer');
const os = require('os');
const upload = multer({ dest: os.tmpdir() });

app.get('*', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(404).send(JSON.stringify({error: 'Route not found', code: 404}));
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    const file = req.file;

    if(!file) {
        res.status(400).send(JSON.stringify({error: "File not found", code: 400}));
        return;
    }

    if(file.mimetype !== 'application/pdf'){
        res.status(415).send(JSON.stringify({error: "Only pdf file.", code: 415}));
        return;
    }

    const pdfExtract = new PDFExtract();
    const fs = require('fs');
    const buffer = fs.readFileSync(req.file.path);
    const options = {};
    pdfExtract.extractBuffer(buffer, options, (err, data) => {
        if (err) return console.log(err);
        const pages = data.pages;
        let typeableLine = '';
        let info = {};
        for (let pageItem of pages){
            const page = pageItem.content;
            for (let item of page) {
                const replaceText = item.str.replace(/\.| /g, '');
                if(replaceText.length >= 47 && replaceText.length <= 48 && replaceText.match(/^[0-9]+$/)) {
                    typeableLine = replaceText;
                    const boletoUtils = new Utils(typeableLine);
                    info = {
                        typeableLineFormated: boletoUtils.getFormated(),
                        amount: boletoUtils.getAmount(),
                        expirationDate: boletoUtils.getExpirationDate(),
                    }
                    break;
                }
            }
            if (typeableLine) {
                break;
            }
        }
        if (!typeableLine) {
            res.status(400).send(JSON.stringify({error: "TypeableLine not found", code: 400}));
            return;
        }
        res.send(JSON.stringify({ typeableLine, ...info }));
    });


})

app.listen(port, () => {
    console.log(`Api running on ${port}!`)
})

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const app = express();
app.use(cors());

const upload = multer();

app.post('/upload', upload.single('chunk'), (req, res) => {
    const ext = req.headers['data-ext'];
    const nameFile = req.headers['data-name-file'];
    const chunk = req.file.buffer;
    
    const filePath = path.join(__dirname, 'uploads', `${nameFile}${ext}`);
    // const filePath = path.join(__dirname, 'uploads', `uploadedFile.mp4`);

    console.log("Ext: ", ext);
    // Criar um Readable Stream a partir do buffer
    const readStream = new Readable({
        read() {
            this.push(chunk);
            this.push(null); // Sinaliza o final do stream
        }
    });

    // Criar um Write Stream para o arquivo
    const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

    // Usar pipe para enviar dados do readStream para o writeStream
    readStream.pipe(writeStream);

    writeStream.on("open", (data) => console.log('salvando...'+ data))

    writeStream.on('finish', () => {
        console.log('Upload concluído');
        res.send('Upload concluído');
    });

    writeStream.on('error', (err) => {
        console.error('Erro durante o upload:', err);
        res.status(500).send('Erro durante o upload');
    });
});

// app.post('/upload', upload.single('chunk'), (req, res) => {
//     const chunk = req.file.buffer;
//     const offset = req.body.offset; // Ou gere um identificador único para o arquivo
//     const filePath = path.join(__dirname, 'uploads', `largeFile-${offset}.tmp`);

//     // Criando o write stream
//     const writeStream = fs.createWriteStream(filePath, { flags: 'a' });

//     // Escrevendo o chunk no arquivo
//     writeStream.write(chunk, () => {

//         // writeStream.on("pipe", (pieces) => {
//         //     console.log(pieces);
//         // });

//         writeStream.close(); // Importante fechar o stream
//         res.send('Chunk uploaded');
//     });
// });

// app.post('/upload', upload.single('chunk'), (req, res) => {
//   const chunk = req.file.buffer;
//   const offset = parseInt(req.body.offset, 10);
//   const filePath = path.join(__dirname, 'uploads', 'largeFile.tmp');

//   // Append to file
//   fs.open(filePath, 'a', 666, (e, id) => {
//     fs.write(id, chunk, 0, chunk.length, offset, () => {
//       fs.close(id, () => {
//         res.send('Chunk uploaded');
//       });
//     });
//   });
// });

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000');
});
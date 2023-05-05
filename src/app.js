import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
// É um middleware para express.js
// que facilita receber arquivos binários nas requisições.
import multer from "multer";

const mongoClient = new MongoClient("mongodb://localhost:27017/AulaoUpload");
const port = 5005;
//const mongoClient = new MongoClient(process.env.DATABASE_URL);
export const db = mongoClient.db();
try {
    await mongoClient.connect();
    console.log("MongoDB online!");
} catch (err) {
    console.log(err.message);
}

const app = express();
app.use(cors());
app.use(express.json());

//O middleware é configurado através de um objeto de opções que é passado para a função "multer()"
//Nesse objeto, estamos especificando que os arquivos enviados devem ser armazenados em uma pasta local
//definida pela opção dest.
//estamos especificando que a pasta de destino é './uploads/',
const upload = multer({
    dest: './uploads/',
});


//Após configurar o middleware, podemos usá-lo em rotas específicas. 
//No exemplo dado, estamos usando upload.array('file') na rota /upload. 
//Isso significa que a rota espera que um ou mais arquivos sejam enviados através de uma requisição POST com o campo file.
//E armazena na pasta especificada em "dest", no caso ./uploads/
app.post('/upload', upload.array('file'), async (req, res) => {
    console.log(`Files received: ${req.files.length}`);
    const files = req.files.map(file => ({ name: file.filename, path: file.path }));
    console.log("file",req.files);
    console.log("files",files);
    const result = await db.collection("UserUploads").insertMany(files);

    res.send({
      upload: true,
      files: result.insertedIds,
    });

});


app.listen(port, () => console.log(`API runing on port ${port}`));
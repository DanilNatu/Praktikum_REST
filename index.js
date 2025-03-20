import express from 'express';
import mysql from 'mysql2';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import YAML from 'yaml';

const swaggerDocument = YAML.parse(fs.readFileSync('./user-api.yaml', 'utf8'));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "openapi",
    password: "",
    port: "3307"
});
const app = express();

app.use(express.json());

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/users', (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json(results);
    });
});

app.post('/user', (req, res) => {
    const { name, email, age } = req.body;

    db.query('INSERT INTO user (name, email, age, createdAt, updatedAt) VALUES (?, ?, ?, Now(), Now())',[name, email, age], (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json(results);
    });
});

app.get('/user/:id', (req, res) => {
    db.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json(results);
    });
});

app.delete('/user/:id', (req, res) => {
    db.query('DELETE FROM user WHERE id = ?',[req.params.id], (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json( {massage: 'User berhasil dihapus'});
    });
});

app.put('/user/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, age } = req.query;

    db.query('UPDATE user SET name = ?, email = ?, age = ?, updatedAt = Now() WHERE id = ?', [name, email, age, id], (err, results) => {
        if (err) {
            res.status(500).send('Internal Server Error');
            return;
        }

        res.json( {massage: 'User berhasil diupdate'} );
    });
});
app.listen(3000, () => console.log('Server berjalan di http://localhost:3000'));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // A Vercel usa 3000 por padrão

app.use(cors());
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI; // Coloque sua URI do MongoDB aqui

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Conectado ao MongoDB!');
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Erro de conexão:', err);
        process.exit(1);
    });

// Definindo um modelo básico
const farmaciaSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    endereco: { type: String, required: true },
    telefone: { type: String },
    location: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true }
    },
    abre: { type: String },
    fecha: { type: String },
    plantao: { type: [Date] }
});

const Farmacia = mongoose.model('Farmacia', farmaciaSchema);

// Rota para testar a API
app.get('/api/test', (req, res) => {
    res.send('API está funcionando!');
});

// Rota para buscar farmácias
app.get('/api/farmacias', async (req, res) => {
    try {
        const farmacias = await Farmacia.find();
        res.json(farmacias);
    } catch (error) {
        console.error('Erro ao buscar farmácias:', error);
        res.status(500).send('Erro ao buscar farmácias');
    }
});

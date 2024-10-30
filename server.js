const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o MongoDB
const MONGODB_URI = 'mongodb+srv://lucasolivato:2eEen56rtYSwjUwP@plantaofarmadb.bluqj.mongodb.net/?retryWrites=true&w=majority&appName=plantaoFarmaDB';
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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

// Definindo o modelo de farmácia
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

// Rotas
app.get('/api/test', (req, res) => {
    res.send('API está funcionando!');
});

app.get('/api/farmacias', async (req, res) => {
    try {
        const farmacias = await Farmacia.find();
        console.log('Farmácias encontradas:', farmacias);
        res.json(farmacias);
    } catch (error) {
        console.error('Erro ao buscar farmácias:', error);
        res.status(500).send('Erro ao buscar farmácias');
    }
});

const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connecté à la base de données'))
    .catch((error) => console.log('Erreur de connexion :', error));

// Importer le modèle User
const User = require('./models/User');

// Routes

// GET: Retourner tous les utilisateurs
app.get('/utilisateurs', async (req, res) => {
    try {
        const utilisateurs = await User.find();
        res.json(utilisateurs);
    } catch (err) {
        res.status(400).send('Erreur lors de la récupération des utilisateurs');
    }
});

// POST: Ajouter un nouvel utilisateur
app.post('/utilisateurs', async (req, res) => {
    const { nom, email } = req.body;
    const utilisateur = new User({ nom, email });

    try {
        await utilisateur.save();
        res.status(201).json(utilisateur);
    } catch (err) {
        res.status(400).send('Erreur lors de l\'ajout de l\'utilisateur');
    }
});

// PUT: Modifier un utilisateur par ID
app.put('/utilisateurs/:id', async (req, res) => {
    try {
        const utilisateur = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!utilisateur) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        res.json(utilisateur);
    } catch (err) {
        res.status(400).send('Erreur lors de la mise à jour de l\'utilisateur');
    }
});

// DELETE: Supprimer un utilisateur par ID
app.delete('/utilisateurs/:id', async (req, res) => {
    try {
        const utilisateur = await User.findByIdAndDelete(req.params.id);
        if (!utilisateur) {
            return res.status(404).send('Utilisateur non trouvé');
        }
        res.status(204).send();
    } catch (err) {
        res.status(400).send('Erreur lors de la suppression de l\'utilisateur');
    }
});

// Démarrer le serveur
app.listen(process.env.PORT, () => {
    console.log(`Serveur démarré sur le port ${process.env.PORT}`);
});

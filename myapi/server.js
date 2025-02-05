const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
var bodyParser = require('body-parser')
const app = express();
app.use(bodyParser.json());
// app.use(express.json());

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://hindelmoussaoui:hindelmoussaoui@cluster0.omwqk.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0';

// ✅ Connexion à MongoDB
mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch((error) => console.error('❌ Erreur de connexion :', error.message));

// ✅ Importer le modèle User
const User = require('./models/User.js');

// Liste des utilisateurs à insérer
const users = [
    { name: "Alice", email: "alice@example.com" },
    { name: "Bob", email: "bob@example.com" },
    { name: "Charlie", email: "charlie@example.com" }
];

// create les utilisateurs dans la base de données
User.create(users)
    .then(() => {
        console.log("Utilisateurs ajoutés avec succès !");
        // mongoose.connection.close();
    })
    .catch(err => console.error("Erreur lors de l'ajout des utilisateurs", err));

// 📌 GET: Retourner tous les utilisateurs
app.get('/find', async (req, res) => {
    try {
        const utilisateurs = await User.find();
        console.log(utilisateurs)
        res.send(utilisateurs);
        
    } catch (err) {
        res.status(500).json({ message: '❌ Erreur serveur', error: err.message });
    }
});

// 📌 POST: Ajouter un nouvel utilisateur
app.post('/User', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ message: "❌ Le nom et l'email sont requis" });
    }

    try {
        const utilisateur = new User({ name, email });
        await utilisateur.save();
        res.status(201).json(utilisateur);
    } catch (err) {
        res.status(400).json({ message: '❌ Erreur lors de l\'ajout de l\'utilisateur', error: err.message });
    }
});

// 📌 PUT: Modifier un utilisateur par ID
app.put('/User/:id', async (req, res) => {
    try {
        const utilisateur = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!utilisateur) {
            return res.status(404).json({ message: '❌ Utilisateur non trouvé' });
        }
        res.json(utilisateur);
    } catch (err) {
        res.status(500).json({ message: '❌ Erreur serveur', error: err.message });
    }
});

// 📌 DELETE: Supprimer un utilisateur par ID
app.delete('/User/:id', async (req, res) => {
    try {
        const utilisateur = await User.findByIdAndDelete(req.params.id);
        if (!utilisateur) {
            return res.status(404).json({ message: '❌ Utilisateur non trouvé' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: '❌ Erreur serveur', error: err.message });
    }
});

// 🚀 Démarrer le serveur
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});

const express = require("express");
const app = express();
app.use(express.json()); 


let users = [
    { id: 1, name: "Alice", email: "alice@example.com" },
    { id: 2, name: "Bob", email: "bob@example.com" },
    { id: 3, name: "Charlie", email: "charlie@example.com" },
];

// Route GET : Retourner tous les utilisateurs
app.get("/users", (req, res) => {
    res.json(users);
});

// Route POST : Ajouter un utilisateur
app.post("/users", (req, res) => {
    const newUser = { id: users.length + 1, ...req.body };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Route PUT : Modifier un utilisateur par ID
app.put("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
}
    users[userIndex] = { id: userId, ...req.body };
    res.json(users[userIndex]);
});

// Route DELETE : Supprimer un utilisateur par ID
app.delete("/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    users = users.filter((user) => user.id !== userId);
    res.json({ message: "Utilisateur supprimé" });
});

// Lancer le serveur
const PORT = 6000;
app.listen(PORT, () => {
    console.log(`Serveur en écoute sur http://localhost:${PORT}`);
});


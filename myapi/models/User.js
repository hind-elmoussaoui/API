const mongoose = require("mongoose");

// Définition du schéma
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});

module.exports = mongoose.model('User', userSchema);

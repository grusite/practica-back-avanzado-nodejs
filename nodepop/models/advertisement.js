"use strict";

const mongoose = require("mongoose");

const advertisementSchema = mongoose.Schema({
  nombre: String,
  venta: Boolean,
  precio: Number,
  foto: String,
  tags: [String]
});

module.exports = mongoose.model("Ad", advertisementSchema);

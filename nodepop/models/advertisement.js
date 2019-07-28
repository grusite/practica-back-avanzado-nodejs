"use strict";

const mongoose = require("mongoose");

const advertisementSchema = mongoose.Schema({
  nombre: String,
  venta: Boolean,
  precio: Number,
  foto: String,
  tags: [String]
});

advertisementSchema.statics.list = function({
  filter,
  skip,
  limit,
  fields,
  sort
}) {
  const query = Ad.find(filter);
  query.skip(skip);
  query.limit(limit);
  query.select(fields);
  query.sort(sort);
  return query.exec();
};

module.exports = mongoose.model("Ad", advertisementSchema);

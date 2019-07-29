"use strict";

const mongoose = require("mongoose");

const advertisementSchema = mongoose.Schema({
  name: String,
  sold: Boolean,
  price: Number,
  picture: String,
  tags: [String]
});

advertisementSchema.statics.list = function({
  filter,
  skip,
  limit,
  fields,
  sort
}) {
  const query = this.find(filter)
    .skip(skip)
    .limit(limit)
    .select(fields)
    .sort(sort);
  return query.exec();
};

module.exports = mongoose.model("Ad", advertisementSchema);

"use strict";

const mongoose = require("mongoose");

const advertisementSchema = mongoose.Schema({
  name: String,
  sold: Boolean,
  price: Number,
  picture: String,
  tags: {
    type: [String],
    enum: ["lifestyle", "motor", "mobile", "work"]
  }
});

advertisementSchema.index({ tags: 1, sold: 1, price: 1, name: 1 });

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

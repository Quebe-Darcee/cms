const mongoose = require('mongoose');

const documentSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  url: { type: String },
  children: {
    type: [documentSchema],
    default: undefined }
});

module.exports = mongoose.model('Document', documentSchema);

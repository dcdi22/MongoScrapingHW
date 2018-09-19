var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Create note schema
var NoteSchema = new Schema({
  body: String,
  article : {
    type: Schema.Types.ObjectId,
    ref: "Article"
  }
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;
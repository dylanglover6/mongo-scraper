var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var PostingSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  link: {
    type: String,
    required: true
  },
  price: {
    type: String
  },
  img: {
    type: String
  },
  comments: [
    {
    type: Schema.Types.ObjectId,
    ref: "Comments"
    }
  ]
});

var Posting = mongoose.model("Posting", PostingSchema);

module.exports = Posting;
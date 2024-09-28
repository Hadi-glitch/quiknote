import { Schema, model, models } from "mongoose";

const NoteSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  userId: {type: String},
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
});

const Note = models.Note || model("Note", NoteSchema);

export default Note;
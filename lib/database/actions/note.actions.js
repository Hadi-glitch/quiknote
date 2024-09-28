"use server";

import { handleError } from "@/lib/utils";
import { connectToDatabase } from "..";
import Note from "../models/note.model";

// Create a new note
export async function createNote(note) {
  try {
    await connectToDatabase();

    const newNote = await Note.create(note);
    return JSON.parse(JSON.stringify(newNote));
  } catch (error) {
    handleError(error);
  }
}

// Get notes by user ID
export async function getNotesById(userId) {
  try {
    await connectToDatabase();

    const notes = await Note.find({ userId });
    return JSON.parse(JSON.stringify(notes));
  } catch (error) {
    handleError(error);
  }
}

// Get a note by its ID for updating
export async function getNoteToUpdate(noteId) {
  try {
    await connectToDatabase();

    const note = await Note.findById(noteId);
    return JSON.parse(JSON.stringify(note));
  } catch (error) {
    handleError(error);
  }
}

// Update a note by its ID
export async function updateNote(noteId, updateData) {
  try {
    await connectToDatabase();

    const updatedNote = await Note.findByIdAndUpdate(noteId, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Ensure schema validation on update
    });

    return JSON.parse(JSON.stringify(updatedNote));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteNote(noteId) {
  try {
    await connectToDatabase();

    const deletedNote = await Note.findByIdAndDelete(noteId)

    return JSON.parse(JSON.stringify(deletedNote));
  } catch (error) {
    handleError(error);
  }
}
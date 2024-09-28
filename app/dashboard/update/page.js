"use client";

import Navbar from "@/components/shared/Navbar";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Footer from "@/components/shared/Footer";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import {
  deleteNote,
  getNoteToUpdate,
  updateNote,
} from "@/lib/database/actions/note.actions";
import { useRouter, useSearchParams } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Page = () => {
  const [note, setNote] = useState({ title: "", content: "", userId: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const noteId = searchParams.get("noteId");
  const userId = searchParams.get("userId");

  useEffect(() => {
    const fetchNoteData = async () => {
      try {
        if (!userId) {
          setErrorMessage("User not found, please log in again.");
          return;
        }

        if (!noteId) {
          setErrorMessage("Note ID not found.");
          return;
        }

        const noteToUpdate = await getNoteToUpdate(noteId);
        setNote(noteToUpdate);
      } catch (error) {
        console.error("Error fetching note data:", error);
        setErrorMessage("Error fetching note information.");
      }
    };
    fetchNoteData();
  }, [userId, noteId]);

  // Handle input changes
  const handleInputChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  // Handle note submission
  const handleUpdateNote = async () => {
    if (!note.title || !note.content) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }

    try {
      await updateNote(noteId, note);
      router.push(`/dashboard/${userId}`);
    } catch (error) {
      setErrorMessage("Error updating note. Please try again.");
    }
  };

  // Handle note deletion
  const handleDeleteNote = async () => {
    try {
      await deleteNote(noteId);
      router.push(`/dashboard/${userId}`);
    } catch (error) {
      setErrorMessage("Error deleting note. Please try again.");
    }
  };

  return (
    <div>
      <Navbar userId={userId} />
      <div className="container mx-auto py-10 flex flex-col gap-4 px-4">
        <Link href={`/dashboard/${userId}`}>
          <span className="underline text-blue-500">Dashboard</span>
          <span> / Update Note</span>
        </Link>

        <div className="flex justify-between">
          <h2 className="text-2xl">View Note</h2>
          <AlertDialog>
            <AlertDialogTrigger className="bg-red-600 text-white rounded-2xl text-base hover:bg-red-500 px-4 py-1 w-fit">
              Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  You are about to delete a note
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete your note{" "}
                  <span className="font-bold text-[#12296c]">{note.title}</span>{" "}
                  <br />
                  Are you sure?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#12296c] text-white hover:bg-blue-700"
                  onClick={handleDeleteNote}
                >
                  Delete Note
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Display error messages */}
        {errorMessage && (
          <p className="text-red-500 font-semibold">{errorMessage}</p>
        )}

        <div className="relative bg-white rounded-md border focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <Input
            value={note.title}
            name="title"
            type="text"
            placeholder="Title"
            className="absolute top-3 left-3 right-3 w-[calc(100%-24px)] bg-transparent border-none focus-visible:ring-0 p-0 text-lg font-semibold placeholder:text-muted-foreground z-10"
            onChange={handleInputChange}
          />
          <Textarea
            value={note.content}
            name="content"
            className="pt-12 resize-none bg-transparent border-none focus-visible:ring-0 h-96"
            placeholder="Take a note..."
            onChange={handleInputChange}
          />
        </div>

        {/* Button to submit the note */}
        <Button
          className="bg-[#12296c] border border-black text-white rounded-2xl hover:bg-[#0043a8] w-fit"
          onClick={handleUpdateNote}
        >
          + Update Note
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default Page;

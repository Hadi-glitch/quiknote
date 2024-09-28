"use client";

import Navbar from "@/components/shared/Navbar";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Footer from "@/components/shared/Footer";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { createNote } from "@/lib/database/actions/note.actions";
import { useRouter, useSearchParams } from "next/navigation";

const Page = () => {
  const [note, setNote] = useState({ title: "", content: "", userId: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  // Fetch userId when the component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        if (!userId) {
          setErrorMessage("User not found, please log in again.");
        } else {
          setNote((prev) => ({ ...prev, userId }));
        }
      } catch (error) {
        console.error("Error fetching userId:", error);
        setErrorMessage("Error fetching user information.");
      }
    };
    fetchUserId();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  // Handle note submission
  const handleAddNote = async () => {
    if (!note.title || !note.content) {
      setErrorMessage("Please fill in all the fields.");
      return;
    }

    try {
      await createNote(note);
      router.push(`/dashboard/${userId}`);
    } catch (error) {
      setErrorMessage("Error creating note. Please try again.");
    }
  };

  return (
    <div>
      <Navbar userId={userId} />
      <div className="container mx-auto py-10 flex flex-col gap-4 px-4">
        <div>
          <span
            onClick={() => router.push(`/dashboard/${note.userId}`)}
            className="underline text-blue-500 cursor-pointer"
          >
            Dashboard
          </span>
          <span> / Add Note</span>
        </div>

        <h2 className="text-2xl">Add Note</h2>

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
          onClick={handleAddNote}
        >
          + Add Note
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default function SuspenseWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Page />
    </Suspense>
  );
}
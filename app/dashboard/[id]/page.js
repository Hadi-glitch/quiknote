"use client";

import Card from "@/components/shared/Card";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { getNotesById } from "@/lib/database/actions/note.actions";
import { getUser } from "@/lib/database/actions/user.actions";
import { getSession } from "next-auth/react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import mongoose from "mongoose";

const Page = ({ params }) => {
  const { id: userId } = params;
  const [session, setSession] = useState(null);
  const [user, setUser] = useState();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage, setNotesPerPage] = useState(9);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleClick = (id) => {
    router.push(`/dashboard/update?noteId=${id}&userId=${userId}`);
  };

  const handleNavigation = () => {
    router.push(`/dashboard/add?userId=${userId}`);
  };

  const getNotes = async () => {
    try {
      const fetchedNotes = await getNotesById(userId);
      setNotes(fetchedNotes);
      setFilteredNotes(fetchedNotes);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    const fetchSessionAndUser = async () => {
      try {
        const session = await getSession();
        setSession(session);

        if (userId && !session) {
          const user = await getUser(userId);
          setUser(user);
        }

        await getNotes();
      } catch (error) {
        console.error("Error fetching session or user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndUser();
  }, [userId]);

  const handleSearch = (query) => {
    if (!query) {
      setFilteredNotes(notes);
      setCurrentPage(1); // Reset to first page on search
      return;
    }

    const filtered = notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query.toLowerCase()) ||
        note.content.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredNotes(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  // Get current notes for the current page
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);

  // Calculate total pages
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  // Pagination handlers
  const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading)
    return (
      <div className="flex justify-center items-center w-full h-[100vh]">
        <div role="status">
          <svg
            aria-hidden="true"
            className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  return (
    <div>
      <Navbar userId={userId} handleSearch={handleSearch} />
      {notes.length > 0 ? (
        <div className="container mx-auto py-10 flex flex-col gap-3 px-3 md:px-0 max-md:items-center">
          <div className="flex justify-between gap-10">
            <h2 className="font-extrabold text-4xl">
              Hey, {session ? session.user.name : user?.username}
            </h2>
            <Button
              onClick={handleNavigation}
              className="bg-[#12296c] border md:ml-52 border-black text-white rounded-2xl hover:bg-[#0043a8] w-fit"
            >
              + New Note
            </Button>
          </div>
          <div className='flex flex-wrap gap-5 max-md:justify-center max-md:overflow-scroll max-md:h-[36rem]'>
            {currentNotes.length > 0 ? (
              currentNotes.map((note) => (
                <Card
                  key={note._id}
                  title={note.title}
                  content={note.content}
                  onClick={() => handleClick(note._id)}
                />
              ))
            ) : (
              <p>No results found</p>
            )}
          </div>

          {/* Pagination Controls */}
          {filteredNotes.length > notesPerPage && (
            <div className="absolute bottom-28 w-[83%]">
              <div className="w-full max-w-3xl mx-auto px-4 py-6">
                <div className="flex justify-between items-center">
                  <Button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{currentPage}</span>
                    <div className="h-1 w-1 bg-gray-300 rounded-full"></div>
                    <span className="text-sm text-gray-500">{totalPages}</span>
                  </div>
                  <Button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="container mx-auto py-10 flex">
          <div>
            <h2 className="font-extrabold text-4xl">
              Hey, {session ? session.user.name : user?.username}
            </h2>
            <Image
              src="/images/human-3.svg"
              width={350}
              height={350}
              alt="human"
              className="mt-8"
            />
          </div>
          <div className="h-fit mt-20">
            <div>
              <h2 className="font-extrabold text-3xl">Okay...</h2>
              <p className="font-extrabold">
                Let's start with your first note!
              </p>
            </div>
            <div
              className="mt-4 font-extrabold underline text-blue-600 cursor-pointer w-fit"
              onClick={handleNavigation}
            >
              Create one!
            </div>
          </div>
          <Button
            onClick={handleNavigation}
            className="bg-[#12296c] border md:ml-52 border-black text-white rounded-2xl hover:bg-[#0043a8] w-fit"
          >
            + New Note
          </Button>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default Page;

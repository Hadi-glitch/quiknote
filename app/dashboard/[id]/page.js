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
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";

import Loader from "@/components/shared/Loader";

const Page = ({ params }) => {
  const { id: userId } = params;
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage] = useState(9);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const source = searchParams.get("source");

  // Consolidating the routing logic
  const navigateTo = (path) => {
    router.push(path);
  };

  const handleClick = (id) => {
    navigateTo(`/dashboard/update?noteId=${id}&userId=${userId}`);
  };

  const handleNavigation = () => {
    navigateTo(`/dashboard/add?userId=${userId}`);
  };

  const getNotes = async () => {
    try {
      const fetchedNotes = await getNotesById(userId);
      setNotes(fetchedNotes);
      setFilteredNotes(fetchedNotes);
    } catch (error) {
      toast.error("Error fetching notes");
      console.error("Error fetching notes:", error);
    }
  };

  useEffect(() => {
    if (success === "true") {
      let toastMessage = "";

      if (source === "add") {
        toastMessage = "📝New note added successfully!";
      } else if (source === "update") {
        toastMessage = "✅ Note updated successfully!";
      } else if (source === "delete") {
        toastMessage = "🗑️ Note deleted successfully!";
      }

      if (toastMessage) {
        setTimeout(() => {
          toast(toastMessage, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });
        }, 1000);
      }

      // Clear the success and source flags from URL
      const params = new URLSearchParams(searchParams);
      params.delete("success");
      params.delete("source");
      router.replace(`/dashboard/${userId}`, undefined, { shallow: true });
    }
  }, [success, source]);

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
        toast.error("Error fetching session or user");
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
      setCurrentPage(1);
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
  const nextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) return <Loader />;

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
          <div className="flex flex-wrap gap-5 max-md:justify-center max-md:overflow-scroll max-md:h-[36rem]">
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
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default Page;

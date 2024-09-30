"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { getSession, signOut } from "next-auth/react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar = ({ userId, handleSearch }) => {
  const [session, setSession] = useState(null);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await getSession();
      setSession(sessionData);
    };
    fetchSession();
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = debounce((query) => {
    handleSearch(query);
  }, 300);

  const navItems = ["Home", "Features", "FAQs", "About"];
  const isLoggedIn = session || userId;

  return (
    <nav className="p-3 flex justify-between items-center flex-col md:flex-row">
      {/* Logo and Logout Button for Mobile */}
      <div className="flex w-full md:w-fit justify-between items-center md:order-1">
        <div className="flex gap-1">
          <Image src="/icons/logo.png" alt="logo" width={35} height={35} />
          <h1 className="font-extrabold text-2xl">Quiknote</h1>
        </div>
        {isLoggedIn ? (
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-[#FFC700] md:hidden border border-black text-black rounded-2xl hover:bg-[#bd991a]"
          >
            Logout
          </Button>
        ) : (
          <div className="md:hidden flex items-center gap-2 px-2">
            <Link href="/login">
              <Button className="bg-[#12296c] border border-black text-white rounded-2xl hover:bg-[#0043a8]">
                Login
              </Button>
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <button aria-label="Open Menu">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 5L16 5" />
                    <path d="M4 12L20 12" />
                    <path d="M4 19L12 19" />
                  </svg>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="p-4">
                <SheetHeader>
                  <SheetTitle className="text-3xl">Menu</SheetTitle>
                  <SheetDescription className="flex flex-col gap-4 text-2xl md:mr-16">
                    {navItems.map((item) => (
                      <Link
                        key={item}
                        href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                      >
                        {item}
                      </Link>
                    ))}
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>

      {isLoggedIn && (
        <div className="w-full md:w-auto flex justify-center md:order-2 mt-2 md:mt-0">
          <Input
            type="text"
            placeholder="Search.."
            className="text-black bg-white border border-black md:w-[44rem] w-full"
            value={query}
            onChange={handleInputChange}
          />
        </div>
      )}

      {!isLoggedIn && (
        <div className="w-full md:flex justify-center md:order-3 mt-2 md:mt-0 hidden md:mr-16">
          <ul className="gap-3 flex">
            {navItems.map((item) => (
              <Link
                href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                key={item}
                className={`cursor-pointer text-base ${
                  router.pathname === `/${item.toLowerCase()}`
                    ? "text-gray-400"
                    : "text-black"
                }`}
              >
                {item}
              </Link>
            ))}
          </ul>
        </div>
      )}

      <div className="md:flex justify-center md:order-4 mt-2 md:mt-0 hidden">
        {isLoggedIn ? (
          <Button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="bg-[#FFC700] border border-black text-black rounded-2xl hover:bg-[#bd991a] hidden md:inline-block"
          >
            Logout
          </Button>
        ) : (
          <Link href="/login">
            <Button className="bg-[#12296c] border border-black text-white rounded-2xl hover:bg-[#0043a8]">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

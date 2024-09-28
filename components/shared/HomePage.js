import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";

const HomePage = () => {
  return (
    <div>
      <div className="flex h-full">
        <Image
          src="/images/human-1.svg"
          width={350}
          height={350}
          alt="human"
          className="mt-[26%] hidden md:inline-block"
        />
        <div className="container flex flex-col gap-4 items-center mx-auto relative h-fit mt-28 text-center">
          <div className="home-title"></div>
          <h2 className="font-extrabold text-5xl md:text-6xl text-wrap">
            Write your thoughts down as they come to you.
          </h2>
          <p>
            Quiknote is a simple to use free note taking app made with Next js,
            Tailwind and Mongo DB
          </p>
          <Link href="/login">
            <Button className="bg-[#12296c] border border-black text-white rounded-2xl hover:bg-[#0043a8] w-fit">
              Try Quiknote, it's Free!
            </Button>
          </Link>
        </div>
        <Image
          src="/images/human-2.svg"
          width={350}
          height={350}
          alt="human"
          className="mt-[19.6%] hidden md:inline-block"
        />
      </div>
    </div>
  );
};

export default HomePage;

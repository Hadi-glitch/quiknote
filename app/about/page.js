import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';

const About = () => {
  return (
    <div className="bg-[#FFC700] min-h-screen flex flex-col justify-between relative">
      <Navbar />

      <main className="container mx-auto px-4 md:px-8 lg:px-16 py-5 flex-grow mb-14 md:mb-0">
        <h1 className="text-4xl font-bold mb-6">About QuikNote</h1>

        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            At QuikNote, our mission is to provide an easy, fast, and efficient way to take notes and keep your thoughts organized. We believe that great ideas can come at any moment, and you should have the tools to capture them seamlessly.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-4">What We Offer</h2>
          <ul className="list-disc pl-6 text-lg leading-relaxed">
            <li>Real-time note-taking</li>
            <li>Seamless syncing across devices</li>
            <li>Easy organization with tags and folders</li>
            <li>Simple and intuitive UI design</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <p className="text-lg leading-relaxed">
            QuikNote was born out of a simple frustration: the lack of quick, efficient, and user-friendly tools to capture ideas. As developers and creators ourselves, we wanted to create a platform that would allow anyone to take notes without hassle, offering features like rich text editing, tagging, and folder organization.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-lg leading-relaxed">
            We are a small team of passionate developers and creators committed to building the best note-taking experience out there. With years of experience in the tech industry, we're focused on making QuikNote a tool that works for you, no matter where you are.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;

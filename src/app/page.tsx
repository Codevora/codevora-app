import Image from "next/image";
import Link from "next/link";

export default function Home() {
 return (
  <div>
   <section className="h-[650px] md:h-screen lg:h-screen bg-[radial-gradient(ellipse_130%_120%_at_top_left,#354da1,#0f0f0f_66%)] text-tulang justify-center mx-auto items-center flex flex-col gap-5">
    {/*LOGO*/}
    <img
     src="/Logos/1.png"
     alt=""
     className=" h-[80px]  md:h-[150px] lg:h-[150px] 2xl:h-[200px] transition-all"
    />
    {/* About */}
    <h1 className="text-4xl md:text-6xl lg:text-6xl 2xl:text-8xl font-bold">
     CODEVORA<span className="text-primary">.</span>ID
    </h1>
    <button className="p-2 bg-tulang text-hitam rounded-lg hover:bg-opacity-80 font-semibold 2xl:text-xl">
     <Link href="/about">Learn More About Us</Link>
    </button>
   </section>

   <section className="h-screen bg-[radial-gradient(ellipse_65%_75%_at_right,#354da1,#0f0f0f_66%)] text-tulang justify-center mx-auto items-center flex flex-col gap-5 px-10">
    <div className="flex flex-col lg:flex-row gap-[100px] lg:gap-[200px] justify-center items-center">
     <div className="flex flex-col gap-5 max-w-[400px] md:max-w-[600px] lg:max-w-[600px] 2xl:max-w-[700px] items-center lg:items-start text-center lg:text-start mx-auto lg:mx-0">
      <h1 className="text-tulang text-4xl 2xl:text-6xl font-bold">
       WHAT IS CODEVORA?
      </h1>
      <div className="neon-line delay-400" />
      <p className="md:text-2xl lg:text-2xl 2xl:text-3xl">
       Codevora is a startup company that operates in the field of digital
       technology. Our goal is to create and develop new innovations in the
       digital world to facilitate business operations at both the micro and
       macro levels.
      </p>
     </div>
     <img
      src="/Logos/1.png"
      alt=""
      className="h-[200px] w-[350px] lg:h-[250px] lg:w-[400px] 2xl:h-[300px] 2xl:w-[500px]"
     />
    </div>
   </section>
  </div>
 );
}

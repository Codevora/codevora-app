import Link from "next/link";
import SessionUsers from "../ui/SessionUsers";

const Navbar = () => {
 return (
  <div className="fixed top-0 z-10 flex items-center w-full p-5 px-10 text-tulang">
   <nav className="flex justify-between w-full">
    <ul className="flex items-center">
     <Link href="/">
      <img
       src="/Logos/1.png"
       alt=""
       className="w-16"
      />
     </Link>
    </ul>
    <ul>
     <SessionUsers />
    </ul>
   </nav>
  </div>
 );
};

export default Navbar;

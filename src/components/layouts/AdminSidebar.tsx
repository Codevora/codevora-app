"use client";
import {signOut, useSession} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {FaCreditCard, FaUser} from "react-icons/fa";
import {FaCartShopping} from "react-icons/fa6";
import {GoGear} from "react-icons/go";
import {MdDashboard} from "react-icons/md";
import {RiCustomerService2Fill} from "react-icons/ri";
import {TbReport} from "react-icons/tb";

const links = [
 {name: "Dashboard", path: "/admin/dashboard", icon: <MdDashboard />},
 {
  name: "Products",
  path: "/admin/products",
  icon: <FaCartShopping />,
 },
 {name: "Reports", path: "/admin/reports", icon: <TbReport />},
 {
  name: "Payment Methods",
  path: "/admin/payment-methods",
  icon: <FaCreditCard />,
 },
 {name: "Clients", path: "/admin/clients", icon: <FaUser />},
 {
  name: "Services",
  path: "/admin/services",
  icon: <RiCustomerService2Fill />,
 },
 {name: "Settings", path: "/admin/settings", icon: <GoGear />},
];

export default function AdminSidebar() {
 const pathname = usePathname();
 const {data: session, status}: {data: any; status: string} = useSession();
 return (
  <div className="fixed left-0 top-0 h-full max-w-[250px] w-full bg-hitam p-5 flex flex-col justify-between items-center shadow-sm ">
   <ul className="flex flex-col w-full items-center">
    <Link
     href="/"
     className="flex flex-col items-center">
     <Image
      src="/Logos/1.png"
      alt=""
      width={100}
      height={100}
     />
     <h1 className="text-tulang mt-3 font-bold text-2xl">CODEVORA</h1>
    </Link>
    <ul className="flex flex-col gap-2 w-full mt-8">
     {links.map((link, index) => (
      <Link
       href={link.path}
       key={index}
       className={`flex items-center gap-4 p-2 hover:bg-primary hover:text-tulang text-tulang rounded-[8px] w-full transition-all duration-500 ${
        link.path === pathname && "bg-primary text-tulang"
       }`}>
       <li className="text-xl">{link.icon}</li>
       <p>{link.name}</p>
      </Link>
     ))}
    </ul>
   </ul>
   <button
    onClick={() => signOut()}
    className="bg-primary text-tulang w-full py-2 rounded-[8px] cursor-pointer">
    Sign Out
   </button>
  </div>
 );
}

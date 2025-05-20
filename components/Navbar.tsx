import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
    return (
        <header className="w-full z-10 bg-white">
            <nav className="max-w-screen mx-auto flex justify-between items-center sm:px-16 px-6 py-4">
            <Link href="/" className="flex">
                <Image src="/logo.svg" alt="Logo" width={64} height={64}/>
                <p className="text-black mt-4 ml-2 font-bold text-2xl">SpaceLab</p>
            </Link>
            <ul className="text-black text-xl grid grid-cols-3 gap-6 justify-">
                <li>
                    <Link href={'/about'}>About</Link>
                </li>
                <li>
                    <Link href={'/rockets'}>Rockets</Link>
                </li>
                <li>
                    <Link href={'/missions'}>Missions</Link>
                </li>
            </ul>
            </nav>
        </header>
    );
}

import "./globals.css";

import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: "SpaceLab",
  description: "Site with rockets.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body className='bg-[#1b2038] font-roboto max-h-screen h-screen justify-between flex flex-col'>
        <div className='bg-[#1b2038] w-full h-24 flex content-center flex-row'>
          <Link href='/'>
            <div className='h-16 w-52 flex mt-4 ml-6 hover:cursor-pointer '>
              <Image src="/Assets/logo.svg" alt='logo' width={47} height={65} />
              <div className='text-white text-4xl mt-3 ml-2'>SpaceLab</div>
            </div>
          </Link>
          <div className='h-16 flex mt-8 ml-20 hover:cursor-pointer '>
            <div className='text-white text-2xl'>Rockets</div>
          </div>        
        </div>
        <div className='mb-auto max-h-screen '>{children}</div>
        <div className='bg-[#1b2038] w-full h-24 flex flex-row justify-end'>
          
          <div className='text-white text-2xl mt-8 mr-10 text-opacity-40'>SpaceLab &copy; 2025</div>
        </div>
      </body>
    </html>
  );
}
//<div className='text-white text-2xl mt-8 mr-auto ml-10 hover:cursor-pointer'>Add your game</div>
import Image from "next/image";
import Link from "next/link";
interface Props{
    name:string | null;
    image:string | null;
    description_short:string | null;
}

export default function Card({name,image,description_short}:Props) {
  return (
    <Link href="">
    <div className="w-64 border-1 shadow-2xl rounded-2xl items-center h-max p-2 min-h-90">
        <div className="text-xl font-bold text-center">{name}</div>
        <Image src={image ?? '/Images/placeholder.png'} alt={name??"Mission not found"} width={512} height={128} loading="lazy" className="w-52 h-52 rounded-3xl mx-auto" placeholder="blur" blurDataURL="/Images/blur.png"/>
        <div className="h-12 mt-2 mx-auto px-2">{description_short}</div>
    </div>
    </Link>
  );
}

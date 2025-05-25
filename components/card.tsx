import Image from "next/image";

interface Props{
    name:string | null;
    image:string | null;
    description_short:string | null;
}

export default function Card({name,image,description_short}:Props) {
  return (
    <div className="h-25 bg-">
        {name}
        <Image src={image ?? '/placeholder.png'} alt={name??"Mission not found"} width={128} height={128}/>
        {description_short}
    </div>
  );
}

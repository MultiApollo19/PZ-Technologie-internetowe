import Image from "next/image";

interface Props{
    id:number;
    name:string | null;
    image:string | null;
    description_short:string | null;
}

export default function Card({id,name,image,description_short}:Props) {
  return (
    <div className="h-25 bg-">
        {id}
        {name}
        <Image src={image ?? '/placeholder.png'} alt={name??"Mission not found"} width={128} height={128}/>
    </div>
  );
}

import { JsonArray } from "@prisma/client/runtime/client";
import { JsonObject } from "@prisma/client/runtime/client";
import Image from "next/image";
import Link from "next/link";
interface Props {
  id: string;
  name: string;
  image: string | null;
  massToOrbit: number[];
}
export default function RocketCard({ id, name, image, massToOrbit }: Props) {

  return (
    <Link href={`/rockets/${id}`}>
      <div className="grid grid-cols-2 grid-rows-2 rounded-3xl bg-gray-300">

        {!id && <div>Rocket not found</div>}

        {id && <>
          <Image src={image ?? '/Images/placeholder.png'} alt={name ?? "Mission not found"} width={512} height={512} loading="lazy" className="w-52 h-62 object-cover row-span-2 rounded-l-xl left-0" placeholder="blur" blurDataURL="/Images/blur.png" />
          <div className="text-xl font-bold text-center h-20 mt-6">{name}</div>
          <div className="h-29 mx-auto px-2">
            <div className="font-bold">Payload to orbit</div>
            {massToOrbit[0]!=0&&<div>LEO: {massToOrbit[0]} kg</div>}
            {massToOrbit[1]!=0&&<div>GTO: {massToOrbit[1]} kg</div>}
            {massToOrbit[2]!=0&&<div>TLI: {massToOrbit[2]} kg</div>}
            </div></>
        }


      </div>
    </Link>
  );
}

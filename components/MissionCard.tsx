import Image from "next/image";
import Link from "next/link";
interface Props {
  id:string | null;
  name: string | null;
  image: string | null;
  description_short: string | null;
}
export default function MissionCard({ id,name, image, description_short }: Props) {
  return (
    <Link href={`/missions/${id}`}>
      <div className="grid grid-cols-2 grid-rows-2 rounded-3xl bg-gray-300">
        <Image src={image ?? '/Images/placeholder.png'} alt={name ?? "Mission not found"} width={512} height={256} loading="lazy" className="w-52 h-62 object-cover row-span-2 rounded-l-xl left-0" placeholder="blur" blurDataURL="/Images/blur.png" />
        <div className="text-xl font-bold text-center h-20 mt-6">{name}</div>
        <div className="h-29 mx-auto px-2 mt-2">{description_short}</div>
      </div>
    </Link>
  );
}

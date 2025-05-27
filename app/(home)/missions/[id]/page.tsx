import prisma from "@/lib/prisma";
import Image from "next/image";


/*interface Props {
    params: {
        id: string | null,
    };
}*/
/*export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const mission = await prisma.missions.findUnique({ where: { id: id } });
    return { title: `Mission  ${mission?.name}` };
}*/

export default async function MissionPage(props: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await props.params;
    const mission = await prisma.missions.findUnique({
        where: {
            id: id
        }
    })
    return (
        <div className="bg-white h-screen w-screen text-black mt-10">
            <div>
                <div className="text-5xl font-bold text-center">
                    Mission {mission?.name}
                    <Image src={mission?.image ?? '/Images/placeholder.png'} alt={mission?.name ?? "Mission not found"} width={512} height={256} loading="lazy" className="w-82 h-82 object-cover mx-auto mt-4 rounded-2xl" placeholder="blur" blurDataURL="/Images/blur.png" />
                </div>
            </div>
            <div className="mx-80 mt-6">{mission?.description || 'No content available'}</div>
        </div>
    );
}
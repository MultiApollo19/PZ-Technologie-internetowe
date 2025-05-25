import prisma from "@/lib/prisma";
import { unstable_cache } from 'next/cache'
import Card from "@/components/card";


const getMisssions = unstable_cache(
    async () => {
        return await prisma.missions.findMany()
    },
    [''],
    { revalidate: 60 }
)

export default async function missionsPage() {
    const missions = await getMisssions()
    return (
        <div>
            <div className="text-5xl font-bold text-center">
                Missions
            </div>
            <div className="bg-white h-screen w-screen text-black grid grid-cols-6 justify-items-center mt-10 grid-rows-3 gap-y-50">
                {missions.map((mission) => {
                    return <Card key={mission.id} {...mission} />;
                })}
            </div>
        </div>
    )
}

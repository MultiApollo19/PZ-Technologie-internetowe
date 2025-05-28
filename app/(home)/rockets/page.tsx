import prisma from "@/lib/prisma";
import { unstable_cache } from 'next/cache'
import RocketCard from "@/components/RocketCard";


const getRockets = unstable_cache(
    async () => {
        return await prisma.rockets.findMany()
    },
    [''],
    { revalidate: 10 }
)

export default async function rocketsPage() {
    const rockets = await getRockets()
    return (
        <div>
            <div className="text-5xl font-bold text-center">
                Rockets
            </div>
            <div className="bg-white h-screen w-screen text-black grid grid-cols-4 mt-10 grid-rows-3 mx-auto p-10 gap-4">
                {rockets.map((rocket) => {
                    return <RocketCard key={rocket.id} {...rocket} />;
                })}
            </div>
        </div>
    )
}

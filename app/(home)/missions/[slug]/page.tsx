interface Props{
    params: {slug: string};
}
export default async function MissionPage({params}:Props) {
    //const supabase = await createClient();
    //const {slug} = await params;
    //const { data: missions } = await supabase.from("missions").select().eq('name_slug',slug);
    return(
        <div className="bg-white h-screen w-screen text-black"> 
            
        </div>
    );
}
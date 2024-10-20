import { SchoolResult } from "../models/schoolResult";
import { CarFront, Footprints, TramFront } from 'lucide-react'
import { FormEvent } from 'react';
import { useStore } from "../stores/store";

interface Props {
    results: SchoolResult[]
}

export default function SearchResults({ results }: Props) {  
    const { schoolStore } = useStore();

    const handleAdd = async (e: FormEvent<HTMLFormElement>, item: SchoolResult) => {
        e.preventDefault();
        if (schoolStore.addSchool(item)) {
            alert(`Added ${item.school_name} to your list.`)
        }
    }

    return (
    <div className="h-full w-full mt-12">
        {results.map(item => (
            <div key={item.school_id} className="mb-10 flex flex-col bg-[#fdfdfd] rounded-lg py-8 px-6 lg:px-12 gap-6 border-2 border-neutral-200">
                <div className="flex flex-col">
                    <h1 className="text-xl lg:text-2xl font-bold">{item.school_name}</h1>
                    <h2 className="text-base lg:text-lg font-light"><span className="font-bold">{item.school_rank}</span> out of 460</h2>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <p>Estimated travel times for <span className="font-bold">{item.school_time}</span> start from <span className="font-medium">{item.start_address}</span></p>
                        <p className="text-xs italic">Always verify travel times on your own!</p>
                    </div>
                    <div className="flex flex-col gap-4 lg:flex-row lg:gap-12">
                        <div className="flex flex-row gap-2">
                                <CarFront />
                                <p><span className="font-bold">{item.driving_time}</span> drive (approximately)</p>
                        </div>

                        <div className="flex flex-row gap-2">
                                <TramFront />
                                <p><span className="font-bold">{item.transit_time}</span> via TTC</p>
                        </div>

                        <div className="flex flex-row gap-2">
                                <Footprints />
                                <p><span className="font-bold">{item.walking_time}</span> walk</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4 lg:flex-row lg:gap-8">
                   <a href={item.apple_maps_url} target="_blank" className="flex flex-row justify-center items-center gap-2 py-4 px-2 md:px-24 bg-neutral-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-100">
                        <p className="text-neutral-800">View in</p>
                        <img src="/apple_maps.png" alt="apple maps" className="h-[22.5px]" />
                   </a>
                   <a href={item.google_maps_url} target="_blank" className="flex flex-row justify-center items-center gap-2 py-4 px-2 md:px-24 bg-neutral-100 rounded-lg shadow-md hover:shadow-lg transition-all duration-100">
                        <p className="text-neutral-800">View in</p>
                        <img src="/google_maps.png" alt="apple maps" className="h-[22.5px]" />
                   </a>
                </div>

                <form onSubmit={(e) => handleAdd(e, item)} className="flex gap-4 items-baseline">              
                    <button type="submit" className={`bg-green-700 text-white font-bold p-2 w-full md:w-1/5 rounded-md`}>
                        Add to School List
                    </button>
                </form>
            </div>
        ))}
    </div>
  )
};

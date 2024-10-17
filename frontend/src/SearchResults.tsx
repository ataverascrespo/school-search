import { SchoolResult } from "./schoolResult";

interface Props {
    results: SchoolResult[]
}

export default function SearchResults({ results }: Props) {  
    return (
    <div className="h-full w-full">
            {results.map(item => (
            <li key={item.school_id} className="border-b py-2">
                <h2 className="font-bold">{item.school_name} (Rank: {item.school_rank})</h2>
                <p>Driving Time: {item.driving_time}</p>
                <p>Walking Time: {item.walking_time}</p>
                <p>
                <a href={item.google_maps_url} target="_blank" rel="noopener noreferrer">Google Maps</a>
                {' | '}
                <a href={item.apple_maps_url} target="_blank" rel="noopener noreferrer">Apple Maps</a>
                </p>
            </li>
        ))}
    </div>
  )
};

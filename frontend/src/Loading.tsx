import { Loader2 } from 'lucide-react';

// Define component icons
export const Icons = {
    spinner: Loader2,
};

export function Loading() {
    return (
        <div className="container">
            <div className={`w-full h-screen flex flex-col justify-center items-center gap-4 text-neutral-800`}>
                <Icons.spinner className="w-[10vw] h-[10vh] animate-spin" />
                <h2 className="text-xl text-center">Loading</h2>
            </div>
        </div>
    )
}

import { createContext, useContext } from "react";
import SchoolStore from "./schoolStore";

// Create an interface to store all of the app's global states
interface Store {
    schoolStore: SchoolStore;
}

export const store: Store = {
    schoolStore: new SchoolStore()
}

// Create the app context using store interface
export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}
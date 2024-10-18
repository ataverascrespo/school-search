import { makeAutoObservable, runInAction } from "mobx";
import { SchoolResult } from "../models/schoolResult";

export default class SchoolStore {

    savedSchools: SchoolResult[] = [];
    searchedSchools: SchoolResult[] = [];
    searchedSchoolName: string = "";
    searchedSchoolTime: string = "";
    searchedAddress: string = "";
    isSearched: boolean = false;

    // Set this store as observable.
    // In Mobx, making a class or property observable means that that object's state is globally stored, and changes are always tracked
    constructor() {
        makeAutoObservable(this)
    }

    searchSchools = async (query: string, time: string, address: string, url: string) => {
        try {
            const response = await fetch(`${url}/search?address=${address}&query=${query}&time=${time}`);
            const data: SchoolResult[] = await response.json();
            runInAction(() => {
                this.searchedSchools = data.sort((a: SchoolResult, b: SchoolResult) => b.school_rank - a.school_rank);                
                this.searchedSchoolName = query;
                this.searchedSchoolTime = time;
                this.searchedAddress = address
                this.isSearched = true;
            });
            localStorage.setItem('searchedSchools', JSON.stringify(data));
            localStorage.setItem('address', JSON.stringify(this.searchedAddress));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    getSchools = () => {
        const savedSchools = localStorage.getItem('savedSchools');
        const arr: SchoolResult[] = savedSchools ? JSON.parse(savedSchools) : [];
        return arr;
    }

    getAddress = () => {
        const savedAddress = localStorage.getItem('address');
        const address: string = savedAddress ? JSON.parse(savedAddress) : [];
        return address;
    }

    addSchool = (school: SchoolResult) => {
        const savedSchools = localStorage.getItem('savedSchools');
        const arr: any[] = savedSchools ? JSON.parse(savedSchools) : [];
        const isDuplicate = arr.some(oldItem => oldItem.school_id === school.school_id);

        if (!isDuplicate) {
            const newArray = [
                ...arr,
                school
            ];
            
            localStorage.setItem('savedSchools', JSON.stringify(newArray));
            return true;
        }
        return false;
    }

    removeSchool = (id: number) => {
        const savedSchools = localStorage.getItem('savedSchools');
        var schoolsArr: any[] = savedSchools ? JSON.parse(savedSchools) : [];
        schoolsArr = schoolsArr.filter(school => school.school_id !== id);
        localStorage.setItem('savedSchools', JSON.stringify(schoolsArr)); 
    }

}
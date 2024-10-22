import React, { useEffect, useState } from 'react';
import { SchoolResult } from '../models/schoolResult';
import SavedSchools from './SavedSchools';
import { useStore } from '../stores/store';
import { DebounceInput } from 'react-debounce-input';
import { observer } from "mobx-react-lite";
import { Loading } from '../Loading';

const SavedComponent: React.FC = () => {
  const [schools, setSchools] = useState<SchoolResult[]>([]);
  const [isSearchLoading, setSearchLoading] = useState<boolean>(false);
  const { schoolStore } = useStore();

  // Function to retrieve schools from localStorage
  const retrieveSchools = () => {
    const schools = schoolStore.getSchools();
    setSchools(schools);
  };

  useEffect(() => {
    retrieveSchools(); // Call to retrieve the schools when the component mounts
  }, []);

  const handleSearch = async (value: string) => {
    setSearchLoading(true);
    schoolStore.setSchoolsSortQuery(value);
    setSearchLoading(false);
  };

  const handleSort = (value: string) => {
    const sortedSchools = schoolStore.setSchoolsSortOrder(value);
    setSchools(sortedSchools);
  }

  return (
    <div className="container mx-auto p-4">

    <h1 className="text-4xl font-bold text-center mt-12">Saved Schools</h1>
    <h2 className='text-sm mx-4 text-center mb-6'>These are your saved schools with your searched address and start times.</h2>
    
    <div className="flex flex-row gap-2">
      <DebounceInput
          className='border  border-gray-300 p-2 rounded-md w-2/3 md:w-full text-sm lg:text-base'
          placeholder={"Search your saved schools..."}
          minLength={0}
          debounceTimeout={750}
          value={schoolStore.savedSchoolsSortQuery}
          onChange={event => handleSearch(event.target.value)}
      />
      <select onChange={event => handleSort(event.target.value)} className='border border-gray-300 p-2 rounded-md w-1/3 lg:w-1/4 text-sm lg:text-base'>
        <option value="">Sort by</option>
        <option value="oldest">Oldest first (default)</option>
        <option value="newest">Newest first</option>
        <option value="highest">Highest rank first</option>
        <option value="lowest">Lowest rank first</option>
        <option value="closest-drive">Closest first (driving)</option>
        <option value="closest-ttc">Closest first (transit)</option>
      </select>
    </div>

    {
        isSearchLoading
            ? <Loading/>
            : (
              <div className="mt-4">
                  {schools.length > 0 ? (
                  <ul>
                      <SavedSchools schools={
                        schools
                        .filter(school => school.school_name.toLowerCase().includes(schoolStore.savedSchoolsSortQuery.toLowerCase()))       
                      }></SavedSchools>
                  </ul>
                  ) : (
                    <p>No schools found</p> // Only show if searched
                  )}
              </div>
            )
    }
    </div>
  );
};

export default observer(SavedComponent);

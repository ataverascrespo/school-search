import React, { useEffect, useState } from 'react';
import { SchoolResult } from '../models/schoolResult';
import SavedSchools from './SavedSchools';
import { useStore } from '../stores/store';

const SavedComponent: React.FC = () => {
  const [schools, setSchools] = useState<SchoolResult[]>([]);
  const { schoolStore } = useStore();

  // Function to retrieve schools from localStorage
  const retrieveSchools = () => {
    const schools = schoolStore.getSchools();
    setSchools(schools);
  };

  useEffect(() => {
    retrieveSchools(); // Call to retrieve the schools when the component mounts
  }, []);
  
  return (
    <div className="container mx-auto p-4">

    <h1 className="text-4xl font-bold text-center mt-12">TDSB Saved List</h1>
    <h2 className='text-sm mx-4 text-center mb-6'>These are your saved schools with your searched address and start times.</h2>

      {(
        <div className="mt-4">
            {schools.length > 0 ? (
            <ul>
                <SavedSchools schools={schools}></SavedSchools>
            </ul>
            ) : (
              <p>No schools found</p> // Only show if searched
            )}
        </div>
      )}
    </div>
  );
};

export default SavedComponent;

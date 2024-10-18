import React, { useEffect, useState } from 'react';
import { SchoolResult } from '../schoolResult';
import SavedSchools from './SavedSchools';

const SavedComponent: React.FC = () => {

  const [schools, setSchools] = useState<SchoolResult[]>([]);

  // Function to retrieve schools from localStorage
  const retrieveSchools = () => {
    const savedSchools = localStorage.getItem('savedSchools');
    const arr: SchoolResult[] = savedSchools ? JSON.parse(savedSchools) : [];
    setSchools(arr);
  };

  useEffect(() => {
    retrieveSchools(); // Call to retrieve the schools when the component mounts
  }, []);
  
  return (
    <div className="container mx-auto p-4">
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

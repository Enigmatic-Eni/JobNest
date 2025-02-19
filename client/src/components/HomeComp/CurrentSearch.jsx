import React from 'react'
import { useState } from 'react';

function CurrentSearch() {

const jobListings = [
  { id: 1, title: "Frontend Developer", category: "QA", location: "USA" },
  { id: 2, title: "Backend Developer", category: "Development", location: "Canada" },
  { id: 3, title: "UI/UX Designer", category: "Design", location: "UK" },
  { id: 4, title: "Fullstack Developer", category: "Development", location: "USA" },
  { id: 5, title: "Data Scientist", category: "Data Science", location: "Germany" },
  { id: 6, title: "Graphic Designer", category: "Design", location: "UK" },
];

const categories = ["Development", "Design", "Data Science", "QA"];
const locations = ["USA", "Canada", "UK", "Germany"];


const [selectedCategories, setSelectedCategories] = useState([]); 
const [selectedLocations, setSelectedLocations] = useState([]);

// const [isChecked, setIsChecked] = useState(false);

// const handleChange = ()=>{
//   setIsChecked(!isChecked)
// }

const handleCategoryChange = (category) => {
  setSelectedCategories((prevSelected) =>
    prevSelected.includes(category)
      ? prevSelected.filter((item) => item !== category) 
      : [...prevSelected, category] 
  );
}

  const handleCheckboxChange = (location) => {
    setSelectedLocations((prevSelected) =>
      prevSelected.includes(location)
        ? prevSelected.filter((item) => item !== location) 
        : [...prevSelected, location] 
    );
  };

  return (
    <div >
      <p className=' font-semibold text-lg'>Current Search</p>
      <div className=' space-x-4 my-3'>
      <button className=' bg-[#EFF5FF] text-text text-sm rounded-sm border border-[#8BC3FF] py-2 px-4'>Full Stack</button>
      <button className=' bg-[#FFF5F3] text-text text-sm rounded-sm border border-[#FFBABA] py-2 px-4'>Nigeria</button>
      </div>

      <div>
  
        <div className="flex flex-col space-y-8">
        {/* Category Filters */}
        <div>
          <h3 className="font-semibold text-lg py-3">Search by Categories</h3>
          <div className="flex flex-col space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center py-2 space-x-2 ">
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryChange(category)}
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                />
                <span>{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Location Filters */}
        <div>
        <h3 className="font-semibold text-lg pb-3">Search by Location</h3>
          <div className="flex flex-col space-y-2">
            {locations.map((location) => (
              <label key={location} className="flex items-center py-2 space-x-2">
                <input
                  type="checkbox"
                  value={location}
                  checked={selectedLocations.includes(location)}
                  onChange={() => handleLocationChange(location)}
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                />
                <span>{location}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      </div>


      {/* <input type="checkbox" checked={isChecked} onChange={handleChange} /> */}
      </div>
  )
}

export default CurrentSearch
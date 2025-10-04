import React from "react";
import { CiLocationOn, CiSearch } from "react-icons/ci";

export default function SearchBar() {
  return (
    <div>
      <div className="search-bar flex gap-8">
        <div className="relative max-w-[599px] text-text">
          <CiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type="text"
            className=" w-[599px] pl-10 pr-4 py-4 bg-white rounded focus:outline-none border-2"
            placeholder=" Search for Jobs"
          />
        </div>

        <button className="rounded  bg-theme py-3 px-8 text-white hover:bg-theme-hover cursor-pointer">
          Search
        </button>
      </div>
    </div>
  );
}

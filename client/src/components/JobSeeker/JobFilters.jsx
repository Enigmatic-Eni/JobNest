import React, {useState} from 'react'

const sources = [
  {label: "All Sources", value: ""},
  {label: "Greenhouse", value: "greenhouse"},
  {label: "Arebeitnow", value: "arbeitnow"},
  {label: "Remotive", value: "remotive"}
];


export default function JobFilters({onFilterChange}) {

  const [location, setLocation] = useState("");
  const [source, setSource ] = useState("");


  const handleApply =()=>{
    onFilterChange({location, source});
  }

  const handleReset =()=>{
    setLocation("")
    setSource("")
    onFilterChange({location: "", source: ""})
  }


  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-semibold text-lg mb-3">Filters</h2>

        <label className="block text-sm text-gray-600 mb-1">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Remote, USA"
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00519a]"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600 mb-1">Source</label>
        <select
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00519a]"
        >
          {sources.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleApply}
          className="w-full bg-theme text-white py-2 rounded-lg text-sm hover:bg-theme-hover transition-all"
        >
          Apply Filters
        </button>
        <button
          onClick={handleReset}
          className="w-full border border-gray-300 text-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 transition-all"
        >
          Reset
        </button>
      </div>
    </div>
  )
}

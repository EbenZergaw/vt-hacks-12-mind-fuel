import React from 'react'

// TODO - WORK ON FILTER OPTIONS TYPING
function FilterPanel({filterOptions} : any) {

    
  return (
    
    <div className='flex flex-col border border-gray-800 p-4 h-full text-white rounded-lg'>
      <div>
        <div className="text lg font-bold">Tags</div>
      </div>

      <div>
        <div className="text lg font-bold">Media Types</div>
      </div>
    </div>
  )
}

export default FilterPanel

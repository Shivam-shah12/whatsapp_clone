import React from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsFilter } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import { setContactSearch } from "@/reducer/Slices/authSlice";

function SearchBar() {
  const contactSearch = useSelector((state) => state.filteredContacts);
  const dispatch = useDispatch();

  return (
    <div className="bg-search-input-container-background flex py-3 pl-5 items-center gap-3 h-14">
      <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-xl" />
        </div>
        <div>
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
            value={contactSearch}
            onChange={(e) => dispatch(setContactSearch(e.target.value))}
          />
        </div>
      </div>
      <div className="pr-5 pl-3">
        <BsFilter className="text-panel-header-icon cursor-pointer text-xl" />
      </div>
    </div>
  );
}

export default SearchBar;

import React,{useRef} from "react";
import {useEffect} from 'react'

function ContextMenu({options,coordinates,contextMenu,setContextMenu,aligning}) {
 
  const contextMenuRef=useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the clicked element is not the "context-opener"
      if (event.target.id !== "context-opener") {
        // Check if the contextMenuRef.current is defined and if it's not inside the context menu
        if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
          setContextMenu(false);
        }
      }
    };
  
    document.addEventListener("click", handleOutsideClick);
  
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [contextMenuRef, setContextMenu]);
  
  const handleClick=(e,callback)=>{
       e.stopPropagation();
       callback()
       setContextMenu(false)
  }
  console.log(options)
 
  return (
    <div
    className={`bg-dropdown-background fixed py-2 z-[100] `}
    style={{
      top: coordinates.y,
      left: coordinates.x,
    }}    
      ref={contextMenuRef}
    >
      <ul>
        {options.map(({ name, callback }) => (
          <li
            key={name}
            className="px-10 py-2 cursor-pointer text-white hover:bg-gray-500"
            onClick={(e) => handleClick(e, callback)}
          >
            <span>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ContextMenu;

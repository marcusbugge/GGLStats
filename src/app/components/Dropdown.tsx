import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import downbutton from "../assets/arrow.png"; // Replace with your actual path

export default function Dropdown({ options, selectedValue, onChange }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [rotated, setRotated] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleDocumentClick(event: any) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setRotated(false);
      }
    }

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  const handleSelect = (value: any, name: any) => {
    onChange(value, name);
    setIsOpen(false);
    setRotated(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    setRotated(!rotated);
  };

  const selectedOption = options.find(
    (option: any) => option.value === selectedValue
  );

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div className="dropdown-head" onClick={toggleDropdown}>
        {selectedOption ? selectedOption.name : "1. divisjon"}
        <Image
          src={downbutton}
          alt="dropdown-icon"
          className={`dropdown-icon ${rotated ? "dropdown-icon-rotated" : ""}`}
        />
      </div>
      {isOpen && (
        <div className={`custom-dropdown-options ${isOpen ? "show" : ""}`}>
          {options.map((option: any, index: any) => (
            <div
              className="option"
              key={index}
              onClick={() => handleSelect(option.value, option.name)}
            >
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

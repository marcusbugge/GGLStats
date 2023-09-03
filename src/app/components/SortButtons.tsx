import React from "react";

type SortButtonsProps = {
  options: string[];
  selectedSort: string;
  onSortClick: (sortValue: string) => void;
};

const SortButtons: React.FC<SortButtonsProps> = ({
  options,
  selectedSort,
  onSortClick,
}) => {
  return (
    <div className="sorts-cnt">
      {options.map((option) => (
        <div
          key={option}
          className={`sort-option ${selectedSort === option ? "active" : ""}`}
          onClick={() => onSortClick(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default SortButtons;

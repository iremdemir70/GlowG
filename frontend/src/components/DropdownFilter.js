import React, { useState } from 'react';
import './DropdownFilter.css';

const DropdownFilter = ({ categories, selected, onSelect }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="dropdown">
      <dt onClick={() => setOpen(!open)}>
        <a href="#">{selected || 'Select category'}</a>
      </dt>
      {open && (
        <dd>
          <ul>
            {categories.map((cat) => (
              <li key={cat}>
                <a onClick={() => { onSelect(cat); setOpen(false); }}>{cat}</a>
              </li>
            ))}
          </ul>
        </dd>
      )}
    </div>
  );
};
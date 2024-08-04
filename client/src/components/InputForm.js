import React, { useState } from 'react';

const InputForm = ({ data, onSave }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (category, index, field, value) => {
    const updatedData = { ...formData };
    updatedData[category][index][field] = value;
    setFormData(updatedData);
  };

  const handleAddItem = (category) => {
    const updatedData = { ...formData };
    updatedData[category].push({ label: '', value: 0 });
    setFormData(updatedData);
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div>
      {/* Render input fields for each category */}
      {Object.entries(formData).map(([category, items]) => (
        <div key={category}>
          <h3>{category}</h3>
          {items.map((item, index) => (
            <div key={index}>
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleChange(category, index, 'label', e.target.value)}
                placeholder="Label"
              />
              <input
                type="number"
                value={item.value}
                onChange={(e) => handleChange(category, index, 'value', parseFloat(e.target.value))}
                placeholder="Value"
              />
              {category === 'assets' && (
                <input
                  type="number"
                  value={item.growthRate || 0}
                  onChange={(e) => handleChange(category, index, 'growthRate', parseFloat(e.target.value))}
                  placeholder="Growth Rate (%)"
                />
              )}
              {category === 'liabilities' && (
                <input
                  type="number"
                  value={item.interestRate || 0}
                  onChange={(e) => handleChange(category, index, 'interestRate', parseFloat(e.target.value))}
                  placeholder="Interest Rate (%)"
                />
              )}
            </div>
          ))}
          <button onClick={() => handleAddItem(category)}>Add Item</button>
        </div>
      ))}
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default InputForm;

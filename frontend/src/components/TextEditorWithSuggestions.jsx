import React, { useState } from 'react';

const TextEditorWithSuggestions = ({ suggestions, onTextSelect, label }) => {
  const [editorText, setEditorText] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleChange = (e) => {

    const text = e.target.value;
    setEditorText(text);
    filterSuggestions(text);
    onTextSelect(text);
  };

  const filterSuggestions = (input) => {
    if (!input.trim()) {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const lowercasedInput = input.toLowerCase();
    const newSuggestions = suggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(lowercasedInput)
    );

    setFilteredSuggestions(newSuggestions);
    setShowSuggestions(newSuggestions.length > 0);
  };

  const handleSelectSuggestion = (suggestion) => {
    setEditorText(suggestion); 
    setFilteredSuggestions([]); 
    setShowSuggestions(false);
    onTextSelect(suggestion);
  };

  return (
    <div style={{  color: 'black' }}>
      {label}
      <input
        type="text"
        value={editorText}
        onChange={handleChange}
        placeholder="Tapez quelque chose..."
        style={{
          width: '100%',
          border: '1px solid #ccc',
          borderRadius: '5px',
          padding: '10px',
          fontSize: '16px',
          outline: 'none'
        }}
      />

      {showSuggestions && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            width: '100%',
            border: '1px solid #ccc',
            backgroundColor: '#fff',
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            marginTop: '5px',
          }}
        >
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              style={{
                color: 'black',
                padding: '10px',
                cursor: 'pointer',
                fontSize: '16px',
                borderBottom: index !== filteredSuggestions.length - 1 ? '1px solid #ddd' : 'none',
                backgroundColor: '#fff'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#fff'}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TextEditorWithSuggestions;

import { useState } from 'react';
import './TextInput.css';

function TextInput({ placeholder, onSubmit, label }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      onSubmit(text);
      setText('');
    }
  };

  return (
    <div className="text-input-container">
      {label && <label>{label}</label>}
      <form onSubmit={handleSubmit}>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={placeholder}
          rows={5}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default TextInput;

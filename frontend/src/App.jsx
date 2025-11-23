import { useState } from 'react';
import TextInput from './components/TextInput';
import TextOutput from './components/TextOutput';
import './App.css';

function App() {
  const [output, setOutput] = useState('');

  const handleTextSubmit = (text) => {
    // Placeholder for API call - just echo for now
    setOutput(`You submitted: ${text}`);
  };

  return (
    <div className="app-container">
      <h1>Smart Study Companion</h1>
      
      <TextInput
        label="Enter your text:"
        placeholder="Type your question or text here..."
        onSubmit={handleTextSubmit}
      />

      <TextOutput
        label="Response:"
        content={output}
        placeholder="Your response will appear here..."
      />
    </div>
  );
}

export default App;

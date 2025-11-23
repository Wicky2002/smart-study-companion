import './TextOutput.css';

function TextOutput({ content, label, placeholder }) {
  return (
    <div className="text-output-container">
      {label && <label>{label}</label>}
      <div className="output-box">
        {content || <span className="placeholder">{placeholder}</span>}
      </div>
    </div>
  );
}

export default TextOutput;

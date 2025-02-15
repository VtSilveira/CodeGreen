import { useState } from "react";

const CodeForm = ({ onSubmit }) => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ language, code });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Linguagem:
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>
      </label>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Digite seu código aqui..."
      />
      <button type="submit">Enviar</button>
    </form>
  );
};

export default CodeForm;

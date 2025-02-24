import { useState } from "react";
import "../style/code-form.css";

const CodeForm = ({ onSubmit }) => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ language, code });
  };

  const languages = {
    c: "c",
    cpp: "cpp",
    java: "java",
    python: "python",
    javascript: "javascript",
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Linguagem:
        {language === languages.java && (
          <span style={{ color: "red" }}>
            *Ao usar java, o nome da classe deve ser &quot;Main&quot;.
          </span>
        )}
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value={languages.python}>Python</option>
          <option value={languages.c}>C</option>
          <option value={languages.cpp}>C++</option>
          <option value={languages.java}>Java</option>
          <option value={languages.javascript}>JavaScript</option>
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

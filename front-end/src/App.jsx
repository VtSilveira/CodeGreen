import { useState } from "react";
import CodeForm from "./components/CodeForm";
import ResultSection from "./components/ResultSection";
import { handleSubmit } from "./service/submitHandler";
import Header from "./components/Header";
import { ClipLoader } from "react-spinners"; // Importando o spinner

import "./style/global.css";

function App() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Header />
      <div className="app-container">
        <CodeForm
          onSubmit={(data) => handleSubmit(data, setResults, setLoading)}
        />
        {loading ? (
          <div className="loading-container">
            <ClipLoader color="#4CAF50" size={50} />
          </div>
        ) : (
          <ResultSection results={results} />
        )}
      </div>
    </>
  );
}

export default App;

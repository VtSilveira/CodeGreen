import { useState } from "react";
import CodeForm from "./components/CodeForm";
import ResultSection from "./components/ResultSection";
import { handleSubmit } from "./service/submitHandler";
import "./style/global.css";
import Header from "./components/Header";

function App() {
  const [results, setResults] = useState(null);

  return (
    <>
      <Header />
      <CodeForm onSubmit={(data) => handleSubmit(data, setResults)} />
      <ResultSection results={results} />
    </>
  );
}

export default App;

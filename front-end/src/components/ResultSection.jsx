const ResultSection = ({ results }) => {
  console.log("results", results);
  return (
    <div>
      <h2>Resultados</h2>
      {results ? (
        <div>{results.analyzis.output}</div>
      ) : (
        <p>Aguardando análise...</p>
      )}
    </div>
  );
};

export default ResultSection;

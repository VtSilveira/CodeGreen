const ResultSection = ({ results }) => {
  return (
    <div>
      <h2>Resultados</h2>
      {results ? (
        <pre>{JSON.stringify(results, null, 2)}</pre>
      ) : (
        <p>Aguardando análise...</p>
      )}
    </div>
  );
};

export default ResultSection;

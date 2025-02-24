import "../style/results.css";

const EnergyAnalyzis = ({ analyzis }) => {
  if (!analyzis) return <p>Carregando análise de energia...</p>;

  // Extrai os valores de energia e tempo do texto
  const match = analyzis.match(
    /([\d,.]+) Joules power\/energy-pkg\/\s+([\d,.]+) Joules power\/energy-cores\/\s+([\d,.]+) Joules power\/energy-ram\/\s+([\d,.]+) seconds time elapsed/
  );

  if (!match) {
    return <p>Não foi possível processar os dados de energia.</p>;
  }

  // eslint-disable-next-line no-unused-vars
  const [_, pkg, cores, ram, time] = match; // Pega os valores extraídos

  return (
    <div className="energy-section">
      <h2>Análise de Consumo de Energia</h2>
      <div className="energy-container">
        <div className="energy-box">
          <h3>Energia Total</h3>
          <p>{pkg} Joules</p>
        </div>
        <div className="energy-box">
          <h3>CPU (Cores)</h3>
          <p>{cores} Joules</p>
        </div>
        <div className="energy-box">
          <h3>Memória RAM</h3>
          <p>{ram} Joules</p>
        </div>
        <div className="energy-box">
          <h3>Tempo de Execução</h3>
          <p>{time} segundos</p>
        </div>
      </div>
    </div>
  );
};

export default EnergyAnalyzis;

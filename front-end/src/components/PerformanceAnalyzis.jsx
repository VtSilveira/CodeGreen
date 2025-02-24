import "../style/results.css";

const PerformanceAnalysis = ({ analyzis }) => {
  if (!analyzis) return <p>Carregando análise de desempenho...</p>;

  // Expressão regular ajustada para capturar os valores corretamente
  const match = analyzis.match(
    /([\d.,]+)\s+cycles.*?\s+([\d.,]+)\s+instructions.*?\s+([\d.,]+)\s+cache-references.*?\s+([\d.,]+)\s+cache-misses.*?\s+([\d.,]+)\s+context-switches.*?\s+([\d.,]+)\s+cpu-migrations.*?\s+([\d.,]+)\s+page-faults.*?\s+([\d.,]+)\s+msec task-clock.*?\s+([\d.,]+)\s+seconds time elapsed.*?\s+([\d.,]+)\s+seconds user.*?\s+([\d.,]+)\s+seconds sys/
  );

  if (!match) {
    return <p>Não foi possível processar os dados de desempenho. {analyzis}</p>;
  }

  // Extraindo os valores capturados
  const [
    // eslint-disable-next-line no-unused-vars
    _,
    cycles,
    instructions,
    cacheRefs,
    cacheMisses,
    contextSwitches,
    cpuMigrations,
    pageFaults,
    taskClock,
    timeElapsed,
    userTime,
    sysTime,
  ] = match;

  return (
    <div className="performance-section">
      <h2>Análise de Desempenho</h2>
      <div className="performance-container">
        <div className="performance-box">
          <h3>Ciclos de CPU</h3>
          <p>{cycles}</p>
        </div>
        <div className="performance-box">
          <h3>Instruções Executadas</h3>
          <p>{instructions}</p>
        </div>
        <div className="performance-box">
          <h3>Acessos à Cache</h3>
          <p>{cacheRefs}</p>
        </div>
        <div className="performance-box">
          <h3>Falhas de Cache</h3>
          <p>{cacheMisses}</p>
        </div>
        <div className="performance-box">
          <h3>Trocas de Contexto</h3>
          <p>{contextSwitches}</p>
        </div>
        <div className="performance-box">
          <h3>Migrações de CPU</h3>
          <p>{cpuMigrations}</p>
        </div>
        <div className="performance-box">
          <h3>Page Faults</h3>
          <p>{pageFaults}</p>
        </div>
        <div className="performance-box">
          <h3>Tempo de CPU</h3>
          <p>{taskClock} ms</p>
        </div>
        <div className="performance-box">
          <h3>Tempo Total</h3>
          <p>{timeElapsed} s</p>
        </div>
        <div className="performance-box">
          <h3>Tempo do Usuário</h3>
          <p>{userTime} s</p>
        </div>
        <div className="performance-box">
          <h3>Tempo do Sistema</h3>
          <p>{sysTime} s</p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceAnalysis;

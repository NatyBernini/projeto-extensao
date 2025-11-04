// Função para carregar CSV
async function carregarCSV(url) {
  return new Promise((resolve) => {
    Papa.parse(url, {
      download: true,
      header: true,
      complete: (results) => resolve(results.data)
    });
  });
}

// Função para criar gráfico
function criarGrafico(id, tipo, labels, data, titulo, cores) {
  new Chart(document.getElementById(id), {
    type: tipo,
    data: {
      labels,
      datasets: [{
        label: titulo,
        data,
        backgroundColor: cores,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: titulo, font: { size: 16 } }
      },
      scales: { y: { beginAtZero: true } }
    }
  });
}

// Iniciar dashboard
async function iniciarDashboard() {
  const baseAdocao = await carregarCSV('base_adocao.csv');
  const cores = await carregarCSV('CorLabels.csv');
  const racas = await carregarCSV('RacaLabels.csv');

  // Mapas auxiliares
  const corMap = {};
  cores.forEach(c => corMap[c.ColorID] = c.ColorName);

  const racaMap = {};
  racas.forEach(r => racaMap[r.BreedID] = r.BreedName);

  const especieNome = { '1': 'Cachorro', '2': 'Gato' };
  const generoNome = { '1': 'Macho', '2': 'Fêmea' };

  // Adoções por Espécie
  const contagemEspecie = {};
  baseAdocao.forEach(a => {
    const especie = especieNome[a.Tipo] || 'Indefinido';
    contagemEspecie[especie] = (contagemEspecie[especie] || 0) + 1;
  });

  criarGrafico(
    'chartEspecie',
    'bar',
    Object.keys(contagemEspecie),
    Object.values(contagemEspecie),
    'Adoções por Espécie',
    ['#36A2EB', '#FF6384']
  );

  // Adoções por Gênero
  const contagemGenero = {};
  baseAdocao.forEach(a => {
    const genero = generoNome[a.Genero] || 'Indefinido';
    contagemGenero[genero] = (contagemGenero[genero] || 0) + 1;
  });

  criarGrafico(
    'chartGenero',
    'doughnut',
    Object.keys(contagemGenero),
    Object.values(contagemGenero),
    'Adoções por Gênero',
    ['#4BC0C0', '#FF9F40']
  );

  // Adoções por Cor Principal
  const contagemCores = {};
  baseAdocao.forEach(a => {
    const cor = corMap[a.Cor1] || 'Desconhecida';
    contagemCores[cor] = (contagemCores[cor] || 0) + 1;
  });

  criarGrafico(
    'chartCor',
    'bar',
    Object.keys(contagemCores),
    Object.values(contagemCores),
    'Adoções por Cor Principal',
    ['#FF6384', '#36A2EB', '#FFCE56', '#8BC34A', '#9C27B0']
  );

  // Correlação Espécie × Gênero
  const correlacao = {};
  baseAdocao.forEach(a => {
    const especie = especieNome[a.Tipo] || 'Indefinido';
    const genero = generoNome[a.Genero] || 'Indefinido';
    const chave = `${especie} - ${genero}`;
    correlacao[chave] = (correlacao[chave] || 0) + 1;
  });

  criarGrafico(
    'chartCorrelacao',
    'bar',
    Object.keys(correlacao),
    Object.values(correlacao),
    'Correlação Espécie × Gênero',
    ['#4e73df', '#1cc88a', '#f6c23e', '#e74a3b']
  );
}

iniciarDashboard();

// index.js
// Escala o wrapper para manter as dimensões relativas (1440x1024) independentemente do tamanho da janela.
// Também popula eventos do mês atual e a previsão estática para regiões do estado de SP.

(function () {
    const FRAME_W = 1440, FRAME_H = 1024;
    const wrapper = document.getElementById('viewport-wrapper');
  
    function applyScale() {
      const availableW = window.innerWidth;
      const availableH = window.innerHeight;
      const scale = Math.min(availableW / FRAME_W, availableH / FRAME_H);
      wrapper.style.transform = `scale(${scale})`;
    }
  
    window.addEventListener('resize', applyScale);
    window.addEventListener('load', applyScale);
  
    /* ---------- Dados de eventos (exemplo, baseado nas suas imagens/tabela) ----------
       Cada evento tem: nome, meses (array or range), publicoEstimado, impactoEconomico, cidade/região
       Para o TCC você pode substituir por dados reais vinda de um CSV ou API.
    */
    const events = [
      { nome: "Festividades Aniversário de SP", meses: [1], publico: "N/A", impacto: "Diversos setores beneficiados, incluindo comércio e serviços" },
      { nome: "Carnaval e Desfiles Oficiais", meses: [2,3], publico: "Grandes multidões", impacto: "Aumento significativo no comércio, com destaque para hotéis e bares" },
      { nome: "Lollapalooza Brasil", meses: [3], publico: "Centenas de milhares", impacto: "Impacto alto em alimentação, hospedagem e comércio local" },
      { nome: "Virada Cultural", meses: [5], publico: "Milhares", impacto: "Comércio local aquecido, aumento nas vendas e turismo" },
      { nome: "Festival Interlagos (Motos/Autos)", meses: [5,8], publico: "Dados específicos", impacto: "Forte impacto regional, especialmente em turismo" },
      { nome: "Taste São Paulo", meses: [6], publico: "N/A", impacto: "Fomento no setor gastronômico" },
      { nome: "Parada LGBT", meses: [6], publico: "Milhares", impacto: "Aumento nas vendas locais, destaque para comércio de moda e acessórios" },
      { nome: "São Paulo Fashion Week", meses: [10], publico: "Milhares", impacto: "Impulso para moda e comércio local" },
      { nome: "Grande Prêmio São Paulo de Fórmula 1", meses: [11], publico: "Aproximadamente 300 mil turistas", impacto: "Grande aumento no setor hoteleiro, comércio e serviços" },
      { nome: "Corrida Internacional de São Silvestre", meses: [12], publico: "Milhares", impacto: "Impacto significativo em cadeia de consumo" },
      { nome: "Comic Con Experience (CCXP)", meses: [12], publico: "Mais de 280 mil visitantes", impacto: "Potente impacto no comércio e turismo" },
      { nome: "Réveillon na Paulista", meses: [12], publico: "Milhares", impacto: "Centro de alta circulação e consumo" }
    ];
  
    // Map month index (0-11) para nome em PT-BR
    const monthNames = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  
    /* Seleção e exibição de eventos do mês atual */
    const monthLabel = document.getElementById('events-month-label');
    const calendarBtn = document.getElementById('calendar-btn');
    const currentEventCard = document.getElementById('current-event-card');
  
    // determina mês atual
    const today = new Date();
    let currentMonth = today.getMonth(); // 0-11
    monthLabel.textContent = monthNames[currentMonth];
  
    // Encontra eventos que ocorrem no mês atual
    let currentMonthEvents = events.filter(ev => ev.meses.includes(currentMonth + 1)); // note events meses stored 1-12
    if (currentMonthEvents.length === 0) {
      // fallback: mostrar eventos cujo intervalo inclua o mês (caso algum tenha range)
      currentMonthEvents = [];
    }
  
    // índice do evento atual quando múltiplos
    let eventIndex = 0;
  
    function renderCurrentEvent() {
      if (!currentMonthEvents || currentMonthEvents.length === 0) {
        currentEventCard.innerHTML = `<div style="text-align:center;color:#343A40;font-weight:700;">Nenhum evento listado para ${monthNames[currentMonth]}</div>`;
        return;
      }
      const ev = currentMonthEvents[eventIndex % currentMonthEvents.length];
      currentEventCard.innerHTML = `
        <table class="event-table">
          <thead>
            <tr>
              <th>Evento</th>
              <th>Público Estimado</th>
              <th>Impacto Econômico</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${ev.nome}</td>
              <td>${ev.publico}</td>
              <td>${ev.impacto}</td>
            </tr>
          </tbody>
        </table>
        <div style="margin-top:8px;font-size:12px;color:#6c757d;">Mostrando ${eventIndex+1} de ${currentMonthEvents.length}. Aperte o ícone do calendário para ver o próximo evento.</div>
      `;
    }
  
    calendarBtn.addEventListener('click', () => {
      if (!currentMonthEvents || currentMonthEvents.length === 0) return;
      eventIndex = (eventIndex + 1) % currentMonthEvents.length;
      renderCurrentEvent();
    });
  
    renderCurrentEvent();
  
    /* ---------- Regiões do estado de SP e previsão (dados de exemplo) ---------- */
    const regions = [
      "Grande São Paulo",
      "Litoral Norte",
      "Litoral Sul",
      "Vale do Paraíba",
      "Campinas",
      "Ribeirão Preto",
      "Interior - Oeste"
    ];
  
    const regionList = document.getElementById('region-list');
    const regionLabel = document.getElementById('region-label');
    const weatherBody = document.getElementById('weather-body');
  
    // Popula dropdown de regiões
    regions.forEach(r => {
      const li = document.createElement('li');
      li.innerHTML = `<button class="dropdown-item" type="button">${r}</button>`;
      li.querySelector('button').addEventListener('click', (ev) => {
        regionLabel.textContent = r;
        renderForecastForRegion(r);
      });
      regionList.appendChild(li);
    });
  
    // Função para simular previsões semanais (no TCC substitua por fetch para INMET/CGE/Climatempo)
    function generateSampleForecast() {
      const week = [];
      for (let i = 0; i < 7; i++) {
        const temp = Math.round(18 + Math.random()*12); // 18-30
        const hum = Math.round(40 + Math.random()*50); // 40-90
        const rainProb = Math.round(Math.random()*100);
        const mm = rainProb > 50 ? Math.round(Math.random()*20) : 0;
        // escolha de ícone simples
        //let icon = "sol.png";
        //if (rainProb > 65) icon = "chuva.png";
        //else if (rainProb > 35) icon = "nublado.png";
        week.push({
          day: new Date(Date.now() + i*24*3600*1000),
          temp,
          hum,
          rainProb,
          mm
          //icon
        });
      }
      return week;
    }
  
    function renderForecastForRegion(region) {
      // placeholder: gera dados simulados
      const forecast = generateSampleForecast();
      // monta HTML
      const html = forecast.map(f => {
        const dayName = f.day.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
        return `
          <div class="forecast-day">
            <div style="flex:1">
              <div style="font-weight:700">${dayName}</div>
              <div>Temperatura: ${f.temp} °C</div>
              <div>Umidade do ar: ${f.hum}%</div>
              <div>Chance de chuva: ${f.rainProb}%</div>
              <div>Precipitação esperada: ${f.mm} mm</div>
            </div>
          </div>
        `;
      }).join('');
      weatherBody.innerHTML = `<div class="forecast-grid">${html}</div>`;
    }
  
    // Ao abrir a página, não selecionamos nenhuma região: mostramos mensagem central
    document.addEventListener('DOMContentLoaded', () => {
      weatherBody.innerHTML = `<div style="text-align:center;color:#343A40;font-weight:700;">Escolha uma região para ver a previsão da próxima semana</div>`;
    });
  
    /* ---------- Observações / pontos futuros ----------
       - Para dados reais: fazer fetch nos serviços listados (INMET, CGE-SP, Climatempo, etc.)
       - Substituir os eventos estáticos por uma fonte de dados (CSV/JSON) e associar por datas exatas.
       - Ajustes visuais finos (posicionamento pixel-perfect) se necessário.
    */
  })();
  
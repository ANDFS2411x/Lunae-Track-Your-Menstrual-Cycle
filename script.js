document.addEventListener('DOMContentLoaded', function() {
  // Configurar fecha máxima para input date (hoy)
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  document.getElementById('lastPeriod').setAttribute('max', formattedDate);
  
  // Autocompletar con fecha reciente si no hay fecha seleccionada
  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 28);
  const defaultDate = lastMonth.toISOString().split('T')[0];
  document.getElementById('lastPeriod').setAttribute('value', defaultDate);
  
  // Cargar datos del usuario
  loadUserData();
  
  // Si hay datos guardados, calcular automáticamente
  if (localStorage.getItem('seleneData')) {
    calcularFase();
  }
});

function calcularFase() {
  const lastPeriodInput = document.getElementById('lastPeriod').value;
  const cycleLength = parseInt(document.getElementById('cycleLength').value);
  const periodLength = parseInt(document.getElementById('periodLength').value);
  
  // Validación de entradas
  if (!lastPeriodInput || isNaN(cycleLength) || isNaN(periodLength)) {
    Swal ? Swal.fire({
      title: 'Oops!',
      text: 'Por favor completa todos los campos correctamente.',
      icon: 'warning',
      confirmButtonColor: '#ff4d88'
    }) : alert('Por favor completa todos los campos correctamente.');
    return;
  }
  
  // Mostrar loader
  const loader = document.getElementById('loader');
  const calcularBtn = document.getElementById('calcularBtn');
  loader.style.display = "block";
  calcularBtn.disabled = true;
  
  setTimeout(() => {
    const results = document.getElementById('results');
    results.style.display = "block";
    
    const lastPeriod = new Date(lastPeriodInput);
    const hoy = new Date();
    
    // Cálculo de días desde el último periodo
    const diffTime = hoy - lastPeriod;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Día actual en el ciclo (módulo para ciclos repetidos)
    const dayInCycle = (diffDays % cycleLength) + 1;
    
    // Definir fases
    const folicular = periodLength + 1;
    const ovulacionStart = cycleLength - 14;
    const ovulacionEnd = cycleLength - 12;
    const lutealStart = ovulacionEnd + 1;
    
    // Determinar la fase actual
    let fase = "";
    let colorClass = "";
    let faseInfo = "";
    let diasPara = 0;
    let mensajeExtra = "";
    let symptoms = [];
    let tips = [];
    
    // Próximo periodo
    const nextPeriodDate = new Date(lastPeriod);
    nextPeriodDate.setDate(lastPeriod.getDate() + cycleLength);
    
    // Si el ciclo ya pasó, calcular el próximo
    if (diffDays >= cycleLength) {
      const cyclesPassed = Math.floor(diffDays / cycleLength);
      nextPeriodDate.setDate(lastPeriod.getDate() + (cycleLength * (cyclesPassed + 1)));
    }
    
    // Próxima ovulación
    const nextOvulationDate = new Date(nextPeriodDate);
    nextOvulationDate.setDate(nextPeriodDate.getDate() - 14);
    
    // Fase Menstrual
    if (dayInCycle <= periodLength) {
      fase = "Fase Menstrual 🌸";
      colorClass = "menstrual-bg";
      faseInfo = "Durante esta fase, el revestimiento del útero se desprende causando el sangrado menstrual. Es normal sentir cambios en tu energía y estado de ánimo.";
      diasPara = ovulacionStart - dayInCycle;
      mensajeExtra = `Faltan ${diasPara} días para tu ovulación.`;
      
      symptoms = [
        "Cólicos o dolor abdominal",
        "Fatiga o cansancio",
        "Cambios de humor",
        "Sensibilidad en los senos",
        "Dolor de cabeza o migraña"
      ];
      
      tips = [
        "Descansa lo suficiente",
        "Mantente hidratada",
        "Aplica calor en el abdomen para aliviar los cólicos",
        "Considera una dieta rica en hierro",
        "Practica ejercicio suave como yoga o caminar"
      ];
    } 
    // Fase Folicular
    else if (dayInCycle < ovulacionStart) {
      fase = "Fase Folicular 🌱";
      colorClass = "folicular-bg";
      faseInfo = "En esta fase, tu cuerpo está preparando un óvulo para ser liberado. Los niveles de estrógeno aumentan, lo que puede darte más energía y mejor estado de ánimo.";
      diasPara = ovulacionStart - dayInCycle;
      mensajeExtra = `Tu ovulación comenzará en ${diasPara} días.`;
      
      symptoms = [
        "Aumento de energía",
        "Mejor estado de ánimo",
        "Piel más clara",
        "Mayor motivación",
        "Aumento gradual de la libido"
      ];
      
      tips = [
        "Aprovecha tu energía para hacer ejercicio",
        "Buen momento para proyectos creativos",
        "Socializa y conéctate con amigos",
        "Mantén una buena hidratación",
        "Prepárate para tu fase de ovulación"
      ];
    } 
    // Fase Ovulación
    else if (dayInCycle >= ovulacionStart && dayInCycle <= ovulacionEnd) {
      fase = "Ovulación 💕";
      colorClass = "ovulacion-bg";
      faseInfo = "¡Estás en tu periodo más fértil! Un óvulo ha sido liberado y puede ser fecundado. Puedes sentir un aumento de energía y libido.";
      diasPara = cycleLength - dayInCycle + 1;
      mensajeExtra = `Tu próxima menstruación podría comenzar en ${diasPara} días.`;
      
      symptoms = [
        "Aumento de la libido",
        "Energía y vitalidad",
        "Dolor abdominal leve (mittelschmerz)",
        "Cambios en el flujo vaginal (más claro y elástico)",
        "Mayor sensibilidad sensorial"
      ];
      
      tips = [
        "Si buscas embarazo, este es el momento óptimo",
        "Si no buscas embarazo, ten especial cuidado con la protección",
        "Mantén registro de tus síntomas para conocer mejor tu cuerpo",
        "Escucha a tu cuerpo y descansa si lo necesitas",
        "Mantén una buena hidratación"
      ];
    } 
    // Fase Lútea
    else {
      fase = "Fase Lútea 🌙";
      colorClass = "lutea-bg";
      faseInfo = "Después de la ovulación, tu cuerpo se prepara para un posible embarazo. Los niveles de progesterona aumentan, lo que puede causar cambios físicos y emocionales.";
      diasPara = cycleLength - dayInCycle + 1;
      mensajeExtra = `Tu próxima menstruación podría comenzar en ${diasPara} días.`;
      
      symptoms = [
        "Retención de líquidos",
        "Cambios de humor",
        "Cansancio o fatiga",
        "Sensibilidad en los senos",
        "Posibles antojos o cambios de apetito"
      ];
      
      tips = [
        "Prioriza el descanso y el autocuidado",
        "Evita el exceso de cafeína y alcohol",
        "Practica técnicas de relajación como meditación",
        "Alimentación equilibrada rica en magnesio",
        "Ejercicio moderado para aliviar síntomas"
      ];
    }
    
    // Actualizar el DOM con la información
    document.getElementById('phaseName').innerHTML = fase;
    document.getElementById('phaseInfo').textContent = faseInfo;
    document.getElementById('counter').textContent = mensajeExtra;
    document.getElementById('results').className = `results ${colorClass}`;
    
    // Mostrar fecha del último periodo y próximo periodo
    const fechaParts = lastPeriodInput.split('-');
    const dia = parseInt(fechaParts[2]);
    const mes = new Date(lastPeriodInput).toLocaleString('es-ES', { month: 'short' });
    document.getElementById('lastPeriodDate').textContent = `${dia} ${mes}`;
    document.getElementById('nextPeriodDate').textContent = formatDate(nextPeriodDate);
    
    // Actualizar la barra de progreso
    const progressPercent = (dayInCycle / cycleLength) * 100;
    document.getElementById('progressBar').style.width = `${progressPercent}%`;
    
    // Actualizar posiciones de los marcadores
    document.getElementById('menstrualMarker').style.left = '0%';
    document.getElementById('folicularMarker').style.left = `${(periodLength / cycleLength) * 100}%`;
    document.getElementById('ovulacionMarker').style.left = `${(ovulacionStart / cycleLength) * 100}%`;
    document.getElementById('luteaMarker').style.left = `${(lutealStart / cycleLength) * 100}%`;
    
    // Llenar la lista de síntomas
    const symptomsList = document.getElementById('symptomsList');
    symptomsList.innerHTML = '';
    symptoms.forEach(symptom => {
      const li = document.createElement('li');
      li.textContent = symptom;
      symptomsList.appendChild(li);
    });
    
    // Llenar la lista de consejos
    const tipsList = document.getElementById('tipsList');
    tipsList.innerHTML = '';
    tips.forEach(tip => {
      const li = document.createElement('li');
      li.textContent = tip;
      tipsList.appendChild(li);
    });
    
    // Actualizar y mostrar el calendario
    actualizarCalendario(lastPeriod, nextPeriodDate, nextOvulationDate, cycleLength, periodLength);
    document.getElementById('calendarPreview').style.display = 'block';
    
    // Ocultar loader y habilitar botón
    loader.style.display = "none";
    calcularBtn.disabled = false;
    
    // Desplazar a resultados
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
  }, 1200);
}

function actualizarCalendario(lastPeriod, nextPeriodDate, nextOvulationDate, cycleLength, periodLength) {
  const calendarHeader = document.getElementById('calendarHeader');
  const calendarGrid = document.getElementById('calendarGrid');
  
  // Limpiar calendario
  calendarHeader.innerHTML = '';
  calendarGrid.innerHTML = '';
  
  // Días de la semana
  const diasSemana = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
  
  // Añadir encabezados de días
  diasSemana.forEach(dia => {
    const dayHeader = document.createElement('div');
    dayHeader.textContent = dia;
    calendarHeader.appendChild(dayHeader);
  });
  
  // Obtener el primer día del mes actual
  const hoy = new Date();
  const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  
  // Calcular el día de la semana del primer día del mes (0 = Domingo, 6 = Sábado)
  const primerDiaSemana = primerDiaMes.getDay();
  
  // Obtener el número de días en el mes actual
  const ultimoDiaMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0).getDate();
  
  // Días del mes anterior para completar primera semana
  const diasMesAnterior = primerDiaSemana;
  
  // Crear celdas vacías para los días del mes anterior
  for (let i = 0; i < diasMesAnterior; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day';
    emptyDay.style.opacity = '0.3';
    calendarGrid.appendChild(emptyDay);
  }
  
  // Crear celdas para los días del mes actual
  for (let dia = 1; dia <= ultimoDiaMes; dia++) {
    const diaActual = new Date(hoy.getFullYear(), hoy.getMonth(), dia);
    const calendarDay = document.createElement('div');
    calendarDay.className = 'calendar-day';
    calendarDay.textContent = dia;
    
    // Marcar día actual
    if (dia === hoy.getDate()) {
      calendarDay.classList.add('today');
    }
    
    // Determinar la fase para cada día
    determinarFaseDia(calendarDay, diaActual, lastPeriod, nextPeriodDate, nextOvulationDate, cycleLength, periodLength);
    
    calendarGrid.appendChild(calendarDay);
  }
  
  // Completar celdas hasta 42 (6 semanas completas)
  const diasRestantes = 42 - (diasMesAnterior + ultimoDiaMes);
  for (let i = 0; i < diasRestantes; i++) {
    const emptyDay = document.createElement('div');
    emptyDay.className = 'calendar-day';
    emptyDay.style.opacity = '0.3';
    calendarGrid.appendChild(emptyDay);
  }
}

function determinarFaseDia(calendarDay, fecha, lastPeriod, nextPeriodDate, nextOvulationDate, cycleLength, periodLength) {
  // Calcular la fase para un día específico
  
  // Comprobar si es un día de menstruación del último período
  const ultimoPeriodoFin = new Date(lastPeriod);
  ultimoPeriodoFin.setDate(lastPeriod.getDate() + periodLength - 1);
  
  // Comprobar si es un día de menstruación del próximo período
  const proximoPeriodoFin = new Date(nextPeriodDate);
  proximoPeriodoFin.setDate(nextPeriodDate.getDate() + periodLength - 1);
  
  // Comprobar si es un día de ovulación
  const ovulacionFin = new Date(nextOvulationDate);
  ovulacionFin.setDate(nextOvulationDate.getDate() + 2);
  
  // Comprobar si es un día de menstruación
  if ((fecha >= lastPeriod && fecha <= ultimoPeriodoFin) || 
      (fecha >= nextPeriodDate && fecha <= proximoPeriodoFin)) {
    calendarDay.classList.add('menstrual');
  }
  // Comprobar si es un día de ovulación
  else if (fecha >= nextOvulationDate && fecha <= ovulacionFin) {
    calendarDay.classList.add('ovulacion');
  }
  // Comprobar si es un día de fase folicular
  else if (fecha > ultimoPeriodoFin && fecha < nextOvulationDate) {
    calendarDay.classList.add('folicular');
  }
  // Comprobar si es un día de fase lútea
  else if (fecha > ovulacionFin && fecha < nextPeriodDate) {
    calendarDay.classList.add('lutea');
  }
  
  // Marcar próxima menstruación esperada
  if (fecha >= nextPeriodDate && fecha <= proximoPeriodoFin) {
    calendarDay.classList.add('expected-period');
  }
  
  // Marcar próxima ovulación esperada
  if (fecha >= nextOvulationDate && fecha <= ovulacionFin) {
    calendarDay.classList.add('expected-ovulation');
  }
}

function formatDate(date) {
  const options = { day: 'numeric', month: 'short' };
  return date.toLocaleDateString('es-ES', options);
}

// Función para guardar los datos del usuario en localStorage
function saveUserData() {
  const lastPeriod = document.getElementById('lastPeriod').value;
  const cycleLength = document.getElementById('cycleLength').value;
  const periodLength = document.getElementById('periodLength').value;
  
  const userData = {
    lastPeriod,
    cycleLength,
    periodLength
  };
  
  localStorage.setItem('seleneData', JSON.stringify(userData));
}

// Función para cargar los datos del usuario desde localStorage
function loadUserData() {
  const userData = localStorage.getItem('seleneData');
  
  if (userData) {
    const parsedData = JSON.parse(userData);
    
    document.getElementById('lastPeriod').value = parsedData.lastPeriod;
    document.getElementById('cycleLength').value = parsedData.cycleLength;
    document.getElementById('periodLength').value = parsedData.periodLength;
  }
}

// Guardar datos cuando se calcula
document.getElementById('calcularBtn').addEventListener('click', saveUserData);

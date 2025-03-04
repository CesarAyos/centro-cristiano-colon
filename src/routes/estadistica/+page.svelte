<script>
    import { onMount } from "svelte";
    import { supabase } from "../../components/supabase.js";
    import { Chart, registerables } from "chart.js";
    import ChartDataLabels from "chartjs-plugin-datalabels"; // Importar el plugin
  import Bosquejo from "../../components/bosquejo.svelte";
  
    // Registrar los componentes necesarios de Chart.js y el plugin
    Chart.register(...registerables, ChartDataLabels);
  
    let data = [];
    let estadisticas = {
      Amigos: 0,
      Ninos: 0,
      Convertidos_adultos: 0,
      Convertidos_ninos: 0,
      Reconciliados: 0,
      Participacion_Mision_Amigo: 0,
      Participacion_Consolidacion: 0,
      Asistencia_de_Amigos: 0,
    };
  
    let gruposBiblicos = []; // Almacenar los grupos bíblicos únicos
    let selectedGroup = "Todos"; // Grupo seleccionado por defecto
  
    let chartInstance = null; // Variable para almacenar la instancia del gráfico
  
    // Función para calcular estadísticas
    function calculateStats(filteredData) {
      estadisticas = {
        Amigos: filteredData.reduce((sum, item) => sum + parseInt(item.Amigos || 0), 0),
        Ninos: filteredData.reduce((sum, item) => sum + parseInt(item.Ninos || 0), 0),
        Convertidos_adultos: filteredData.reduce((sum, item) => sum + parseInt(item.Convertidos_adultos || 0), 0),
        Convertidos_ninos: filteredData.reduce((sum, item) => sum + parseInt(item.Convertidos_ninos || 0), 0),
        Reconciliados: filteredData.reduce((sum, item) => sum + parseInt(item.Reconciliados || 0), 0),
        Participacion_Mision_Amigo: filteredData.reduce(
          (sum, item) => sum + parseInt(item.Participacion_Mision_Amigo || 0),
          0
        ),
        Participacion_Consolidacion: filteredData.reduce(
          (sum, item) => sum + parseInt(item.Participacion_Consolidacion || 0),
          0
        ),
        Asistencia_de_Amigos: filteredData.reduce((sum, item) => sum + parseInt(item.Asistencia_de_Amigos || 0), 0),
      };
      console.log("Estadísticas calculadas:", estadisticas);
    }
  
    // Función para renderizar el gráfico
    function renderChart() {
      const ctx = document.getElementById("chartCanvas");
      if (!ctx) {
        console.error("El elemento canvas no se encontró en el DOM");
        return;
      }
  
      if (!chartInstance) {
        // Crear una nueva instancia del gráfico solo si no existe
        chartInstance = new Chart(ctx.getContext("2d"), {
          type: "bar",
          data: {
            labels: Object.keys(estadisticas), // Etiquetas (nombres de categorías)
            datasets: [
              {
                label: "Estadísticas",
                data: Object.values(estadisticas), // Valores de cada categoría
                backgroundColor: [
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(201, 203, 207, 0.2)",
                  "rgba(54, 235, 180, 0.2)",
                  "rgba(235, 85, 85, 0.2)",
                  "rgba(85, 85, 235, 0.2)",
                ],
                borderColor: [
                  "rgba(75, 192, 192, 1)",
                  "rgba(54, 162, 235, 1)",
                  "rgba(255, 206, 86, 1)",
                  "rgba(153, 102, 255, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(201, 203, 207, 1)",
                  "rgba(54, 235, 180, 1)",
                  "rgba(235, 85, 85, 1)",
                  "rgba(85, 85, 235, 1)",
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              datalabels: {
                anchor: "end",
                align: "top",
                formatter: (value) => value,
                font: { weight: "bold", size: 10 },
                color: "#000",
              },
            },
            scales: {
              y: { beginAtZero: true },
            },
          },
        });
      } else {
        // Actualizar los datos del gráfico existente
        chartInstance.data.datasets[0].data = Object.values(estadisticas);
        chartInstance.update();
      }
    }
  
    // Función para filtrar datos por grupo bíblico
    function filterDataByGroup(data, group) {
      if (group === "Todos") return data;
      return data.filter((item) => item.grupobiblico === group);
    }
  
    // Función para manejar el cambio de grupo bíblico
    function onGroupChange(event) {
      selectedGroup = event.target.value;
      const filteredData = filterDataByGroup(data, selectedGroup);
      calculateStats(filteredData); // Recalcular estadísticas
      renderChart(); // Actualizar el gráfico
    }
  
    // Función para obtener datos desde Supabase
    async function fetchData() {
      try {
        const { data: responseData, error } = await supabase
          .from("planilla")
          .select("*")
          .order("id", { ascending: false });
  
        if (error) throw error;
  
        data = responseData;
  
        // Obtener los grupos bíblicos únicos
        gruposBiblicos = [...new Set(data.map((item) => item.grupobiblico))];
        console.log("Grupos bíblicos:", gruposBiblicos);
  
        calculateStats(data); // Calcular estadísticas iniciales
        renderChart(); // Renderizar el gráfico
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    // Llamar a fetchData cuando el componente se monta
    onMount(() => {
        fetchData();
  });
  </script>
      

      <div>
        <!-- Selector para filtrar por grupo bíblico -->
        <select id="groupSelector" on:change={onGroupChange}>
          <option value="Todos">Todos</option>
          {#each gruposBiblicos as group}
            <option value={group}>{group}</option>
          {/each}
        </select>
      
        <!-- Contenedor para el gráfico -->
        <div style="position: relative; height: 400px; width: 100%;">
          <canvas id="chartCanvas"></canvas>
        </div>
      </div>
           
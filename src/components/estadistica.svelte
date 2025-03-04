<script>
    import { onMount } from "svelte";
    import { supabase } from "../components/supabase.js";
    import { Chart, registerables } from "chart.js";
  
    // Registrar los componentes necesarios de Chart.js
    Chart.register(...registerables);
  
    let data = [];
    let totalAsistencia = 0;
    let totalFelipes = 0;
    let totalOfrendas = 0;
  
    // Función para calcular estadísticas
    function calculateStats(data) {
      totalAsistencia = data.reduce((sum, item) => sum + parseInt(item.asistentes || 0), 0);
      totalFelipes = data.reduce((sum, item) => sum + parseInt(item.Felipes || 0), 0);
      totalOfrendas = data.reduce((sum, item) => sum + parseInt(item.Ofrendas || 0), 0);
      console.log({ totalAsistencia, totalFelipes, totalOfrendas }); // Para depuración
    }
  
    // Función para renderizar el gráfico
    function renderChart() {
      const ctx = document.getElementById("chartCanvas");
      if (!ctx) {
        console.error("El elemento canvas no se encontró en el DOM");
        return;
      }
  
      new Chart(ctx.getContext("2d"), {
        type: "bar", // Tipo de gráfico
        data: {
          labels: ["Asistencia", "Felipes", "Ofrendas"],
          datasets: [
            {
              label: "Estadísticas",
              data: [totalAsistencia, totalFelipes, totalOfrendas],
              backgroundColor: [
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)"
              ],
              borderColor: [
                "rgba(75, 192, 192, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)"
              ],
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
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
  
        // Calcular estadísticas
        calculateStats(data);
  
        // Renderizar gráfico
        renderChart();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    // Llamar a fetchData cuando el componente se monta
    onMount(() => {
      fetchData();
    });
  </script>
  
  <div class="container">
    <h1 class="text-center my-4">Estadísticas</h1>
    <div class="chart-container">
      <canvas id="chartCanvas"></canvas>
    </div>
  </div>
  
  <style>
    .chart-container {
      margin: 30px auto;
      max-width: 700px;
    }
  </style>
  
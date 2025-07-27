<template>
  <div class="f16-card">
    <!-- Header with Toggle Button -->
    <div class="flex items-center justify-between cursor-pointer" @click="toggleChartCollapse">
      <div class="f16-legend">Route Chart</div>
      
      <!-- Toggle Button -->
      <div class="ml-4">
        <button class="p-2 hover:bg-f16-elevated rounded-full transition-colors">
          <svg class="w-5 h-5 text-f16-secondary-text transition-transform duration-200" 
               :class="{ 'rotate-180': !isChartCollapsed }" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Collapsible Chart Content -->
    <div v-if="!isChartCollapsed" class="mt-4">
      <!-- Summary Panel -->
      <div class="chart-summary grid grid-cols-4 gap-4 mb-6 p-4 bg-f16-elevated border border-f16-primary-border rounded-lg text-sm transition-colors duration-300">
        <div class="text-center">
          <div class="font-semibold text-f16-secondary-text">Total Distance</div>
          <div class="text-lg font-bold text-blue-600 dark:text-blue-400">{{ totalDistance }} NM</div>
        </div>
        <div class="text-center">
          <div class="font-semibold text-f16-secondary-text">Fuel Consumed</div>
          <div class="text-lg font-bold text-red-600 dark:text-red-400">{{ fuelConsumed.toFixed(1) }}k lbs</div>
        </div>
        <div class="text-center">
          <div class="font-semibold text-f16-secondary-text">Fuel Remaining</div>
          <div class="text-lg font-bold text-green-600 dark:text-green-400">{{ fuelRemaining.toFixed(1) }}k lbs</div>
        </div>
        <div class="text-center">
          <div class="font-semibold text-f16-secondary-text">Waypoints</div>
          <div class="text-lg font-bold text-purple-600 dark:text-purple-400">{{ missionData.route.length }}</div>
        </div>
      </div>
      
      <Line id="RouteChart" :options="chartOptions" :data="chartData" />
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);
const props = defineProps({
  missionData: {
    type: Object,
    required: true,
  },
  fuelAvailable: {
    type: Number,
    required: true,
  },
});

// Collapse state management
const isChartCollapsed = ref(true);

const toggleChartCollapse = () => {
  isChartCollapsed.value = !isChartCollapsed.value;
};

// Summary panel computed properties
const totalDistance = computed(() => {
  let total = 0;
  for (const wp of props.missionData.route) {
    total += wp.distance;
  }
  return Math.round(total);
});

const fuelConsumed = computed(() => {
  let consumed = 0;
  
  // Base mission fuel components (from FuelConst in data.js)
  consumed += 2000; // GroundOps
  consumed += 1000; // Base threat fuel
  
  // Additional threat fuel if high threat environment
  if (props.missionData.highThreat) {
    consumed += 1000; // Additional threat fuel
  }
  
  // Route fuel consumption (includes popup fuel for target waypoint if applicable)
  for (const wp of props.missionData.route) {
    consumed += wp.fuel;
  }
  
  return consumed / 1000; // Convert to thousands
});

const fuelRemaining = computed(() => {
  return (props.fuelAvailable + (props.missionData.TankerData?.tankerGive || 0) - fuelConsumed.value * 1000) / 1000;
});

const chartRoute = reactive({});
chartRoute.lables = computed(() => {
  let labels = [];
  let totalDistance = 0;
  for (const [index, wp] of props.missionData.route.entries()) {
    totalDistance += wp.distance;
  }
  totalDistance = Math.ceil(totalDistance / 50) * 50;
  for (let i = 0; i <= totalDistance; i += 50) {
    labels.push(i);
  }
  return labels;
});
chartRoute.Data = computed(() => {
  let route = [];
  route.push({
    totalDistance: 0,
    distance: 0,
    alt: 0,
    speed: 0,
    fuel: props.fuelAvailable,
    drag: props.missionData.route[0].drag,
  });
  var totalDistance = 0;
  var totalFuel = props.fuelAvailable;
  for (const [index, wp] of props.missionData.route.entries()) {
    let ChartWpStart = {
      distance: wp.distance,
      totalDistance: totalDistance,
      alt: wp.profile == "high" ? 25 : 0.5,
      speed: wp.profile == "low_420" ? 420 : 480,
      fuel: totalFuel,
      drag: wp.drag,
    };
    route.push(ChartWpStart);
    if (props.missionData.TankerData?.afterWp == index) {
      let fractionalRoute = props.missionData.TankerData.distanceIntoLeg / wp.distance;
      totalFuel -= wp.fuel * fractionalRoute;

      let chartWpRefuel = {
        distance: wp.distance + props.missionData.TankerData.distanceIntoLeg,
        totalDistance: totalDistance + props.missionData.TankerData.distanceIntoLeg,
        alt: wp.profile == "high" ? 25 : 0.5,
        speed: wp.profile == "low_420" ? 420 : 480,
        fuel: totalFuel,
        drag: wp.drag,
        refuel: props.missionData.TankerData.tankerGive,
      }
      route.push(chartWpRefuel)
      totalFuel -= props.missionData.TankerData.fuelUsage
      totalFuel += props.missionData.TankerData.tankerGive
      totalFuel -= wp.fuel * (1-fractionalRoute);

    } else {
      totalFuel -= wp.fuel;
    }
    totalDistance += wp.distance;

    let ChartWpEnd = {
      distance: 0,
      totalDistance: totalDistance,
      alt: wp.profile == "high" ? 25 : 0.5,
      speed: wp.profile == "low_420" ? 420 : 480,
      fuel: totalFuel,
      drag: wp.drag,
    };

    route.push(ChartWpEnd);
  }
  route.push({
    totalDistance: totalDistance,
    distance: 0,
    alt: 0,
    speed: 0,
    fuel: totalFuel,
    drag: 0,
  });
  return route;
});
chartRoute.targetLine = computed(() => {
  let tgtDistance = 0;
  for (const [index, wp] of props.missionData.route.entries()) {
    if (index <= props.missionData.TgtWp - 2) {
      tgtDistance += wp.distance;
    }
  }
  return [
    {
      totalDistance: tgtDistance,
      alt: -5,
    },
    {
      totalDistance: tgtDistance,
      alt: 35,
    },
  ];
});
chartRoute.refuelLine = computed(() => {
  if (!props.missionData.TankerData) {
    return []
  }
  return [
    {
      totalDistance: Math.round(props.missionData.TankerData.distanceFromHome),
      alt: -5,
    },
    {
      totalDistance: Math.round(props.missionData.TankerData.distanceFromHome),
      alt: 35,
    }
  ];
});

const chartData = computed(() => {
  return {
    labels: chartRoute.lables,
    datasets: [
      {
        label: "Flight Profile",
        // backgroundColor: "#f87979",
        data: chartRoute.Data,
        segment: {
          borderColor: (ctx) => {
            if (
              (ctx.p0.raw.speed == 0 && ctx.p0.raw.alt == 0) ||
              (ctx.p1.raw.speed == 0 && ctx.p1.raw.alt == 0)
            ) {
              return "#000000";
            }
            if (ctx.p0.raw.alt == 25 || ctx.p1.raw.alt == 25) {
              return "#22c55e";
            } else if (ctx.p0.raw.speed == 420) {
              return "#f59e0b";
            }
              return "#ef4444";
          },
          backgroundColor: (ctx) => {
            if (
              (ctx.p0.raw.speed == 0 && ctx.p0.raw.alt == 0) ||
              (ctx.p1.raw.speed == 0 && ctx.p1.raw.alt == 0)
            ) {
              return "#000000";
            }
            if (ctx.p0.raw.alt == 25 || ctx.p1.raw.alt == 25) {
              return "#22c55e";
            } else if (ctx.p0.raw.speed == 420) {
              return "#f59e0b";
            }
              return "#ef4444";
          }
        },
        pointRadius: 10,
        backgroundColor: (ctx) => {
          if (!ctx.raw) {
            return "#000000";
          }
          if (ctx.raw.alt == 0 && ctx.raw.speed == 0) {
            return "#000000";
          }
          if (ctx.raw.alt == 25) {
            return "#22c55e";
          }
          if (ctx.raw.speed == 420) {
            return "#f59e0b";
          }
          return "#ef4444";
        },
        pointStyle: (ctx) => {
          if (ctx.raw.alt == 0 || ctx.raw.speed == 0) {
            return 'rectRot';
          }
          if (ctx.raw.alt != chartRoute.Data[ctx.index+1].alt) {
            return 'triangle';
          }
          if (ctx.raw.speed != chartRoute.Data[ctx.index+1].speed) {
            return 'crossRot';
          }
          return 'cross';
        },
      },
      {
        label: "target",
        // backgroundColor: "#000000",
        data: chartRoute.targetLine,
        borderColor: "#000000",
        segment: {
          borderDash: (ctx) => {
            return props.missionData.type == "AA" ? [12, 12, 6, 12] : [10, 10];
          },
          borderWidth: (ctx) => {
            return props.missionData.type == "AA" ? 1 : 2;
          },
        },
      },
      {
        label: "Refuel",
        data: chartRoute.refuelLine,
        borderColor: "#DDA0DD",
        segment: {
          borderDash: [5, 5],
          borderWidth: 2,
        },
      },
    ],
  };
});
if (chartRoute.refuelLine.length > 0) {
  let refuelLine = {
    lable: "Refuel",
    data: chartRoute.refuelLine,
    borderColor: "#DDA0DD",
    segment: {
      borderDash: [10, 10],
      borderWidth: 1,
    },
  }
  chartData.value.datasets.push(refuelLine)
}
const chartOptions = computed(() => {
  return {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 30,
                 title: {
           display: true,
           text: "Altitude (thousands of feet)",
          color: "#374151",
          font: {
            size: 14,
          },
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
      },
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Distance (NM)",
          color: "#374151",
          font: {
            size: 14,
          },
        },
        ticks: {
          color: "#6b7280",
          font: {
            size: 12,
          },
        },
      },
    },
    parsing: {
      xAxisKey: "totalDistance",
      yAxisKey: "alt",
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          generateLabels: (chart) => [
            { 
              text: 'High Altitude (25k ft)', 
              fillStyle: '#22c55e', 
              strokeStyle: '#22c55e',
              lineWidth: 3
            },
            { 
              text: 'Low Speed (420 kts)', 
              fillStyle: '#f59e0b', 
              strokeStyle: '#f59e0b',
              lineWidth: 3
            },
            { 
              text: 'High Speed (480 kts)', 
              fillStyle: '#ef4444', 
              strokeStyle: '#ef4444',
              lineWidth: 3
            },
            { 
              text: 'Takeoff/Landing', 
              fillStyle: '#000000', 
              strokeStyle: '#000000',
              lineWidth: 3
            }
          ],
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: (ctx) => {
            return `Position: ${Math.round(ctx[0].raw.totalDistance)} NM`;
          },
          
          label: (ctx) => {
            if (ctx.datasetIndex === 1 || ctx.datasetIndex === 2) return null; // Skip target line
            if (chartData.value.datasets[ctx.datasetIndex].data[ctx.dataIndex].totalDistance == chartData.value.datasets[ctx.datasetIndex].data[ctx.dataIndex+1].totalDistance 
              && chartData.value.datasets[ctx.datasetIndex].data[ctx.dataIndex].alt == chartData.value.datasets[ctx.datasetIndex].data[ctx.dataIndex+1].alt) {
              return null;
            }
            if (ctx.raw.alt == 0) {
              return "📍 Takeoff/Landing";
            }
            
            const lines = [
              `🛩️ Altitude: ${ctx.raw.alt}k ft`,
              `⚡ Speed: ${ctx.raw.speed} kts TAS`,
              `⛽ Fuel: ${(ctx.raw.fuel/1000).toFixed(1)}k lbs`
            ];
            if (ctx.raw.refuel) {
              lines.push(`🛩️ Refuel: ${(ctx.raw.refuel/1000).toFixed(1)}k lbs`);
            }

            
            if (ctx.raw.drag > 0) {
              lines.push(`🎯 Drag Index: ${ctx.raw.drag}`);
            }
            
            return lines;
          },
          
          labelColor: (ctx) => {
            if (ctx.datasetIndex === 1) return { borderColor: 'transparent', backgroundColor: 'transparent' };
            
            let color = '#000000';
            if (ctx.raw.alt == 25) color = '#22c55e';
            else if (ctx.raw.speed == 420) color = '#f59e0b';
            else if (ctx.raw.speed == 480) color = '#ef4444';
            
            return {
              borderColor: color,
              backgroundColor: color
            };
          }
        }
      }
    },
  };
});
</script>
<style scoped></style>

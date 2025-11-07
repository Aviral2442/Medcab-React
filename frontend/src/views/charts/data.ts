import {getColor, getFont} from '@/helpers/chart'
import type {ChartJSOptionsType} from '@/types'

export const getBasicAreaChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        datasets: [
            {
                label: 'Income',
                data: [30, 18, 28, 35, 33, 40, 25, 29, 41],
                backgroundColor: getColor('chart-primary-rgb', 0.3),
                borderColor: getColor('chart-primary'),
                fill: true,
                tension: 0.3,
                pointRadius: 0,
                borderWidth: 2,
            },
        ],
    },
    options: {
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {display: false},
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            },
        },
    },
})

export const getDifferentDatasetChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7'],
        datasets: [
            {
                label: 'Current Month',
                data: [50, 42, 38, 35, 40, 50, 48, 47],
                fill: true,
                borderColor: getColor('chart-secondary'),
                backgroundColor: getColor('chart-secondary-rgb', 0.2),
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 1,
            },
            {
                label: 'Past Month',
                data: [60, 55, 50, 45, 50, 58, 55, 53],
                fill: true,
                borderColor: getColor('chart-gray'),
                backgroundColor: getColor('chart-gray-rgb', 0.2),
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 1,
            },
        ],
    },
    options: {
        interaction: {
            mode: 'index',
            intersect: false,
        },
    },
})

const randomSmoothData = (length: number, min = 30, max = 90) => {
    return Array.from({length}, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

export const getStackedAreaChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7'],
        datasets: [
            {
                label: 'D0',
                data: randomSmoothData(8, 40, 90),
                fill: true,
                borderColor: getColor('chart-gray'),
                backgroundColor: getColor('chart-gray-rgb', 0.3),
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 1,
            },
            {
                label: 'D1',
                data: randomSmoothData(8, 30, 70),
                fill: true,
                borderColor: getColor('chart-secondary'),
                backgroundColor: getColor('chart-secondary-rgb', 0.3),
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 1,
            },
            {
                label: 'D2',
                data: randomSmoothData(8, 20, 50),
                fill: true,
                borderColor: getColor('chart-primary'),
                backgroundColor: getColor('chart-primary-rgb', 0.3),
                borderWidth: 1,
            },
            {
                label: 'D3',
                data: randomSmoothData(8, 10, 30),
                fill: true,
                borderColor: getColor('chart-dark'),
                backgroundColor: getColor('chart-dark-rgb', 0.3),
                borderWidth: 1,
            },
        ],
    },
    options: {
        interaction: {
            mode: 'index',
            intersect: false,
        },
    },
})

export const getBoundedAreaChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Fully Rounded',
                data: [12.5, -19.4, 14.3, -15.0, 10.8, -10.5],
                borderColor: getColor('chart-primary'),
                fill: false,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
    },
})

export const getDrawTimeChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Fully Rounded',
                data: [10, 20, 15, 35, 38, 24],
                borderColor: getColor('chart-gray'),
                backgroundColor: getColor('chart-gray-rgb', 0.3),
                fill: true,
                borderWidth: 2,
            },
            {
                label: 'Small Radius',
                data: [24, 38, 35, 15, 20, 10],
                borderColor: getColor('chart-dark'),
                backgroundColor: getColor('chart-dark-rgb', 0.3),
                borderWidth: 2,
                tension: 0.2,
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
    },
})

export const getRadarChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'D0',
                data: [10, 20, 15, 35, 38, 24],
                borderColor: getColor('chart-primary'),
                fill: '-1',
                backgroundColor: getColor('chart-primary-rgb', 0.3),
                borderWidth: 2,
            },
            {
                label: 'D1',
                data: [12, 18, 18, 33, 41, 20],
                borderColor: getColor('chart-secondary'),
                fill: false,
                backgroundColor: getColor('chart-secondary-rgb', 0.3),
                borderWidth: 2,
            },
            {
                label: 'D2',
                data: [5, 25, 20, 25, 28, 14],
                borderColor: getColor('chart-dark'),
                fill: '-1',
                backgroundColor: getColor('chart-dark-rgb', 0.3),
                borderWidth: 2,
            },
            {
                label: 'D3',
                data: [12, 45, 15, 35, 38, 24],
                borderColor: getColor('chart-gray'),
                fill: '-1',
                backgroundColor: getColor('chart-gray-rgb', 0.3),
                borderWidth: 2,
            },
        ],
    },
    options: {
        plugins: {
            tooltip: {
                callbacks: {
                    label: function (ctx) {
                        return `${ctx.dataset.label} - ${ctx.label}: ${ctx.parsed}`
                    },
                },
            },
        },
        scales: {
            x: {display: false},
            y: {display: false},
            r: {
                angleLines: {
                    color: getColor('border-color'),
                },
                grid: {
                    color: getColor('border-color'),
                },
                pointLabels: {
                    color: getColor('secondary-color'),
                    font: {
                        family: getFont(),
                        size: 14,
                    },
                },
                ticks: {
                    font: {family: getFont()},
                    color: getColor('secondary-color'),
                    backdropColor: 'transparent',
                },
            },
        },
    },
})

export const getBasicBarChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [
            {
                data: [4, 4, 5, 6, 8, 5, 4, 6, 8, 5],
                backgroundColor: getColor('chart-primary'),
                borderRadius: 4,
                borderSkipped: false,
            },
        ],
    },
    options: {
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {display: false},
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            },
        },
    },
})

export const getBorderRadiusBarChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Fully Rounded',
                data: [12, -19, 14, -15, 12, -14],
                borderColor: getColor('chart-gray'),
                backgroundColor: getColor('chart-gray-rgb', 0.2),
                borderWidth: 2,
                borderRadius: Number.MAX_VALUE,
                borderSkipped: false,
            },
            {
                label: 'Small Radius',
                data: [-10, 19, -15, -8, 12, -7],
                borderColor: getColor('chart-primary'),
                backgroundColor: getColor('chart-primary-rgb', 0.2),
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false,
            },
        ],
    },
    options: {
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {display: false},
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            },
        },
    },
})

export const getFloatingBarChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Fully Rounded',
                data: [12, -19, 14, -15, 12, -14],
                backgroundColor: getColor('chart-primary'),
            },
            {
                label: 'Small Radius',
                data: [-10, 19, -15, -8, 12, -7],
                backgroundColor: getColor('chart-gray'),
            },
        ],
    },
    options: {
        interaction: {
            mode: 'index',
            intersect: false,
        },
    },
})

export const getHorizontalBarChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'March', 'April'],
        datasets: [
            {
                label: 'Fully Rounded',
                data: [12, -19, 14, -15],
                borderColor: getColor('chart-gray'),
                backgroundColor: getColor('chart-gray-rgb', 0.2),
                borderWidth: 1,
            },
            {
                label: 'Small Radius',
                data: [-10, 19, -15, -8],
                borderColor: getColor('chart-primary'),
                backgroundColor: getColor('chart-primary-rgb', 0.2),
                borderWidth: 1,
            },
        ],
    },
    options: {
        indexAxis: 'y',
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
    },
})

export const getStackedBarChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [12, -19, 14, -15, 8, 10],
                backgroundColor: getColor('chart-gray'),
            },
            {
                label: 'Dataset 2',
                data: [-10, 19, -15, -8, 12, 6],
                backgroundColor: getColor('chart-secondary'),
            },
            {
                label: 'Dataset 3',
                data: [-5, 14, -10, -12, 7, 4],
                backgroundColor: getColor('chart-primary'),
            },
            {
                label: 'Dataset 4',
                data: [8, -12, 10, -6, 15, -3],
                backgroundColor: getColor('chart-dark'),
            },
        ],
    },
    options: {
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        },
    },
})

export const getStackedGroupedBarChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'March', 'April'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [12, -19, 14, -15],
                backgroundColor: getColor('chart-dark'),
                stack: 'Stack 0',
            },
            {
                label: 'Dataset 2',
                data: [-10, 19, -15, -8],
                backgroundColor: getColor('chart-primary'),
                stack: 'Stack 0',
            },
            {
                label: 'Dataset 3',
                data: [-10, 19, -15, -8],
                backgroundColor: getColor('chart-gray'),
                stack: 'Stack 1',
            },
        ],
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
        },
    },
})

export const getVerticalBarChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [4, 4, 5, 6, 8, 5, 4, 6, 8, 5],
                backgroundColor: getColor('chart-dark'),
                borderRadius: 4,
                barThickness: 8,
            },
            {
                label: 'Dataset 2',
                data: [3, 5, 4, 7, 6, 5, 6, 7, 5, 4],
                backgroundColor: getColor('chart-primary'),
                borderRadius: 4,
                barThickness: 8,
            },
            {
                label: 'Dataset 3',
                data: [5, 3, 6, 4, 7, 6, 5, 4, 6, 7],
                backgroundColor: getColor('chart-secondary'),
                borderRadius: 4,
                barThickness: 8,
            },
        ],
    },
})

export const getBasicLineChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                label: 'Fully Rounded',
                data: [32, 42, 42, 62, 52, 75, 62],
                borderColor: getColor('chart-gray'),
                backgroundColor: getColor('chart-gray-rgb', 0.2),
                fill: true,
                borderWidth: 2,
            },
            {
                label: 'Small Radius',
                data: [42, 58, 66, 93, 82, 105, 92],
                fill: true,
                borderColor: getColor('chart-primary'),
                backgroundColor: getColor('chart-gray-rgb', 0.2),
                borderDash: [5, 5],
                tension: 0.4,
                borderWidth: 3,
            },
        ],
    },
    options: {
        interaction: {
            mode: 'index',
            intersect: false,
        },
        plugins: {
            legend: {display: false},
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
            },
        },
    },
})

export const getInterpolationLineChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
        datasets: [
            {
                label: 'Revenue Growth',
                data: [0, 10, 25, 40, 55, 70, NaN, 90, 80, 100, 85, 95, 110],
                borderColor: getColor('chart-primary'),
                backgroundColor: getColor('chart-primary-rgb', 0.2),
                fill: false,
                tension: 0.4,
            },
            {
                label: 'User Engagement',
                data: [5, 15, 30, 45, 50, 65, NaN, 75, 70, 95, 90, 85, 100],
                borderColor: getColor('chart-dark'),
                backgroundColor: getColor('chart-dark-rgb', 0.2),
                fill: false,
                tension: 0.4,
            },
            {
                label: 'Conversion Rate',
                data: [2, 8, 20, 30, 40, 55, NaN, 60, 55, 75, 70, 65, 80],
                borderColor: getColor('chart-gray'),
                backgroundColor: getColor('chart-gray-rgb', 0.2),
                fill: false,
                tension: 0.4,
            },
        ],
    },
    options: {
        interaction: {
            mode: 'index',
            intersect: false,
        },
    },
})

export const getMultiAxisLineChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Date One',
                data: [12, -19, 14, -15, 18, -14, -7],
                borderColor: getColor('chart-dark'),
                backgroundColor: getColor('chart-dark-rgb', 0.2),
                borderWidth: 1.5,
                yAxisID: 'y',
                tension: 0.4,
            },
            {
                label: 'Data Two',
                data: [-10, 19, -15, -8, -17, 12, 8],
                backgroundColor: getColor('chart-gray-rgb', 0.2),
                borderColor: getColor('chart-gray'),
                borderWidth: 1.5,
                yAxisID: 'y1',
                tension: 0.4,
            },
        ],
    },
    options: {
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            x: {
                ticks: {
                    font: {family: getFont()},
                    color: getColor('secondary-color'),
                    display: true,
                    drawTicks: true,
                },
                grid: {
                    display: false,
                    drawBorder: false,
                },
                border: {
                    display: false,
                },
            },
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                grid: {
                    display: true,
                    drawBorder: false,
                    color: getColor('chart-border-color'),
                    lineWidth: 1,
                },
                border: {
                    display: false,
                    dash: [5, 5],
                },
                ticks: {
                    font: {family: getFont()},
                    color: getColor('secondary-color'),
                },
            },
            y1: {
                type: 'linear',
                display: true,
                position: 'right',
                grid: {
                    drawOnChartArea: false,
                },
                ticks: {
                    font: {family: getFont()},
                    color: getColor('secondary-color'),
                },
            },
        },
    },
})

export const getPointStyleLineChart: () => ChartJSOptionsType = () => ({
    data: {
        datasets: [
            {
                label: 'Dataset 1',
                data: [12, -19, 14, -15, 14, -8],
                borderColor: getColor('chart-primary'),
                backgroundColor: getColor('chart-primary-rgb', 0.2),
                pointStyle: 'circle',
                pointRadius: 10,
                pointHoverRadius: 15,
            },
            {
                label: 'Dataset 2',
                data: [-10, 15, -12, 18, -8, 10],
                borderColor: getColor('chart-gray'),
                backgroundColor: getColor('chart-gray-rgb', 0.2),
                pointStyle: 'rectRounded',
                pointRadius: 8,
                pointHoverRadius: 12,
            },
            {
                label: 'Dataset 3',
                data: [5, -5, 10, -10, 7, -3],
                borderColor: getColor('chart-dark'),
                backgroundColor: getColor('chart-dark-rgb', 0.2),
                pointStyle: 'triangle',
                pointRadius: 9,
                pointHoverRadius: 13,
            },
        ],
    },
})

const skipped = (ctx: any, value: any) => (ctx.p0.skip || ctx.p1.skip ? value : undefined)
const down = (ctx: any, value: any) => (ctx.p0.parsed.y > ctx.p1.parsed.y ? value : undefined)

export const getLineSegmentsChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [65, 59, NaN, 48, 56, 57, 40],
                borderColor: getColor('chart-dark'),
                backgroundColor: getColor('chart-dark-rgb', 0.2),
                spanGaps: true,
                segment: {
                    borderColor: (ctx) => skipped(ctx, getColor('chart-dark-rgb', 0.2)) || down(ctx, getColor('danger')),
                    borderDash: (ctx) => skipped(ctx, [3, 6]),
                },
            },
        ],
    },
})

export const getSteppedLineChart: () => ChartJSOptionsType = () => ({
    data: {
        datasets: [
            {
                label: 'Dataset 1',
                data: [12, -19, 14, -15, 14, -8],
                borderColor: getColor('chart-primary'),
                backgroundColor: getColor('chart-primary-rgb', 0.2),
                fill: false,
                stepped: true,
            },
        ],
    },
})

export const getBubbleChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Data One',
                data: [
                    {x: 10, y: 20, r: 5},
                    {x: 20, y: 10, r: 5},
                    {x: 15, y: 15, r: 5},
                    {x: 25, y: 12, r: 6},
                    {x: 18, y: 25, r: 7},
                    {x: 30, y: 8, r: 4},
                    {x: 22, y: 18, r: 6},
                    {x: 35, y: 20, r: 5},
                    {x: 28, y: 30, r: 7},
                    {x: 12, y: 26, r: 6},
                    {x: 40, y: 10, r: 5},
                ],
                borderColor: getColor('chart-primary'),
                backgroundColor: getColor('chart-primary-rgb', 0.2),
                borderWidth: 2,
                borderSkipped: false,
            },
            {
                label: 'Data Two',
                data: [
                    {x: 12, y: 22},
                    {x: 22, y: 20},
                    {x: 5, y: 15},
                    {x: 16, y: 18},
                    {x: 9, y: 24},
                    {x: 28, y: 14},
                    {x: 19, y: 17},
                    {x: 33, y: 21},
                    {x: 14, y: 28},
                    {x: 8, y: 19},
                    {x: 36, y: 16},
                ],
                borderColor: getColor('chart-gray'),
                backgroundColor: getColor('chart-gray-rgb', 0.2),
                borderWidth: 2,
                borderSkipped: false,
            },
        ],
    },
})

const generateRandomData2 = (length: number, min = -20, max = 80) => {
    return Array.from({length}, () => Math.floor(Math.random() * (max - min + 1)) + min)
}

export const getComboBarLineChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
        datasets: [
            {
                type: 'line',
                label: 'Line Dataset',
                data: generateRandomData2(8, 20, 90),
                borderColor: getColor('chart-primary'),
                backgroundColor: getColor('chart-primary-rgb', 0.2),
                tension: 0.4,
                fill: false,
                yAxisID: 'y',
            },
            {
                type: 'bar',
                label: 'Bar Dataset',
                data: generateRandomData2(8, -20, 80),
                borderColor: getColor('chart-gray'),
                backgroundColor: getColor('chart-gray'),
                yAxisID: 'y',
                barThickness: 12,
            },
        ],
    },
})

export const getStackedBarLineChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                type: 'bar',
                label: 'Bar Dataset 1',
                data: [30, 20, 50, 40, 60, 70],
                borderColor: getColor('chart-dark'),
                backgroundColor: getColor('chart-dark'),
                stack: 'Stack 0',
                barThickness: 20,
            },
            {
                type: 'bar',
                label: 'Bar Dataset 2',
                data: [20, 15, 30, 25, 35, 40],
                borderColor: getColor('chart-primary'),
                backgroundColor: getColor('chart-primary'),
                stack: 'Stack 0',
                barThickness: 20,
            },
            {
                type: 'line',
                label: 'Line Dataset',
                data: [60, 55, 90, 75, 95, 110],
                borderColor: getColor('chart-gray'),
                backgroundColor: getColor('chart-gray-rgb', 0.2),
                tension: 0.4,
                fill: false,
                yAxisID: 'y',
            },
        ],
    },
})

export const getDoughnutChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Organic Search', 'Social Media', 'Referral', 'Email Campaign'],
        datasets: [
            {
                data: [420, 210, 150, 90],
                backgroundColor: [getColor('chart-primary'), getColor('chart-secondary'), getColor('chart-dark'), getColor('chart-gray')],
                borderColor: 'transparent',
                borderWidth: 3,
            },
        ],
    },
    options: {
        cutout: '65%',
        plugins: {
            legend: {display: false},
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (ctx) {
                        return `${ctx.label}: ${ctx.parsed}`
                    },
                },
            },
        },
        scales: {
            x: {display: false, grid: {display: false}, ticks: {display: false}},
            y: {display: false, grid: {display: false}, ticks: {display: false}},
        },
    },
})

export const getPieChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Organic Search', 'Social Media', 'Referral', 'Email Campaign'],
        datasets: [
            {
                data: [420, 210, 150, 90],
                backgroundColor: [getColor('chart-dark'), getColor('chart-primary'), getColor('chart-secondary'), getColor('chart-gray')],
                borderColor: 'transparent',
                borderWidth: 3,
            },
        ],
    },
    options: {
        plugins: {
            legend: {display: false},
            tooltip: {
                enabled: true,
                callbacks: {
                    label: function (ctx) {
                        return `${ctx.label}: ${ctx.parsed}`
                    },
                },
            },
        },
        scales: {
            x: {display: false, grid: {display: false}, ticks: {display: false}},
            y: {display: false, grid: {display: false}, ticks: {display: false}},
        },
    },
})

export const getMultiPieChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Organic Search', 'Social Media', 'Referral', 'Email Campaign'],
        datasets: [
            {
                label: '2024',
                data: [300, 150, 100, 80],
                backgroundColor: [getColor('chart-primary'), getColor('chart-secondary'), getColor('chart-dark'), getColor('chart-gray')],
                borderColor: 'transparent',
                borderWidth: 3,
            },
            {
                label: '2023',
                data: [250, 120, 90, 60],
                backgroundColor: [
                    getColor('chart-primary-rgb', 0.3),
                    getColor('chart-secondary-rgb', 0.3),
                    getColor('chart-dark-rgb', 0.3),
                    getColor('chart-gray-rgb', 0.3),
                ],
                borderColor: 'transparent',
                borderWidth: 3,
            },
        ],
    },
    options: {
        cutout: '30%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {family: getFont()},
                    color: getColor('secondary-color'),
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 15,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (ctx) {
                        return `${ctx.dataset.label} - ${ctx.label}: ${ctx.parsed}`
                    },
                },
            },
        },
        scales: {
            x: {display: false},
            y: {display: false},
        },
    },
})

export const getPolarAreaChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [12, 19, 14, 15, 20],
                backgroundColor: [
                    getColor('chart-primary'),
                    getColor('chart-secondary'),
                    getColor('chart-dark'),
                    getColor('chart-gray'),
                    getColor('chart-primary-rgb', 0.5),
                ],
                borderColor: [
                    getColor('chart-primary'),
                    getColor('chart-secondary'),
                    getColor('chart-dark'),
                    getColor('chart-gray'),
                    getColor('chart-primary-rgb', 0.1),
                ],
                borderWidth: 2,
            },
        ],
    },
    options: {
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    font: {family: getFont()},
                    color: getColor('secondary-color'),
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    boxHeight: 8,
                    padding: 15,
                },
            },
            tooltip: {
                callbacks: {
                    label: function (ctx) {
                        return `${ctx.dataset.label} - ${ctx.label}: ${ctx.parsed}`
                    },
                },
            },
        },
        scales: {
            x: {display: false},
            y: {display: false},
            r: {
                angleLines: {
                    color: getColor('border-color'),
                },
                grid: {
                    color: getColor('border-color'),
                },
                pointLabels: {
                    color: getColor('secondary-color'),
                },
                ticks: {
                    font: {family: getFont()},
                    color: getColor('secondary-color'),
                    backdropColor: 'transparent',
                },
            },
        },
    },
})

export const getScatterChart: () => ChartJSOptionsType = () => ({
    data: {
        labels: ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Dataset 1',
                data: [
                    {x: 10, y: 50},
                    {x: 50, y: 10},
                    {x: 15, y: 15},
                    {x: 20, y: 45},
                    {x: 25, y: 18},
                    {x: 34, y: 38},
                    {x: 42, y: 30},
                    {x: 28, y: 20},
                    {x: 55, y: 15},
                ],
                borderColor: getColor('chart-dark'),
                backgroundColor: getColor('chart-dark-rgb', 0.2),
                pointRadius: 8,
                pointHoverRadius: 10,
            },
            {
                label: 'Dataset 2',
                data: [
                    {x: 15, y: 45},
                    {x: 40, y: 20},
                    {x: 30, y: 5},
                    {x: 35, y: 25},
                    {x: 18, y: 25},
                    {x: 40, y: 8},
                    {x: 22, y: 32},
                    {x: 48, y: 16},
                    {x: 38, y: 22},
                ],
                borderColor: getColor('chart-gray'),
                backgroundColor: getColor('chart-gray-rgb', 0.2),
                pointRadius: 8,
                pointHoverRadius: 10,
            },
        ],
    },
})

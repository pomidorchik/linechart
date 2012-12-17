//					ВМЕСТО ДОКУМЕНТАЦИИ !!!
//	Пример графика с полным списком параметров и дефолтными значениями


window.onload = function() {

	var xValues = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
		yValues = [10, 50, 30, 80, 110, 90, 130, 60, 90, 100];
	
	
	
	var linechart = new lineChart('linechart', 0,0,1000,300, xValues, {
		
		padding: [0,0,0,0],																								// отступы от краев, как в HTML
		
		colors: null,																									// массив цветов, например ['#008000', '#808000', '#008080']
																														// Внимание!!! Используйте этот параметр, чтобы переопределить стандартные цвета библиотеки. Атрибуты элементов с цветом auto менять не рекомендуется.
		legend: {
			show: false,																								// Показывать легенду
			textAttr: {font: '12px "Trebuchet MS"', fill: '#4c4c4c', color: '#4c4c4c', 'text-anchor': 'start'},			// Параметры текста легенды
			x: 0,																										
			y: 0,
			anchor: 'middle'																							// Выравнивание легенды относително х. Возможные значения middle, start
		},
		
		yAxis: {																										// Настройки оси Y
			showLabels: true,																							// Показывать метки на оси
			showGridLines: true,																						// Показывать горизонтальные линии сетки
			gridLinesAttr: {stroke: "#c0c0c0", 'stroke-width': 1, fill: 'none'},										// Атрибуты линии сетки
			gridStep: 1,																								// Шаг линий сетки
			gridShift: 0,																								// Смещение линий сетки
			labelsStep: 1,																								// Шаг меток оси
			labelsShift: 0,																								// Смещение меток оси
			labelsTickSize: 3,																							// Размер засечек меток на оси
			isInteger: false,																							// Только целые числа на оси OY
			pLabelsNN: 5,																								// Предпочитаемое кол-во горизонтальных линий сетки
			labelsMR: 5,																								// Отступ меток справа от оси в пикселах
			labelsAttr: {font: '12px "Trebuchet MS"', fill: '#4c4c4c', color: '#4c4c4c', 'text-anchor': 'start'},		// Атрибуты меток
			labelFormatter: function(value){																			// Функция дополнительного действия над метками перед выводом 
				return value;
			}
		},
		
		xAxis: {																										// Настройки оси X
			showLabels: true,																							// Показывать метки на оси
			showGridLines: true,																						// Показывать вертикальные линии сетки
			gridLinesAttr: {stroke: "#c0c0c0", 'stroke-width': 1, fill: 'none'},										// Атрибуты линии сетки
			gridStep: 1,																								// Шаг линий сетки
			gridShift: 0,																								// Смещение линий сетки
			labelsStep: 1,																								// Шаг меток оси
			labelsShift: 0,																								// Смещение меток оси
			labelsMT: 4,																								// Отступ меток сверху от оси в пикселах
			vAlign: 'bottom',																							// Выравнивание меток по верикали. Возможные значения bottom, top
			labelsTickSize: 3,																							// Размер засечек меток на оси
			labelsAttr: {font: '12px "Trebuchet MS"', fill: '#4c4c4c', color: '#4c4c4c', 'text-anchor': 'middle'},		// Атрибуты меток
			labelsAngle: -45,																							// Поворот меток в градусах
			labelFormatter: function(value, n){																			// Функция дополнительного действия над метками перед выводом
				return value;																							 
			}
		},
		
		graph: [{																										// Графики
			name: '',																									// Название. Отображается в легенде
			yValues: yValues,																							// Значения y
			showDots: true,																								// Показывать точки на линии
			showLine: true,																								// Показывать линию
			showArea: true,																								// Подсвечивать область под линией
			smooth: false,																								// Плавный график
			lineAttr: {stroke: 'auto', "stroke-width": 3, "stroke-linejoin": "round"},									// Атрибуты линии графика
			dotAttr: {fill: "#fff", stroke: 'auto', "stroke-width": 2},													// Атрибуты точек графика
			dotRadius: 4,																								// Радиус точек графика
			areaAttr: {stroke: 'none', opacity: .3, fill: 'auto'},														// Атрибуты подсвечиваемой области под графиком
			tooltip: {																									// Настройки всплывающих подсказок
				show: true,																								// Показывать подсказки
				activator: 'area',																						// Когда показывать: area - при прохождение указателя мыши вдоль соответствующей области; dot - при прохождение указателя мыши рядом с соответствующей точкой
				dotActivatorRadius: 25,																					// Размер области активации подсказки для случая dot
				tooltipAttr: {fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": .7},						// Атрибуты контейнера с подсказкой
				labels: function(r, xValue, yValue, n){																	// Элементы отображающиеся на подсказке
					return r.text(10, 10, yValue).attr({font: '13px "Trebuchet MS"', fill: 'white', color: 'white', 'text-anchor': 'middle'});
				}
			}
		}]
	});
	linechart.draw();
};
window.onload = function() {

	var xValues = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
		yValues = [42156, 51294, 51339, 53914, 48052, 48788, 43593, 50052, 56412, 57919, 45251, 42054];
	
	var linechart1 = new lineChart('linechart1', 0,0,640,300, xValues, {
		padding: [40,0,0,0],
		graph: {
			yValues: yValues,
			tooltip: {
				labels: function(r, xValue, yValue, n){
					return [
						r.image('images/user.png', 0, 12, 24, 24),
						r.text(37, 13, (yValue+'').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')).attr({font: '16px "Trebuchet MS"', fill: 'yellow', color: 'yellow', 'text-anchor': 'start'}),
						r.text(37, 38, xValue+' 2012').attr({font: 'italic 11px "Trebuchet MS"', fill: '#e9e9e9', color: '#e9e9e9', 'text-anchor': 'start'}),
						r.path("M" + (28+.5) + " " + (5+.5) + "L" + (28+.5) + " " + (46+.5)).attr({fill: '#000', stroke:'#000', opacity: 0.2})
					]
				}
			}
		},
		yAxis: {
			labelFormatter: function(value, n){
				return Math.round(value/1000)+'k';
			}
		}
	});
	linechart1.addText(320, 20, 'Статистика посещений за 2012 год', {font: '18px "Lucida Grande", Calibri, Helvetica, Arial, sans-serif', color: '#222222', fill: '#222222'});
	linechart1.draw();
	
	
	
	
	xValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'],
	yValues1 = [-1, 2, 4, 10, 8, 10, 5, 3, 7, 0, 0, 3, 5, 3, 5, 5, 5, 2, -1, 3, 3, 4, 3, -2, -4, -1, 1, -1, -4, -2];
	yValues2 = [32, 19, 17, 22, 26, 26, 23, 25, 20, 19, 20, 25, 20, 19, 25, 17, 20, 24, 18, 20, 25, 19, 20, 26, 29, 24, 22, 21, 28, 30];
	
	var linechart2 = new lineChart('linechart2', 0,0,640,400, xValues, {
		padding: [40,0,30,0],
		legend: {
			show: true,
			x: 320,
			y: 390,
			anchor: 'middle'
		},
		graph: [{
			name: 'Москва',
			yValues: yValues1,
			showDots: false,
			showLine: true,
			showArea: false,
			smooth: true,
			tooltip: {
				activator: 'dot',
				labels: function(r, xValue, yValue, n){
					return [
						r.text(0, 0, yValue>0 ? '+'+yValue+' °C' : yValue+' °C').attr({font: '16px "Trebuchet MS"', fill: 'yellow', color: 'yellow', 'text-anchor': 'middle'}),
						r.text(0, 24, 'Москва, '+xValue+' ноября 2012').attr({font: 'italic 11px "Trebuchet MS"', fill: '#e9e9e9', color: '#e9e9e9', 'text-anchor': 'middle'})
					];
				}
			}
		}, {
			name: 'Сидней',
			yValues: yValues2,
			showDots: false,
			showLine: true,
			showArea: false,
			smooth: true,
			tooltip: {
				activator: 'dot',
				labels: function(r, xValue, yValue, n){
					return [
						r.text(0, 0, yValue>0 ? '+'+yValue+' °C' : yValue+' °C').attr({font: '16px "Trebuchet MS"', fill: 'yellow', color: 'yellow', 'text-anchor': 'middle'}),
						r.text(0, 24, 'Сидней, '+xValue+' ноября 2012').attr({font: 'italic 11px "Trebuchet MS"', fill: '#e9e9e9', color: '#e9e9e9', 'text-anchor': 'middle'})
					]
				}
			}
		}],
		xAxis: {
			labelFormatter: function(value, n){
				return value+'.11';
			}
		},
		yAxis: {
			pLabelsNN: 10,
			labelsStep: 2,
			labelsShift: 1,
			labelFormatter: function(value){
				return value +' °C';
			}
		}
	});
	linechart2.addText(320, 20, 'Температура воздуха в ноябре 2012 года', {font: '18px "Lucida Grande", Calibri, Helvetica, Arial, sans-serif', color: '#222222', fill: '#222222'});
	linechart2.draw();

};
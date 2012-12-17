function lineChart(target_id, x, y, width, height, xValues, opts) {	
	
	this.opts = json_merge_recursive(opts, {
		padding: [0,0,0,0],
		legend: {
			show: false,
			textAttr: {font: '12px "Trebuchet MS"', fill: '#4c4c4c', color: '#4c4c4c', 'text-anchor': 'start'},
			x: 0,
			y: 0,
			anchor: 'middle'
		},
		yAxis: {
			showLabels: true,
			showGridLines: true,
			gridLinesAttr: {stroke: "#c0c0c0", 'stroke-width': 1, fill: 'none'},
			gridStep: 1,
			gridShift: 0,
			labelsStep: 1,
			labelsShift: 0,
			labelsTickSize: 3,
			isInteger: false,
			pLabelsNN: 5,
			labelsMR: 5,
			labelsAttr: {font: '12px "Trebuchet MS"', fill: '#4c4c4c', color: '#4c4c4c', 'text-anchor': 'start'},
			labelFormatter: function(value){
				return value;
			}
		},
		xAxis: {
			showLabels: true,
			showGridLines: true,
			gridLinesAttr: {stroke: "#c0c0c0", 'stroke-width': 1, fill: 'none'},
			gridStep: 1,
			gridShift: 0,
			labelsStep: 1,
			labelsShift: 0,
			labelsMT: 4,
			vAlign: 'bottom',
			labelsTickSize: 3,		
			labelsAttr: {font: '12px "Trebuchet MS"', fill: '#4c4c4c', color: '#4c4c4c', 'text-anchor': 'middle'},
			labelsAngle: -45,
			labelFormatter: function(value, n){
				return value;
			}
		}
	});
	this.r = Raphael(target_id, width+x, height+y);
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.xValues = xValues;
	if((typeof this.opts.graph == "object") && !(this.opts.graph instanceof Array))	this.opts.graph = [this.opts.graph];
	this.graphDefault = {
		name: '',
		yValues: [],
		showDots: true,
		showLine: true,
		showArea: true,
		smooth: false,
		lineAttr: {stroke: 'auto', "stroke-width": 3, "stroke-linejoin": "round"},
		dotAttr: {fill: "#fff", stroke: 'auto', "stroke-width": 2},
		dotRadius: 4,
		areaAttr: {stroke: 'none', opacity: .3, fill: 'auto'},
		tooltip: {
			show: true,
			activator: 'area',
			dotActivatorRadius: 25,
			tooltipAttr: {fill: "#000", stroke: "#666", "stroke-width": 2, "fill-opacity": .7},
			labels: function(r, xValue, yValue, n){
				return r.text(10, 10, yValue).attr({font: '13px "Trebuchet MS"', fill: 'white', color: 'white', 'text-anchor': 'middle'});
			}
		}
	}
	this.dots = [];
	this.bgp = this.r.set();
	this.path = this.r.set();
	this.blanket = [];
	this.tooltip = [];
	this.legend = this.r.set();
	
	//default colors
	if(!this.opts.colors) {
		this.opts.colors = [];
		var hues = [.6, .2, .05, .1333, .75, 0];
		for (var cn = 0; cn < 10; cn++) {
			if (cn < hues.length) {
				this.opts.colors.push('hsb(' + hues[cn] + ',.75, .75)');
			} else {
				this.opts.colors.push('hsb(' + hues[cn - hues.length] + ', 1, .5)');
			}
		}
	}
	
	//firefox fix
	if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1) this.opts.yAxis.labelsMR -= 5;
	
	//draw line
	this.drawLine = function(x1, y1, x2, y2) {   
		return this.r.path("M" + (x1+.5) + " " + (y1+.5) + "L" + (x2+.5) + " " + (y2+.5));
	}
	
	//get anchors for smooth graph
	this.getAnchors = function (p1x, p1y, p2x, p2y, p3x, p3y) {
        var l1 = (p2x - p1x) / 2,
            l2 = (p3x - p2x) / 2,
            a = Math.atan((p2x - p1x) / Math.abs(p2y - p1y)),
            b = Math.atan((p3x - p2x) / Math.abs(p2y - p3y));
        a = p1y < p2y ? Math.PI - a : a;
        b = p3y < p2y ? Math.PI - b : b;
        var alpha = Math.PI / 2 - ((a + b) % (Math.PI * 2)) / 2,
            dx1 = l1 * Math.sin(alpha + a),
            dy1 = l1 * Math.cos(alpha + a),
            dx2 = l2 * Math.sin(alpha + b),
            dy2 = l2 * Math.cos(alpha + b);
        return {
            x1: p2x - dx1,
            y1: p2y + dy1,
            x2: p2x + dx2,
            y2: p2y + dy2
        };
    }
	
	//Calculate OY labels
	this.calculateYLabels = function (min, max, n, ceil) {
		if(min===max) min = 0;
		var d = max-min;
		var k = 0;	
		while (Math.abs(d) < 10) {
			d*=10;
			k++;
		}
		var l=(Math.ceil(d)+'').length-2-k;
		if(this.opts.yAxis.isInteger && l<0) l = 0;
		var s = [[1*Math.pow(10,l)], [2*Math.pow(10,l)], [5*Math.pow(10,l)], [10*Math.pow(10,l)], [20*Math.pow(10,l)], [50*Math.pow(10,l)]];
		for(i = 0, ii = s.length; i < ii; i++){
			s[i].push((Math.ceil(max/s[i])*s[i] - Math.floor(min/s[i])*s[i]) / s[i] + 1);
		}
		if(ceil !== true) s.reverse();
		s.sort(function(a,b){
			if(Math.abs(a[1]-n)<Math.abs(b[1]-n) || ((a[1]-n)===(b[1]-n) && a[0]<b[0])) return -1
			else if(Math.abs(a[1]-n) > Math.abs(b[1]-n) || ((a[1]-n)===(b[1]-n) && a[0]>b[0])) return 1
			else return 0;
		});
		var labels = [];
		for(i = 0; i < s[0][1]; i++) {
			labels.push((Math.floor(min/s[0][0]) * s[0][0]) + i*s[0][0]);
			labels[i] = Math.round(labels[i]/Math.pow(10,l))*Math.pow(10,l);
		}
		return labels;
	}
	
	//При каждом вызове возвращает новый цвет
	this.getColor = function () {
		this.getColor.n = this.getColor.n || 0;
		return this.opts.colors[this.getColor.n++%this.opts.colors.length];
	}
	this.getColorReset = function(){
		this.getColor.n = 0;
	}
	
	
	//Показывает легенду
	this.showLegend = function () {
		this.getColorReset();
		for(i=0, ii=this.opts.graph.length; i<ii; i++){
			var lColor = this.getColor(i);
			var d = i>0 ? this.legend.getBBox().width+20 : 0;
			this.legend.push(this.r.rect(d+0, 0, 30, 2).attr({stroke: lColor, fill: lColor}));
			this.legend.push(this.r.text(d+35,0, this.opts.graph[i].name).attr(this.opts.legend.textAttr));
		}
		if(this.opts.legend.anchor === 'start') this.legend.transform('t'+this.opts.legend.x+','+this.opts.legend.y);
		else if (this.opts.legend.anchor === 'middle') this.legend.transform('t'+(this.opts.legend.x-this.legend.getBBox().width/2)+','+this.opts.legend.y);
	}
	
	
	//draw single graph
	this.drawGraph = function (pa, xValues, yMin, yMax, opts) {
		
		var aColor = this.getColor();
		if(opts.dotAttr.stroke==='auto') opts.dotAttr.stroke = aColor;
		if(opts.lineAttr.stroke==='auto') opts.lineAttr.stroke = aColor;
		if(opts.areaAttr.fill==='auto') opts.areaAttr.fill = aColor;
		if(opts.tooltip.tooltipAttr.stroke==='auto') opts.tooltip.tooltipAttr.stroke = aColor;
	
		var X = (pa.x2-pa.x1) / (xValues.length-1),
			Y = (pa.y2-pa.y1) / (yMax-yMin);
				
		this.dots.push(this.r.set());
		var	dots = this.dots[this.dots.length-1],
			p, bgpp;
		this.tooltip.push([]);
		var tooltip = this.tooltip[this.tooltip.length-1];
		this.blanket.push(this.r.set());
		var	blanket = this.blanket[this.blanket.length-1];
		
		for (var i = 0, ii = this.xValues.length; i < ii; i++) {
			var x = Math.round(X * i) + pa.x1, 
				y = pa.y2 - Math.round(Y*(opts.yValues[i]-yMin));
			dots.push(this.r.circle(x, y, opts.dotRadius).attr(opts.dotAttr));
			if(opts.smooth===true){
				if (!i) {
					p = ["M", x, y, "C", x, y];
					bgpp = ["M", pa.x1, pa.y2, "L", x, y, "C", x, y];
				}
				if (i && i < ii - 1) {
					var Y0 = pa.y2 - Math.round(Y*(opts.yValues[i-1]-opts.yValues[0])),
						X0 = Math.round(X * (i-1)) + pa.x1,
						Y2 = pa.y2 - Math.round(Y*(opts.yValues[i+1]-opts.yValues[0])),
						X2 = Math.round(X * (i + 1)) + pa.x1;	
					var a = this.getAnchors(X0, Y0, x, y, X2, Y2);
					p = p.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
					bgpp = bgpp.concat([a.x1, a.y1, x, y, a.x2, a.y2]);
					p.concat([x,y]);
				}
			}
			else {
				if (!i) {
					p = ["M", x, y, "L", x, y];
					bgpp = ["M", pa.x1, pa.y2, "L", x, y];
				}
				if (i && i < ii - 1) {
					p = p.concat([x,y]);
					bgpp = bgpp.concat([x,y]);
				}
			}
			
			//tooltips
			if(opts.tooltip.activator==='area'){
				blanket.push(this.r.rect(i===0?pa.x1:pa.x1 + X*(i-.5), pa.y1, i===0||i===(ii-1)? X*.5 : X, pa.y2-pa.y1).attr({stroke: "none", fill: "#fff", opacity: 0}));
			}
			else if(opts.tooltip.activator==='dot'){
				blanket.push(this.r.circle(x, y, opts.tooltip.dotActivatorRadius).attr({fill: "#fff", stroke: 'none', opacity: 0}));
			}
			var ttActivatorObj = blanket[blanket.length - 1];
			if(opts.tooltip.show === true){	
				(function (x, y, i, r, b) {
					ttActivatorObj.hover(function () {
						if(!tooltip[i]){
							tooltip[i] = [r.set(), r.set()];
							var ttl = opts.tooltip.labels(r, xValues[i], opts.yValues[i], i);
							if(!((typeof ttl == "object") && (ttl instanceof Array))) ttl = [ttl];
							ttl.reverse();
							for(var j=0, jj=ttl.length; j<jj; j++){
								tooltip[i][0].push(ttl[j].hide().insertBefore(b[0]));
							}
							tooltip[i][1] = r.popup(x, y, tooltip[i][0], 'right').attr(opts.tooltip.tooltipAttr).hide().insertBefore(tooltip[i][0]);
							if(x+tooltip[i][1].getBBox().width > pa.x2) {
								tooltip[i][1].remove();
								tooltip[i][1] = r.popup(x, y, tooltip[i][0], 'left').attr(opts.tooltip.tooltipAttr).hide().insertBefore(tooltip[i][0]);
							}
						}
						tooltip[i][0].show();
						tooltip[i][1].show();
						dots[i].attr("r", opts.dotRadius+2);
					}, function () {
						tooltip[i][0].hide();
						tooltip[i][1].hide();
						dots[i].attr("r", opts.dotRadius);
					});
				
				})(x, y, i, this.r, this.blanket);
			}
		
		
		}
		p = p.concat([x, y, x, y]);
		bgpp = bgpp.concat([x, y, x, y, "L", x, pa.y2, "z"]);
		this.path.push(this.r.path().attr(opts.lineAttr).attr({path: p}));
		this.bgp.push(this.r.path().attr(opts.areaAttr).attr({path: bgpp}));
		if(opts.showLine!==true) this.path[this.path.length-1].hide();
		if(opts.showArea!==true) this.bgp[this.bgp.length-1].hide();
		if(opts.showDots!==true) dots.hide();
	}
	
	
	//draw chart
	this.draw = function() {
	
		//legend
		if(this.opts.legend.show === true) this.showLegend();
		
		var yvc = [];
		for (var i=0, ii=this.opts.graph.length; i<ii; i++) {
			yvc = yvc.concat(this.opts.graph[i].yValues);
		}
		var	max = Math.max.apply(Math, yvc),
			min = Math.min.apply(Math, yvc);
		var yLabels = this.r.set(),
			xLabels = this.r.set(),
			yLabelsCalc = this.calculateYLabels(min, max, this.opts.yAxis.pLabelsNN || this.opts.d.yAxis.pLabelsNN),
			lms = [0, 0];
			
		//add labels
		for (var i = 0, ii = yLabelsCalc.length; i < ii; i++) {
			yLabels.push(this.r.text(0, 0, this.opts.yAxis.labelFormatter(yLabelsCalc[i], i)).attr(this.opts.yAxis.labelsAttr).hide());
			if((yLabels[i].getBBox().width+this.opts.yAxis.labelsMR) > lms[0]) lms[0] = yLabels[i].getBBox().width+this.opts.yAxis.labelsMR;
		}
		for (var i = 0, ii = this.xValues.length; i < ii; i++) {
			xLabels.push(this.r.text(0, 0, this.opts.xAxis.labelFormatter(this.xValues[i], i)).attr(this.opts.xAxis.labelsAttr).rotate(this.opts.xAxis.labelsAngle).hide());
			if((xLabels[i].getBBox().height+this.opts.xAxis.labelsMT) > lms[1]) lms[1] = xLabels[i].getBBox().height+this.opts.xAxis.labelsMT;
		}

		//plot area
		var pa = {
			x1: Math.round(this.x+(this.opts.yAxis.showLabels===true?lms[0]:0) +this.opts.padding[3]),
			y1: Math.round(this.y+yLabels[yLabels.length-1].getBBox().height/2+this.opts.padding[0]),
			x2: Math.round(this.x+this.width-(xLabels[xLabels.length-1].getBBox().width)/2-this.opts.padding[1]),
			y2: Math.round(this.y + this.height - (this.opts.xAxis.showLabels===true?lms[1]:0) - this.opts.padding[2])
		};
		var X = (pa.x2-pa.x1) / (xValues.length-1),
			Y = (pa.y2-pa.y1) / (yLabelsCalc[yLabelsCalc.length-1]-yLabelsCalc[0]);
		
		//draw grid and set labels
		for (var i = 0, ii = yLabelsCalc.length; i < ii; i++) {		//horizontal lines
			if((i-this.opts.yAxis.gridShift)>=0 && !((i-this.opts.yAxis.gridShift)%this.opts.yAxis.gridStep) && this.opts.yAxis.showGridLines===true) this.drawLine(pa.x1, pa.y2-Math.round((yLabelsCalc[i]-yLabelsCalc[0])*Y), this.x+this.width-this.opts.padding[1], pa.y2-Math.round((yLabelsCalc[i]-yLabelsCalc[0])*Y)).attr(this.opts.yAxis.gridLinesAttr).toBack();
			if((i-this.opts.yAxis.labelsShift)>=0 && !((i-this.opts.yAxis.labelsShift)%this.opts.yAxis.labelsStep) && this.opts.yAxis.showLabels===true) {
				yLabels[i].attr({x:this.x+this.opts.padding[3], y:pa.y2-Math.round((yLabelsCalc[i]-yLabelsCalc[0])*Y)}).show();
				this.drawLine(pa.x1-this.opts.yAxis.labelsTickSize, pa.y2-Math.round((yLabelsCalc[i]-yLabelsCalc[0])*Y), pa.x1, pa.y2-Math.round((yLabelsCalc[i]-yLabelsCalc[0])*Y)).attr(this.opts.yAxis.gridLinesAttr).toBack();
			}
			
		}
		for (var i = 0, ii = this.xValues.length; i < ii; i++) {	//vertical lines
			if((i-this.opts.xAxis.gridShift)>=0 && !((i-this.opts.xAxis.gridShift)%this.opts.xAxis.gridStep) && this.opts.xAxis.showGridLines===true) this.drawLine(pa.x1+Math.round(i*X), this.y+this.opts.padding[0], pa.x1+Math.round(i*X), pa.y2).attr(this.opts.xAxis.gridLinesAttr).toBack()
			if((i-this.opts.xAxis.labelsShift)>=0 && !((i-this.opts.xAxis.labelsShift)%this.opts.xAxis.labelsStep) && this.opts.xAxis.showLabels===true) {
				var xly = Math.round(pa.y2+lms[1]-xLabels[i].getBBox().height/2);
				if(this.opts.xAxis.vAlign == 'top') xly = Math.round(pa.y2+this.opts.xAxis.labelsMT+xLabels[i].getBBox().height/2);
				xLabels[i].rotate(-this.opts.xAxis.labelsAngle).attr({x:pa.x1+Math.round(i*X), y: xly}).rotate(this.opts.xAxis.labelsAngle).show()
				this.drawLine(pa.x1+Math.round(i*X), pa.y2, pa.x1+Math.round(i*X), pa.y2+this.opts.xAxis.labelsTickSize).attr(this.opts.xAxis.gridLinesAttr).toBack()
			}
		}
		
		//draw graphs
		this.getColorReset();
		for(var i=0, ii=this.opts.graph.length; i<ii; i++){
			var graphOpts = clone(json_merge_recursive(this.opts.graph[i], this.graphDefault));
			this.drawGraph(pa, this.xValues, yLabelsCalc[0], yLabelsCalc[yLabelsCalc.length-1], graphOpts);
		}
		
		this.bgp.toFront();
		this.path.toFront();
		for(var i=0, ii=this.dots.length; i<ii; i++){
			this.dots[i].toFront();
		}
		for(var i=0, ii=this.blanket.length; i<ii; i++){
			this.blanket[i].toFront();
		}	
	}
	
	
	//add text
	this.addText = function(x, y, text, attr) {
		this.r.text(x, y, text).attr(attr);
	};
	
	
	
	//	http://savvateev.org/blog/56/
	function json_merge_recursive(json1, json2){
		var out = {};
		for(var k1 in json1){
			if (json1.hasOwnProperty(k1)) out[k1] = json1[k1];
		}
		for(var k2 in json2){
			if (json2.hasOwnProperty(k2)) {
				if(!out.hasOwnProperty(k2)) out[k2] = json2[k2];
				else if(
					(typeof out[k2] === 'object') && (out[k2].constructor === Object) && 
					(typeof json2[k2] === 'object') && (json2[k2].constructor === Object)
				) out[k2] = json_merge_recursive(out[k2], json2[k2]);
			}
		}
		return out;
	}
	
	//	http://www.askdev.ru/javascript/53/%D0%9A%D0%B0%D0%BA-%D0%B2-JavaScript-%D0%BA%D0%BB%D0%BE%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C-%D0%BE%D0%B1%D1%8A%D0%B5%D0%BA%D1%82
	function clone(obj){
		if(obj == null || typeof(obj) != 'object')
			return obj;
		var temp = new obj.constructor(); 
		for(var key in obj)
			temp[key] = clone(obj[key]);
		return temp;
	}
	
}	
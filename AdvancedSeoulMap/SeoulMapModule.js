/*
*	Required plugin 
*   1. jQuery  
*   2. topoJson
*   3. D3
*/
//topojson
document.write('<script src="http://d3js.org/topojson.v1.min.js"></script>');
var seoulMap = (function(namespace,$,undefined){
	var defaults = {};
	
	defaults.option = {
		width : 800,
		height : 800,
		target : 'body',
		mouseover : function(){},
		mouseout : function(){},
		mouseclick : function(){},
	};


	defaults.functions = {
		featureOver : function(){

		},
		featureOut : function(){

		},
		featureClick : function(){

		},
	};

	var opt = null;

	namespace = function(option){
		opt = $.extend(defaults.option,option);
	};

	namespace.prototype.drawMap = function(){
		var svg = d3.select(opt.target).append('svg')
					.attr('width',opt.width)
					.attr('height',opt.height);

		var map 	= svg.append('g').attr('id','map'),
			places 	= svg.append('g').attr('id','places');


		var projection = d3.geo.mercator()      		//메르카터 투영법
    		.center([126.9895, 37.5651])	      		//센터 좌표
    		.scale(100000)					            //scale 
    		.translate([opt.width/2, opt.height/2]);    //좌표이동.
 
		var path = d3.geo.path().projection(projection); //path 만들고path 엘리먼트 사용하기 위함(다격형 그리기)
 
		//각 feautre 생성
  		var features = topojson.feature(opt.topoJson, opt.topoJson.objects.seoul_municipalities_geo).features; 

 		map.selectAll("path")	//path 그리는듯.
      		.data(features) 	//features 갯수 만큼 
    		.enter().append("path")	//path 만들고
      		.attr("class", function(d) { 
      		 	return "municipality c" + d.properties.code 
      		})
      		.attr("d", path)
      		.attr('id',function(d){return d.properties.code;})
      		.attr('title',function(d){return d.properties.name}); //툴팁 텍스트.
      	

 
 		//지역별 텍스트 달아주기
  		map.selectAll("text")
      		.data(features)
    		.enter().append("text")
      		.attr("transform", function(d) {
      	 		return "translate(" + path.centroid(d) + ")"; 
      		})
      		.attr("dy", ".35em")
      		.attr("class", "municipality-label")
     		.text(function(d) {
     	 		return d.properties.name; 
     		});
  

   		//마우스 오버 이벤트
    	$(opt.target).find('path').on('mouseover',     		
     		 function(event){
    			$(this).css('stroke','#f00').css('stroke-width',2);
     	 		svg.selectAll("path").sort(function (a, b) { // select the parent and sort the path's
      				if (a.properties.code == $(event.target).attr('id')){      			
      					return 1;  
      				}else{
            			return -1;
          			}              // a is not the hovered element, send "a" to the 
      			});
      			opt.mouseover($(event.target).attr('id'));
      		}
      	);

      	//마우스 아웃시
      	$(opt.target).find('path').on('mouseout',      			
     		function(event){
    			$(this).css('stroke','#fff');
    			opt.mouseout($(event.target).attr('id'));
    		}
    	);

      	//마우스 클릭시
    	$(opt.target).find('path').click(function(event){
    		opt.mouseclick($(event.target).attr('id'));
    	});

    }; //end drawMap
	
	return namespace;

})(window.seoulMap || {} , $);
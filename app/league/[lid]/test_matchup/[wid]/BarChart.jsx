"use client"

import * as d3 from "d3";
import { useRef, useEffect } from "react";

export default function BarChart(data) {
    const svgRef = useRef();
    const data1 = [10, 30, 20, 50, 40];
  
    useEffect(() => {
        const svg = d3.select(svgRef.current)
          .append('svg')
          .attr('width', 500)
          .attr('height', 300);

        svg.selectAll('rect')
          .data(data1)
          .enter()
          .append('rect')
          .attr('x', (d, i) => i * 60)
          .attr('y', (d) => 300 - d * 5)
          .attr('width', 50)
          .attr('height', (d) => d * 5)
          .attr('fill', 'red')
    }, []);
    
    //   var names =['tomaszy', 'trexx', 'paTiTek'];
    //   console.log(names)
    //   var height = 300;
    //   var width = 500;
    //   var ypadding = 70;
    //   var xpadding = 100;
    //   var yScale = d3.scaleBand().domain(names).range([ypadding, height - ypadding]);
    //   var xScale = d3.scaleLinear().domain([0, 100]).range([width - xpadding, xpadding])
  
    //   svg.selectAll('rect')
    //     .data(data)
    //     .enter()
    //     .append('rect')
    //     .attr('x', 0)
    //     .attr('y', function(d){
    //         return yScale.bandwidth() - 1;
    //     })
    //     .attr('width', function(d){
    //         return xScale(d.fpts);
    //     })
    //     .attr('height', 25)
    //     .attr('fill', 'red');
    // }, []);
  
    return (
      <div>
        <h2>Bar Chart</h2>
        <div ref={svgRef}></div>
      </div>
    )
  }
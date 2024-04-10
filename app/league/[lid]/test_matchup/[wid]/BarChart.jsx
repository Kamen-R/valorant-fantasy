"use client"

import * as d3 from "d3";
import { useRef, useEffect } from "react";

export default function BarChart(data) {
    const svgRef = useRef();
  
    useEffect(() => {
      const svg = d3.select(svgRef.current)
        .append('svg')
        .attr('width', 500)
        .attr('height', 300);
        
      var height = 300;
      var ypadding = 70;
      var yScale = d3.scaleLinear()
      .domain([0, 120])
      .range([height - ypadding, ypadding])
  
      svg.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr("x", 100)
        .attr("y", function(d) {
          return yScale(d.fpts);
        })
        .attr('width', 50)
        .attr('height', function(d) {
          return height - ypadding - yScale(d.fpts);
        })
        .attr('fill', 'red');
    }, []);
  
    return (
      <div>
        <h2>Bar Chart</h2>
        <div ref={svgRef}></div>
      </div>
    )
  
  }
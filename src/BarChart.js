import { useEffect, useRef } from "react";
import * as d3 from 'd3';
import './BarChart.css';
import { gdp } from './gdp';

export default function BarChart() {
  const d3Chart = useRef();

  /**
   * 
   * @param {string} dateString 
   */
  function toDecimal(dateString) {
    switch (dateString) {
      case '-01-01':
        return 0;
      case '-04-01':
        return 0.25;
      case '-07-01':
        return 0.5;
      case '-10-01':
        return 0.75;
      default:
        throw new Error('wrong date "' + dateString + '"');
    }
  }

  useEffect(() => {
    const width = 600;
    const height = 400;
    const padding = 50;

    const tooltip = d3
      .select('.visHolder')
      .append('div')
      .attr('id', 'tooltip')
      .style('opacity', 0);

    const overlay = d3
      .select('.visHolder')
      .append('div')
      .attr('class', 'overlay')
      .style('opacity', 0);

    // var svgContainer = d3
    //   .select('.visHolder')
    //   .append('svg')
    //   .attr('width', width + 100)
    //   .attr('height', height + 60);

    const svg = d3.select(d3Chart.current)
      .attr('width', width)
      .attr('height', height);

    const xScale = d3.scaleLinear()
      .domain([1947, 2016])
      .range([padding, width - padding])

    const yScale = d3.scaleLinear()
      .domain([18000, 0])
      .range([padding, height - padding])

    const barWidth = xScale(0.25) - xScale(0);
    console.log('barWidth', barWidth);

    for (const [yearMonth, gdpValue] of gdp.data) {
      const year = parseInt(yearMonth.substring(0, 4));
      const decimal = toDecimal(yearMonth.substring(4));
      const xDomain = year + decimal;
      const x = xScale(xDomain);
      const y = yScale(gdpValue)
      const barHeight = 350 - yScale(gdpValue)
      //console.log(barHeight);

      svg.append('rect')
        .attr('class', 'bar')
        .attr('x', x)
        .attr('y', y)
        .attr('height', barHeight)
        .attr('width', barWidth)
        .attr('fill', 'lightblue')
        .attr('data-date', yearMonth)
        .attr('data-gdp', gdpValue)
        .on('mouseover', function (event, d) {
          // d or datum is the height of the
          // current rect
          var i = this.getAttribute('index');

          overlay
            .transition()
            .duration(0)
            .style('height', d + 'px')
            .style('width', barWidth + 'px')
            .style('opacity', 0.9)
            .style('left', x + 0 + 'px')
            .style('top', height - d + 'px')
            .style('transform', 'translateX(60px)');
          tooltip.transition().duration(200).style('opacity', 0.9);
          tooltip
            .html(
              yearMonth +
              '<br>' +
              '$' +
              gdpValue +
              ' Billion'
            )
            .attr('data-date', yearMonth)
            .style('left', x + 'px')
            .style('top', height - 100 + 'px')
            .style('transform', 'translateX(60px)');
        })
        .on('mouseout', function () {
          tooltip.transition().duration(200).style('opacity', 0);
          overlay.transition().duration(200).style('opacity', 0);
        });
    }

    const xAxis = d3.axisBottom().scale(xScale);
    svg
      .append('g')
      .attr('id', 'x-axis')
      .attr('transform', `translate(0, ${height - padding})`)
      .call(xAxis);

    const yAxis = d3.axisLeft().scale(yScale);
    svg
      .append('g')
      .attr('id', 'y-axis')
      .attr('transform', `translate(${padding}, 0)`)
      .call(yAxis);

  }, []);


  return (
    <>
      <div id='d3demo'>
        <h1>United States GDP</h1>
        <div className="visHolder">
          <svg ref={d3Chart}></svg>
        </div>

      </div>
    </>

  )
}

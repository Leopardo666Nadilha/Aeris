'use client';

import { useEffect, useRef, useState } from 'react';
import { useMemo } from 'react';
import { donutGraphColors } from '../lib/theme.js'; // 1. Importa a paleta de cores
import { useCurrency } from '@/contexts/CurrencyContext'; // Importe o hook de moeda
import * as d3 from 'd3';
import styles from './DonutGraph.module.css';

export default function DonutGraph({ data }) {
  const ref = useRef();
  const { formatCurrency } = useCurrency(); // Use o hook de moeda
  const [selectedSlice, setSelectedSlice] = useState(null);

  // Calcula o total de gastos uma única vez ou quando os dados mudam
  const totalGastos = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);


  // Efeito para desenhar o gráfico
  useEffect(() => {
    const svg = d3.select(ref.current);
    svg.selectAll('*').remove();

    const width = 280;
    const height = 280;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    const g = svg.append('g').attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Se não houver dados ou o total for 0, desenha o placeholder
    if (totalGastos === 0) { // Simplificado para verificar apenas o totalGastos
      // Desenha um único arco para simular o donut vazio
      const emptyPie = d3.pie().value(1)([{}]); // Cria uma fatia de 360 graus
      const emptyArc = d3.arc().innerRadius(radius * 0.65).outerRadius(radius);

      g.selectAll('path')
        .data(emptyPie)
        .enter()
        .append('path')
        .attr('d', emptyArc)
        .attr('fill', 'var(--color-donut-no-data)'); // Usa a cor neutra definida no globals.css
      return; // Encerra a função para não desenhar o gráfico de donut
    }

    // Esquema de cores consistente
    const color = d3.scaleOrdinal(donutGraphColors);

    const pie = d3.pie().value((d) => d.value);
    const data_ready = pie(data.filter(d => d.value > 0)); // Filtra valores > 0 para o gráfico

    // Arco padrão
    const arc = d3.arc().innerRadius(radius * 0.65).outerRadius(radius);

    // Arco para a fatia selecionada (efeito de "explodir")
    const arcSelected = d3.arc().innerRadius(radius * 0.65).outerRadius(radius * 1.08);

    g.selectAll('path')
      .data(data_ready)
      .enter()
      .append('path')
      .attr('d', (d) => (selectedSlice && selectedSlice.category_name === d.data.category_name ? arcSelected(d) : arc(d)))
      .attr('fill', (d) => color(d.data.category_name))
      .attr('class', styles.donutSlice)
      .on('click', (event, d) => {
        // Alterna a seleção da fatia
        if (selectedSlice && selectedSlice.category_name === d.data.category_name) {
          setSelectedSlice(null);
        } else {
          setSelectedSlice(d.data);
        }
      });

  }, [data, selectedSlice]);

  // Efeito para lidar com o estado de "sem dados" e resetar a seleção
  useEffect(() => {
    // Se não houver dados ou o total for 0, reseta a fatia selecionada
    if (!data || data.length === 0 || totalGastos === 0) {
      setSelectedSlice(null);
    }
  }, [data, totalGastos]);

  return (
    <div className={styles.graphContainer}>
      <svg ref={ref} width={280} height={280}></svg>
      {/* Área de informação em linha única */}
      <div className={styles.infoBox}>
        {totalGastos === 0 ? (
          // Se o total de gastos é 0, mostra a mensagem padrão
          <p className={styles.infoText}>Total de gastos: {formatCurrency(0)}</p>
        ) : (
          selectedSlice ? (
            // Se uma fatia está selecionada e há gastos
            <p className={styles.infoText}>
              Gastos com <strong>{selectedSlice.category_name}</strong>: {formatCurrency(selectedSlice.value)}
            </p>
          ) : (
            // Caso contrário (há gastos, mas nenhuma fatia selecionada), mostra o total
            <p className={styles.infoText}>
              Total de gastos: {formatCurrency(totalGastos)}
            </p>
          )
        )}
      </div>
    </div>
  );
}
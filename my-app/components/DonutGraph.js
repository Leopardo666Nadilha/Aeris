'use client';

import { useMemo, useState } from 'react';
import { arc as d3Arc, pie as d3Pie } from 'd3';
import { donutGraphColors } from '../lib/theme.js';
import { useCurrency } from '@/contexts/CurrencyContext';
import styles from './DonutGraph.module.css';

const SIZE = 220;
const RADIUS = SIZE / 2;
const INNER = RADIUS * 0.72;

/**
 * Gráfico de rosca dos gastos por categoria, com legenda interativa.
 * `data`: [{ category_name, value }] já agregado e ordenado.
 */
export default function DonutGraph({ data }) {
  const { formatCurrency } = useCurrency();
  const [selected, setSelected] = useState(null);

  const total = useMemo(() => data.reduce((sum, d) => sum + d.value, 0), [data]);

  const slices = useMemo(() => {
    const pie = d3Pie()
      .value((d) => d.value)
      .sort(null)
      .padAngle(data.length > 1 ? 0.025 : 0);
    const arc = d3Arc().innerRadius(INNER).outerRadius(RADIUS - 6).cornerRadius(4);
    const arcActive = d3Arc().innerRadius(INNER - 2).outerRadius(RADIUS).cornerRadius(4);
    return pie(data).map((d, i) => ({
      ...d.data,
      color: donutGraphColors[i % donutGraphColors.length],
      path: arc(d),
      activePath: arcActive(d),
    }));
  }, [data]);

  // A seleção é descartada se a categoria deixar de existir nos dados
  const active = slices.find((s) => s.category_name === selected) ?? null;
  const toggle = (name) => setSelected((prev) => (prev === name ? null : name));

  const emptyPath = d3Arc().innerRadius(INNER).outerRadius(RADIUS - 6)({ startAngle: 0, endAngle: Math.PI * 2 });

  return (
    <div className={styles.wrapper}>
      <div className={styles.chart}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label="Gastos por categoria">
          <g transform={`translate(${RADIUS}, ${RADIUS})`}>
            {total === 0 ? (
              <path d={emptyPath} fill="var(--color-donut-no-data)" />
            ) : (
              slices.map((s) => (
                <path
                  key={s.category_name}
                  d={active?.category_name === s.category_name ? s.activePath : s.path}
                  fill={s.color}
                  className={`${styles.slice} ${active && active.category_name !== s.category_name ? styles.dimmed : ''}`}
                  onClick={() => toggle(s.category_name)}
                >
                  <title>{`${s.category_name}: ${formatCurrency(s.value)}`}</title>
                </path>
              ))
            )}
          </g>
        </svg>
        <div className={styles.center}>
          <span className={styles.centerLabel}>{active ? active.category_name : 'Total'}</span>
          <span className={styles.centerValue}>{formatCurrency(active ? active.value : total)}</span>
          {active && total > 0 && (
            <span className={styles.centerPercent}>{Math.round((active.value / total) * 100)}% dos gastos</span>
          )}
        </div>
      </div>

      {total === 0 ? (
        <p className={styles.empty}>Nenhum gasto neste período. Use o botão + para registrar o primeiro.</p>
      ) : (
        <ul className={styles.legend}>
          {slices.map((s) => (
            <li key={s.category_name}>
              <button
                type="button"
                className={`${styles.legendItem} ${active?.category_name === s.category_name ? styles.legendActive : ''}`}
                onClick={() => toggle(s.category_name)}
                aria-pressed={active?.category_name === s.category_name}
              >
                <span className={styles.dot} style={{ background: s.color }} aria-hidden="true" />
                <span className={styles.legendName}>{s.category_name}</span>
                <span className={styles.legendPercent}>{Math.round((s.value / total) * 100)}%</span>
                <span className={styles.legendValue}>{formatCurrency(s.value)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

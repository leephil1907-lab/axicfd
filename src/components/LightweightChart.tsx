import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries, AreaSeries } from 'lightweight-charts';

interface LightweightChartProps {
  data: Array<{
    time: number | string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
  }>;
  chartType: 'candle' | 'line';
  symbol: string;
}

export default function LightweightChart({ data, chartType, symbol }: LightweightChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartContainerRef.current || !data || data.length === 0) return;

    const container = chartContainerRef.current;
    const chart = createChart(container, {
      layout: {
        background: { type: ColorType.Solid, color: '#121318' },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: container.clientWidth || 800,
      height: container.clientHeight || 450,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Format & sort time series
    let lastTime = 0;
    const formattedData = data
      .map((d) => {
        let t: number;
        if (typeof d.time === 'number') {
          t = d.time > 2000000000 ? Math.floor(d.time / 1000) : d.time;
        } else {
          t = Math.floor(new Date(d.time).getTime() / 1000);
        }
        return {
          time: t,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close,
          value: d.close,
        };
      })
      .sort((a, b) => a.time - b.time)
      .filter((item) => {
        if (item.time <= lastTime) return false;
        lastTime = item.time;
        return true;
      });

    if (formattedData.length > 0) {
      if (chartType === 'candle') {
        const series = chart.addSeries(CandlestickSeries, {
          upColor: '#10B981',
          downColor: '#EF4444',
          borderVisible: false,
          wickUpColor: '#10B981',
          wickDownColor: '#EF4444',
        });
        series.setData(formattedData as any);
      } else {
        const series = chart.addSeries(AreaSeries, {
          topColor: 'rgba(255, 200, 0, 0.4)',
          bottomColor: 'rgba(255, 200, 0, 0.0)',
          lineColor: '#FFC800',
          lineWidth: 2,
        });
        series.setData(formattedData as any);
      }
    }

    const handleResize = () => {
      if (container) {
        chart.applyOptions({
          width: container.clientWidth,
          height: container.clientHeight,
        });
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [data, chartType, symbol]);

  return (
    <div className="w-full h-full relative select-none">
      <div ref={chartContainerRef} className="w-full h-full min-h-[420px]" />
    </div>
  );
}

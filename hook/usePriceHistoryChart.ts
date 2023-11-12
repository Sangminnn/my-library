import { TouchEvent, useEffect, useRef, useState } from "react";

import theme from "@contexts/themeContext";

import { useMarketPriceQuery } from "../catalog/catalog.queries";

import {
  Chart,
  CategoryScale,
  LinearScale,
  LineElement,
  LineController,
  PointElement,
  ChartConfiguration,
} from "chart.js";

import { useParams } from "react-router-dom";

import { CLIENT_WIDTH, LEFT_EDGE_AREA, RIGHT_EDGE_AREA } from "./chartUtils";

import { DateFilter } from "@features/catalog/catalogApi";

Chart.register(
  { id: "customPrice" },
  CategoryScale,
  LineElement,
  LineController,
  LinearScale,
  PointElement
);

type PricePosition = "center" | "left" | "right";

const usePriceHistoryChart = (dateFilter: DateFilter) => {
  const { modelId } = useParams<{ modelId?: string }>();

  const chartRef = useRef<any>(null);
  const chartConfigRef = useRef<any>(null);

  const [tooltipPosition, setTooltipPosition] = useState<{
    x?: number | null;
    y?: number | null;
  }>({
    x: null,
    y: null,
  });
  const [targetDataIndex, setTargetDataIndex] = useState<number | null>(null);
  const [pricePosition, setPricePosition] = useState<PricePosition | null>(
    null
  );
  const [linePosition, setLinePosition] = useState<number | null>(null);
  const [scrollLock, setScrollLock] = useState(false);

  const { data: modelMarketPrice } = useMarketPriceQuery({
    modelId: Number(modelId),
    dateFilter,
  });

  const marketHistory = modelMarketPrice?.points ?? [];
  const dateList = marketHistory.map((historyData) => historyData.dateTime);
  const priceList = marketHistory.map((historyData) => historyData.price);

  const marketMinPrice = modelMarketPrice?.minPrice ?? 0;
  const marketMaxPrice = modelMarketPrice?.maxPrice ?? 0;

  const minLastIndex = priceList?.lastIndexOf(marketMinPrice);
  const maxLastIndex = priceList?.lastIndexOf(marketMaxPrice);

  const RIGHT_PADDING = minLastIndex !== maxLastIndex ? 20 : 0;
  const LEFT_PADDING = 8;
  const LINE_BORDER_WIDTH = priceList?.length > 20 ? 1 : 3;

  const TWO_OVER_LIST_CONFIG = {
    type: "line",
    data: {
      labels: dateList,
      datasets: [
        {
          borderColor: `${theme.color.BGZT_GREEN_500}`,
          tension: 0,
          data: priceList,
        },
      ],
    },
    options: {
      events: ["touchstart", "touchmove", "touchend"],
      layout: {
        padding: {
          top: 35,
          bottom: 35,
          right: RIGHT_PADDING,
          left: LEFT_PADDING,
        },
      },
      spanGaps: true,
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          borderWidth: LINE_BORDER_WIDTH,
        },
        point: {
          radius: 0,
          borderWidth: 0,
          hitRadius: 0,
        },
      },
      scales: {
        x: {
          display: false,
          beginAtZero: true,
        },
        y: {
          display: false,
        },
      },
      animation: false,
    },
  };

  const ONE_LIST_CONFIG = {
    type: "line",
    data: {
      labels: [...dateList, ...dateList],
      datasets: [
        {
          borderColor: `${theme.color.BGZT_GREEN_500}`,
          tension: 0,
          pointRadius: 0,
          data: [...priceList, ...priceList],
        },
      ],
    },
    options: {
      events: ["touchstart", "touchmove", "touchend"],
      layout: {
        padding: {
          top: 35,
          bottom: 35,
          right: 0,
        },
      },
      spanGaps: true,
      responsive: true,
      maintainAspectRatio: false,
      elements: {
        line: {
          borderWidth: 1,
        },
        point: {
          radius: 0,
          borderWidth: 0,
          hitRadius: 0,
        },
      },
      scales: {
        x: {
          display: false,
          beginAtZero: true,
        },
        y: {
          display: false,
        },
      },
      animation: false,
    },
  };

  const targetDataSet = (
    marketHistory.length > 1 ? TWO_OVER_LIST_CONFIG : ONE_LIST_CONFIG
  ) as ChartConfiguration<"line">;

  const renderChart = ({ options }: { options: ChartConfiguration }) => {
    chartConfigRef.current = new Chart(chartRef.current, options);
  };

  const setCurrentInfo = (e: TouchEvent) => {
    const currentElement = chartConfigRef.current.getElementsAtEventForMode(
      e,
      "nearest",
      { axis: "x" },
      true
    );

    const EMPTY_SPACE = CLIENT_WIDTH > 640 ? (CLIENT_WIDTH - 640) / 2 : 0;
    const currentClientX = e.targetTouches[0].clientX - EMPTY_SPACE;

    const dataIndexFromClientX =
      chartConfigRef.current.scales.x.getValueForPixel(currentClientX);

    let targetX =
      currentElement?.length !== 0
        ? currentElement?.[0]?.element.x
        : currentClientX;
    const dataIndex =
      currentElement?.length !== 0
        ? currentElement?.[0]?.index
        : dataIndexFromClientX;

    let pricePosition: PricePosition = "center";

    if (
      currentElement[0]?.element?.x < LEFT_EDGE_AREA ||
      currentClientX < LEFT_EDGE_AREA
    ) {
      targetX = LEFT_EDGE_AREA;
      pricePosition = "left";
    }

    if (
      currentElement[0]?.element?.x > RIGHT_EDGE_AREA ||
      currentClientX > RIGHT_EDGE_AREA ||
      currentClientX < 10
    ) {
      targetX = RIGHT_EDGE_AREA;
      pricePosition = "right";
    }

    const getCalculatedLinePosition = () => {
      const MAX_WIDTH = 640;
      const CURRENT_CLIENT_WIDTH =
        CLIENT_WIDTH > MAX_WIDTH ? MAX_WIDTH : CLIENT_WIDTH;

      const MIN_POSITION = LEFT_PADDING - 1;
      const MAX_POSITION = CURRENT_CLIENT_WIDTH - RIGHT_PADDING;

      let result = currentClientX;

      if (currentClientX < MIN_POSITION) result = MIN_POSITION;
      if (currentClientX > MAX_POSITION) result = MAX_POSITION;

      return result;
    };

    const calculatedLinePosition = getCalculatedLinePosition();

    requestAnimationFrame(() => {
      setTooltipPosition({
        x: parseInt(String(targetX)),
        y: -20,
      });

      setTargetDataIndex(dataIndex);
      setPricePosition(pricePosition);
      setLinePosition(calculatedLinePosition);
    });
  };

  const touchStartAction = (e: TouchEvent) => {
    setScrollLock(true);
    setCurrentInfo(e);
  };

  const touchMoveAction = (e: TouchEvent) => setCurrentInfo(e);

  const touchEndAction = () => {
    setScrollLock(false);
    requestAnimationFrame(() => {
      chartConfigRef.current.destroy();

      renderChart({ options: targetDataSet });

      setTargetDataIndex(null);
      setPricePosition(null);
      setLinePosition(null);
      setTooltipPosition({
        x: null,
        y: null,
      });
    });
  };

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    renderChart({ options: targetDataSet });
    chart.addEventListener("touchstart", touchStartAction);
    chart.addEventListener("touchmove", touchMoveAction);
    chart.addEventListener("touchend", touchEndAction);

    return () => {
      // 현 케이스에서는 modelMarketPrice가 변경될 경우 canvas 자체가 다른 node로 변경되어 실제로 remove가 유효하지 않음.
      chart.removeEventListener("touchstart", touchStartAction);
      chart.removeEventListener("touchmove", touchMoveAction);
      chart.removeEventListener("touchend", touchEndAction);
    };
  }, [modelMarketPrice]);

  return {
    chart: chartRef,
    targetDataIndex,
    tooltipPosition,
    pricePosition,
    linePosition,
    scrollLock,
  };
};

export default usePriceHistoryChart;

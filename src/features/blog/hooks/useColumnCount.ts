import { useEffect, useState, type RefObject } from 'react';

/**
 * Tracks how many masonry columns fit inside `containerRef`, mirroring the
 * CSS grid rule it replaces (`minmax(min(100%, 22rem), 1fr)` with a 1.5rem gap).
 *
 * Returning a column count lets the listing distribute cards round-robin so the
 * newest-first reading order is preserved while each card keeps its natural
 * height — no row is forced to the tallest card.
 */

const MIN_COLUMN_PX = 352; // 22rem
const GAP_PX = 24; // gap-6 (1.5rem)

const computeColumns = (width: number): number => {
  if (width <= 0) return 1;
  const fit = Math.floor((width + GAP_PX) / (MIN_COLUMN_PX + GAP_PX));
  return Math.max(1, fit);
};

const useColumnCount = (containerRef: RefObject<HTMLElement | null>): number => {
  const [columns, setColumns] = useState(1);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const update = () => setColumns(computeColumns(node.clientWidth));

    update();

    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [containerRef]);

  return columns;
};

export { useColumnCount };

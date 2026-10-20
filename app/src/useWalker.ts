import { useCallback, useEffect, useRef, useState } from 'react';
import { CAT_BY_ID, FEET, PLACES, SHAFT_X, isPlace, type Level, type PlaceId } from './data';

export interface WalkerState {
  cx: number;
  lvl: Level;
  /** 1 = facing right, -1 = facing left. */
  face: 1 | -1;
  /** Duration in seconds of the current leg, used as the CSS transition time. */
  dur: number;
  walking: boolean;
}

function targetOf(id: string): { x: number; lvl: Level } {
  return isPlace(id) ? PLACES[id] : { x: CAT_BY_ID[id].x, lvl: CAT_BY_ID[id].lvl };
}

/**
 * Moves the survivor through the scene. Changing floors always routes through the shaft.
 * When the walk ends, `onArrive` is called with the target id.
 */
export function useWalker(walkSpeed: number, onArrive: (id: string) => void) {
  const [state, setState] = useState<WalkerState>({ cx: SHAFT_X, lvl: 0, face: 1, dur: 0, walking: false });
  const pos = useRef({ cx: SHAFT_X, lvl: 0 as Level, face: 1 as 1 | -1 });
  const timer = useRef<number>();
  const arrive = useRef(onArrive);
  arrive.current = onArrive;

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const walkTo = useCallback((id: string) => {
    const t = targetOf(id);
    window.clearTimeout(timer.current);
    const start = pos.current;
    const path: [number, Level][] = start.lvl === t.lvl
      ? [[t.x, t.lvl]]
      : [[SHAFT_X, start.lvl], [SHAFT_X, t.lvl], [t.x, t.lvl]];
    setState(s => ({ ...s, walking: true }));

    const step = (i: number) => {
      if (i >= path.length) {
        setState(s => ({ ...s, walking: false }));
        arrive.current(id);
        return;
      }
      const [x, l] = path[i];
      const { cx, lvl, face } = pos.current;
      const d = Math.abs(x - cx) + Math.abs(FEET[l] - FEET[lvl]);
      if (d < 2) return step(i + 1);
      const dur = Math.max(0.2, d / walkSpeed);
      const nextFace: 1 | -1 = x < cx ? -1 : x > cx ? 1 : face;
      pos.current = { cx: x, lvl: l, face: nextFace };
      setState({ cx: x, lvl: l, dur, face: nextFace, walking: true });
      timer.current = window.setTimeout(() => step(i + 1), dur * 1000 + 40);
    };
    step(0);
  }, [walkSpeed]);

  return { ...state, walkTo };
}

export type { PlaceId };

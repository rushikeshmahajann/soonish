import * as react_jsx_runtime from 'react/jsx-runtime';
import { CSSProperties } from 'react';

type LoaderName = 'sweep' | 'diagonal' | 'ripple' | 'rain' | 'spiral' | 'snake' | 'sparkle' | 'heartbeat' | 'scanner' | 'orbit' | 'breathe' | 'checker' | 'stripes' | 'falling' | 'plasma' | 'loadbar' | 'knight-tour' | 'hilbert' | 'vortex' | 'sine-wave' | 'life' | 'quadrants' | 'crossfade' | 'glider' | 'matrix' | 'pong' | 'concentric' | 'twin-spirals' | 'thinking' | 'searching' | 'finding' | 'consolidating' | 'streaming' | 'reasoning' | 'indexing' | 'connecting' | 'generating' | 'reflecting' | 'scale-ripple' | 'scale-wave' | 'scale-diag' | 'scale-pop' | 'scale-ring' | 'scale-check' | 'twist' | 'squash' | 'jelly' | 'pop-rotate' | 'skew' | 'heartbeat-scale' | 'drop' | 'burst' | 'spiral-scale' | 'zigzag' | 'smiley' | 'heart' | 'star' | 'fire' | 'robot' | 'ghost' | 'lightning' | 'diamond' | 'skull' | 'pacman' | 'mushroom' | 'crown' | 'rocket' | 'coin' | 'bomb' | 'wave' | 'cat' | 'bug' | 'battery' | 'bell' | 'round' | 'square-mandala' | 'diamond-mandala' | 'cross' | 'x-diagonal' | 'star-burst' | 'petal' | 'snowflake' | 'gear' | 'kaleido' | 'spiral-mandala' | 'pulse-square' | 'check-mandala' | 'octagon' | 'lotus' | 'mountain' | 'fishing' | 'treadmill' | 'chef' | 'plant' | 'astronaut' | 'envelope' | 'bubble' | 'phone' | 'bell-swing' | 'at';
interface LoaderProps {
    /** Which loader to display */
    name: LoaderName;
    /** Override the animation color (hex or any CSS color value) */
    color?: string;
    /** Pixel size in px. Default: 12 */
    size?: number;
    /** Gap between pixels in px. Default: 2 */
    gap?: number;
    /** Animation speed multiplier. 1 = normal, 2 = twice as fast. Default: 1 */
    speed?: number;
    /** Extra CSS class on the wrapper */
    className?: string;
    /** Extra inline styles on the wrapper */
    style?: CSSProperties;
}

declare function Loader({ name, color, size, gap, speed, className, style, }: LoaderProps): react_jsx_runtime.JSX.Element | null;

export { Loader, type LoaderName, type LoaderProps };

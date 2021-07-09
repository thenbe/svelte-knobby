/**
 * @typedef {{
 *   start: {
 *     x: number;
 *     y: number;
 *   };
 *   x: number;
 *   y: number;
 *   dx: number;
 *   dy: number;
 *   context: Record<string, any>
 * }} Drag
 */

/**
 * @param {HTMLElement} node
 * @param {{
 *   start?: (drag: Drag) => void;
 *   move?: (drag: Drag) => void;
 *   end?: (drag: Drag) => void;
 * }} handlers
 */
export function drag(node, { start = () => {}, move = () => {}, end = () => {} } = {}) {
	/** @param {PointerEvent} e */
	function handle_start(e) {
		if (!e.isPrimary) return;

		const initial = { x: e.clientX, y: e.clientY };
		const last = { x: e.clientX, y: e.clientY };

		const pointerId = e.pointerId;

		/** @type {Drag} */
		const drag = {
			start: initial,
			x: 0,
			y: 0,
			dx: 0,
			dy: 0,
			context: {}
		};

		start(drag);

		/** @param {PointerEvent} e */
		function handle_move(e) {
			if (e.pointerId !== pointerId) return;

			const { clientX: x, clientY: y } = e;

			drag.dx = x - last.x;
			drag.dy = y - last.y;

			drag.x = x - initial.x;
			drag.y = y - initial.y;

			last.x = x;
			last.y = y;

			move(drag);
		}

		/** @param {PointerEvent} e */
		function handle_end(e) {
			if (e.pointerId !== pointerId) return;

			end(drag);

			window.removeEventListener('pointermove', handle_move);
			window.removeEventListener('pointerup', handle_end);
			window.removeEventListener('pointercancel', handle_end);
		}

		window.addEventListener('pointermove', handle_move);
		window.addEventListener('pointerup', handle_end);
		window.addEventListener('pointercancel', handle_end);
	}

	node.addEventListener('pointerdown', handle_start);
}

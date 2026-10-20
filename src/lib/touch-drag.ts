export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  deltaX: number;
  deltaY: number;
  target: HTMLElement | null;
  startTime: number;
}

export interface TouchDragOptions {
  onDragStart?: (element: HTMLElement, event: TouchEvent | MouseEvent) => void;
  onDrag?: (element: HTMLElement, deltaX: number, deltaY: number, event: TouchEvent | MouseEvent) => void;
  onDragEnd?: (element: HTMLElement, event: TouchEvent | MouseEvent) => void;
  threshold?: number;
  preventScroll?: boolean;
}

export function createTouchDragHandler(options: TouchDragOptions = {}) {
  const { onDragStart, onDrag, onDragEnd, threshold = 8, preventScroll = true } = options;
  let state: DragState = {
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    deltaX: 0,
    deltaY: 0,
    target: null,
    startTime: 0,
  };

  function handleStart(event: TouchEvent | MouseEvent, target: HTMLElement): void {
    let clientX: number;
    let clientY: number;
    if ('touches' in event) {
      const touch = event.touches[0];
      if (!touch) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = (event as MouseEvent).clientX;
      clientY = (event as MouseEvent).clientY;
    }
    state = {
      isDragging: false,
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      deltaX: 0,
      deltaY: 0,
      target,
      startTime: Date.now(),
    };
    if (preventScroll) {
      event.preventDefault();
    }
  }

  function handleMove(event: TouchEvent | MouseEvent): void {
    if (!state.target) return;
    let clientX: number;
    let clientY: number;
    if ('touches' in event) {
      const touch = event.touches[0];
      if (!touch) return;
      clientX = touch.clientX;
      clientY = touch.clientY;
    } else {
      clientX = (event as MouseEvent).clientX;
      clientY = (event as MouseEvent).clientY;
    }
    state.currentX = clientX;
    state.currentY = clientY;
    state.deltaX = clientX - state.startX;
    state.deltaY = clientY - state.startY;
    const distance = Math.sqrt(state.deltaX ** 2 + state.deltaY ** 2);
    if (!state.isDragging && distance > threshold) {
      state.isDragging = true;
      onDragStart?.(state.target, event);
    }
    if (state.isDragging) {
      onDrag?.(state.target, state.deltaX, state.deltaY, event);
    }
  }

  function handleEnd(event: TouchEvent | MouseEvent): void {
    if (state.target && state.isDragging) {
      onDragEnd?.(state.target, event);
    }
    state = {
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      deltaX: 0,
      deltaY: 0,
      target: null,
      startTime: 0,
    };
  }

  function attach(element: HTMLElement): () => void {
    element.addEventListener('mousedown', (e) => handleStart(e, element), { passive: !preventScroll });
    element.addEventListener('touchstart', (e) => handleStart(e, element), { passive: !preventScroll });
    const moveHandler = (e: TouchEvent | MouseEvent) => handleMove(e);
    const endHandler = (e: TouchEvent | MouseEvent) => handleEnd(e);
    document.addEventListener('mousemove', moveHandler, { passive: true });
    document.addEventListener('touchmove', moveHandler, { passive: true });
    document.addEventListener('mouseup', endHandler, { passive: true });
    document.addEventListener('touchend', endHandler, { passive: true });
    document.addEventListener('touchcancel', endHandler, { passive: true });
    return () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('mouseup', endHandler);
      document.removeEventListener('touchend', endHandler);
      document.removeEventListener('touchcancel', endHandler);
    };
  }

  return { attach, getState: () => state };
}

export function createHorizontalScrollDrag(element: HTMLElement) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  const handleMouseDown = (e: MouseEvent | TouchEvent) => {
    isDown = true;
    const touch = 'touches' in e ? e.touches[0] : null;
    startX = touch ? touch.pageX : (e as MouseEvent).pageX;
    scrollLeft = element.scrollLeft;
    element.style.cursor = 'grabbing';
    element.style.scrollBehavior = 'auto';
  };

  const handleMouseMove = (e: MouseEvent | TouchEvent) => {
    if (!isDown) return;
    e.preventDefault();
    const touch = 'touches' in e ? e.touches[0] : null;
    const x = touch ? touch.pageX : (e as MouseEvent).pageX;
    const walk = (x - startX) * 1.5;
    element.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    isDown = false;
    element.style.cursor = 'grab';
    element.style.scrollBehavior = 'smooth';
  };

  element.addEventListener('mousedown', handleMouseDown);
  element.addEventListener('touchstart', handleMouseDown, { passive: true });
  document.addEventListener('mousemove', handleMouseMove, { passive: true });
  document.addEventListener('touchmove', handleMouseMove, { passive: true });
  document.addEventListener('mouseup', handleMouseUp, { passive: true });
  document.addEventListener('touchend', handleMouseUp, { passive: true });
  element.style.cursor = 'grab';
  return () => {
    element.removeEventListener('mousedown', handleMouseDown);
    element.removeEventListener('touchstart', handleMouseDown);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('touchmove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.removeEventListener('touchend', handleMouseUp);
  };
}
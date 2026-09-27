/**
 * The skill ring: the cards stand on a cylinder that the visitor spins by
 * hand. The geometry is CSS (each card is rotated by its index and pushed out
 * to the radius); this file only moves the one angle the ring turns by, and
 * fades the cards by how far round they are.
 *
 * The ring settles on a card whenever it is let go, so the front is always
 * one skill rather than the gap between two.
 */

const DEG_PER_PX = 0.28;     // how far a pixel of drag turns the ring
const FRICTION = 0.94;       // per frame, once the hand is off
const REST = 0.015;          // deg/ms below which the ring is considered still
const SETTLE = 0.16;         // how much of the remaining distance a frame covers
const TAP_PX = 5;            // a shorter drag than this is a press

const ringWindow = window as Window & { __skillRingHookAttached?: boolean };

const initRing = (root: HTMLElement) => {
    const stage = root.querySelector<HTMLElement>('[data-ring-stage]');
    const ring = root.querySelector<HTMLElement>('[data-ring]');
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-ring-card]'));
    const jumpButtons = Array.from(root.querySelectorAll<HTMLElement>('[data-ring-jump]'));
    if (!stage || !ring || cards.length < 2) return;

    const count = cards.length;
    const step = 360 / count;
    const stillMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let angle = 0;
    let velocity = 0;
    let frame = 0;
    let target: number | null = null;
    let dragging = false;
    let pointerId = -1;
    let lastX = 0;
    let lastTime = 0;
    let travelled = 0;
    let pressed: HTMLElement | null = null;
    let renderedFront = -1;

    // The angle, step and radius are written on the stage so the floor under
    // the ring, a sibling, turns with it: custom properties inherit downwards.
    stage.style.setProperty('--ring-step', `${step}deg`);
    cards.forEach((card, index) => card.style.setProperty('--i', String(index)));

    const measure = () => {
        const width = cards[0].offsetWidth || 272;
        // Neighbours just touch at this radius; the extra keeps a gutter open.
        const radius = Math.round((width / 2) / Math.tan(Math.PI / count)) + 28;
        stage.style.setProperty('--ring-radius', `${radius}px`);
    };

    const frontIndex = () => ((Math.round(-angle / step) % count) + count) % count;

    const render = () => {
        stage.style.setProperty('--ring-angle', `${angle}deg`);
        const front = frontIndex();
        cards.forEach((card, index) => {
            // Where the card is round the ring, as an angle from the front.
            const around = (((index * step + angle) % 360) + 540) % 360 - 180;
            const depth = Math.cos((around * Math.PI) / 180);
            // Falls off steeply, so only the front card is at full strength
            // and its neighbours already read as the ones waiting their turn.
            card.style.opacity = depth <= 0 ? '0' : String(0.14 + 0.86 * depth ** 4);
            card.style.pointerEvents = depth > 0.05 ? '' : 'none';
        });
        if (front === renderedFront) return;
        cards.forEach((card, index) => {
            card.classList.toggle('is-front', index === front);
            card.setAttribute('aria-hidden', index === front ? 'false' : 'true');
        });
        const category = cards[front].dataset.category ?? '';
        jumpButtons.forEach((button) => {
            button.classList.toggle('is-active', button.dataset.ringJump === category);
            button.setAttribute('aria-pressed', String(button.dataset.ringJump === category));
        });
        renderedFront = front;
    };

    const stop = () => {
        cancelAnimationFrame(frame);
        frame = 0;
    };

    // Runs the ring on from a throw, then eases it onto the nearest card.
    const tick = () => {
        frame = 0;
        if (target === null) {
            angle += velocity * 16;
            velocity *= FRICTION;
            if (Math.abs(velocity) < REST) {
                velocity = 0;
                target = Math.round(angle / step) * step;
            }
        } else {
            const remaining = target - angle;
            if (Math.abs(remaining) < 0.05) {
                angle = target;
                target = null;
                render();
                return;
            }
            angle += remaining * SETTLE;
        }
        render();
        frame = requestAnimationFrame(tick);
    };

    const settle = () => {
        if (stillMotion) {
            angle = target ?? Math.round(angle / step) * step;
            target = null;
            velocity = 0;
            render();
            return;
        }
        stop();
        frame = requestAnimationFrame(tick);
    };

    const turnTo = (index: number) => {
        // The shorter way round.
        let delta = (((index - frontIndex()) % count) + count) % count;
        if (delta > count / 2) delta -= count;
        target = (Math.round(angle / step) - delta) * step;
        velocity = 0;
        settle();
    };

    const onPointerDown = (event: PointerEvent) => {
        if (event.button !== 0 && event.pointerType === 'mouse') return;
        dragging = true;
        pointerId = event.pointerId;
        lastX = event.clientX;
        lastTime = event.timeStamp;
        travelled = 0;
        velocity = 0;
        target = null;
        // Remembered now: once the stage captures the pointer, the release
        // is retargeted to the stage and no longer says which card was hit.
        pressed = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-ring-card]') ?? null;
        stop();
        stage.classList.add('is-dragging');
        stage.setPointerCapture(pointerId);
    };

    const onPointerMove = (event: PointerEvent) => {
        if (!dragging || event.pointerId !== pointerId) return;
        const dx = event.clientX - lastX;
        const dt = Math.max(event.timeStamp - lastTime, 1);
        lastX = event.clientX;
        lastTime = event.timeStamp;
        travelled += Math.abs(dx);
        angle += dx * DEG_PER_PX;
        velocity = (dx * DEG_PER_PX) / dt;
        render();
    };

    const onPointerUp = (event: PointerEvent) => {
        if (!dragging || event.pointerId !== pointerId) return;
        dragging = false;
        stage.classList.remove('is-dragging');
        if (stage.hasPointerCapture(pointerId)) stage.releasePointerCapture(pointerId);

        if (travelled < TAP_PX) {
            // A press on a card to the side brings it round.
            const index = pressed ? cards.indexOf(pressed) : -1;
            pressed = null;
            if (index >= 0 && index !== frontIndex()) {
                turnTo(index);
                return;
            }
        }
        pressed = null;

        // A stale velocity from a hand that paused before letting go would
        // throw the ring; only a fresh one counts.
        if (event.timeStamp - lastTime > 80) velocity = 0;
        if (stillMotion) velocity = 0;
        target = null;
        settle();
    };

    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('pointermove', onPointerMove);
    stage.addEventListener('pointerup', onPointerUp);
    stage.addEventListener('pointercancel', onPointerUp);
    stage.addEventListener('dragstart', (event) => event.preventDefault());

    stage.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            turnTo((frontIndex() + 1) % count);
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            turnTo((frontIndex() - 1 + count) % count);
        }
    });

    root.querySelector('[data-ring-prev]')?.addEventListener('click', () => turnTo((frontIndex() - 1 + count) % count));
    root.querySelector('[data-ring-next]')?.addEventListener('click', () => turnTo((frontIndex() + 1) % count));
    jumpButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const index = cards.findIndex((card) => card.dataset.category === button.dataset.ringJump);
            if (index >= 0) turnTo(index);
        });
    });

    if ('ResizeObserver' in window) {
        new ResizeObserver(() => {
            measure();
            render();
        }).observe(stage);
    } else {
        (window as Window).addEventListener('resize', () => {
            measure();
            render();
        }, { passive: true });
    }

    measure();
    render();
    root.dataset.ringReady = 'true';
};

const initAll = () => {
    document.querySelectorAll<HTMLElement>('[data-skill-ring]:not([data-ring-ready])').forEach(initRing);
};

export const initSkillStack = () => {
    initAll();
    if (ringWindow.__skillRingHookAttached) return;
    document.addEventListener('astro:page-load', initAll);
    ringWindow.__skillRingHookAttached = true;
};

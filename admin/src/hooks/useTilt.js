import { useRef } from "react";

// Same pointer-tracked 3D tilt used on the Login card, packaged so any
// element can opt in: spread {ref, onMouseMove, onMouseLeave} onto it.
export const useTilt = (strength = 10) => {
  const ref = useRef(null);

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--tilt-ry", `${px * strength}deg`);
    el.style.setProperty("--tilt-rx", `${-py * strength}deg`);
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--tilt-rx", "0deg");
    el.style.setProperty("--tilt-ry", "0deg");
  };

  return { ref, onMouseMove, onMouseLeave };
};

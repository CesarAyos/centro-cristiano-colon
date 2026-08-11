export function setupReveals(root = document) {
  if (typeof IntersectionObserver === 'undefined') return () => {};

  const els = root.querySelectorAll('.cc-reveal');
  if (!els.length) return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('cc-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach((el) => io.observe(el));

  return () => {
    els.forEach((el) => io.unobserve(el));
    io.disconnect();
  };
}

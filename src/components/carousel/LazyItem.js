'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function LazyItem({ children, itemMinWidth  }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      className={`${itemMinWidth} flex-shrink-0`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  );
}

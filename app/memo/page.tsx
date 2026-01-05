'use client';

import { motion } from "framer-motion";

export default function memo() {
  return ( 
      <section className="mx-auto max-w-6xl px-6 py-[30%]">
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center" >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">memo</h1>
      </motion.div>
    </section>
  );
}

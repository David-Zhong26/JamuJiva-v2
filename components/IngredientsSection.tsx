import React from 'react';
import { motion } from 'framer-motion';
import { LazyMount } from './LazyMount';

const INGREDIENTS = [
  { title: 'Turmeric', desc: 'Pure Central Javanese', color: '#F9D067' },
  { title: 'Ginger', desc: 'Cold-press ritual', color: '#F47C3E' },
  { title: 'Long Pepper', desc: 'Bio-available blend', color: '#2D4F3E' },
];

export function IngredientsSection() {
  return (
    <section id="ingredients" className="py-24 md:py-32 px-6 bg-[#F5F2ED]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[#F47C3E] font-black tracking-widest uppercase text-sm block mb-4"
          >
            Inside the Bottle
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-5xl md:text-7xl font-black text-[#2D4F3E] leading-tight"
          >
            Three Roots. <span className="italic text-[#F9D067]">One Ritual.</span>
          </motion.h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
          <div className="flex-1 max-w-md w-full flex justify-center">
            <LazyMount placeholderClassName="rounded-2xl" />
          </div>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {INGREDIENTS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full mx-auto mb-4 flex items-center justify-center font-serif text-2xl font-black text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.title[0]}
                </div>
                <h3 className="font-serif text-xl md:text-2xl font-bold text-[#2D4F3E]">
                  {item.title}
                </h3>
                <p className="text-[#2D4F3E]/70 text-sm mt-1">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

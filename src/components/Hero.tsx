"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export const Hero = () => {
    return (
        <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-gradient-to-b from-brand-pink/50 to-white">
            {/* Background decoration */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-brand-accent/20 rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-brand-purple/10 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-12 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-left"
                >
                    <span className="inline-block px-4 py-1 bg-brand-pink border border-brand-accent rounded-full text-brand-purple text-sm font-medium mb-4 uppercase tracking-wider">
                        Especialista em Furação Humanizada
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold text-brand-dark mb-6 leading-tight">
                        Beleza, Segurança e <span className="text-brand-purple italic">Carinho</span> em Cada Detalhe
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 max-w-lg">
                        Realce sua beleza com piercings de alta qualidade ou proporcione a melhor experiência de primeiro brinco para o seu bebê com técnicas humanizadas e estéreis.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <a
                            href="https://wa.me/5500000000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-brand-purple text-white rounded-full font-medium hover:bg-brand-dark transition-all text-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            Agendar Horário
                        </a>
                        <a
                            href="#services"
                            className="px-8 py-4 border border-brand-purple text-brand-purple rounded-full font-medium hover:bg-brand-pink/50 transition-all text-center"
                        >
                            Conhecer Serviços
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative flex justify-center"
                >
                    {/* Main Hero Image */}
                    <div className="relative w-[300px] h-[300px] md:w-[450px] md:h-[450px] rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white flex items-center justify-center">
                        {/* Using Logo as placeholder if no photo provided yet */}
                        <Image
                            src="/logo.png"
                            alt="Neclair Couto"
                            width={300}
                            height={300}
                            className="object-contain p-8"
                        />
                    </div>

                    {/* Floating Cards */}
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="absolute -bottom-4 -left-4 md:bottom-10 md:left-0 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3 border border-brand-pink"
                    >
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            🌿
                        </div>
                        <div>
                            <p className="text-sm font-bold text-brand-dark">100% Seguro</p>
                            <p className="text-xs text-gray-500">Materiais Estéreis</p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

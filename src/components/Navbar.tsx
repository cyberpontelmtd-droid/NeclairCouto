"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Início", href: "#hero" },
        { name: "Sobre", href: "#about" },
        { name: "Serviços", href: "#services" },
        { name: "Contato", href: "#contact" },
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-2" : "bg-transparent py-4"
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    {/* Fallback text if logo fails, but we have logo.png in public */}
                    <div className="relative w-10 h-10 md:w-12 md:h-12">
                        <Image src="/logo.png" alt="Neclair Couto Logo" fill className="object-contain" />
                    </div>
                    <span className={`font-serif text-xl md:text-2xl font-bold ${scrolled ? "text-brand-purple" : "text-brand-purple"}`}>
                        Neclair Couto
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-brand-dark hover:text-brand-purple font-medium transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <a
                        href="https://wa.me/5500000000000" // Placeholder phone
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-brand-purple text-white px-5 py-2 rounded-full hover:bg-brand-dark transition-colors shadow-md"
                    >
                        Agendar
                    </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-brand-purple"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden flex flex-col items-center py-6 gap-6"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-lg text-brand-dark font-medium"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <a
                            href="https://wa.me/5500000000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-brand-purple text-white px-8 py-3 rounded-full text-lg w-3/4 text-center"
                        >
                            Agendar Agora
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

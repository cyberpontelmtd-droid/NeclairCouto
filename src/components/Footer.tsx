import { Instagram, Facebook, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const Footer = () => {
    return (
        <footer id="contact" className="bg-brand-dark text-white pt-16 pb-8">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Info */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="relative w-16 h-16 bg-white rounded-lg p-2">
                                <Image src="/logo-icon.png" alt="Neclair Couto Logo" fill className="object-contain" />
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            Realçando sua beleza com segurança e muito carinho. Especialista em perfuração humanizada e body piercing.
                        </p>
                        <div className="flex gap-4">
                            <a href="https://www.instagram.com/coutoneclair" target="_blank" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-purple transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="https://www.facebook.com/neclair.couto.16" target="_blank" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-brand-purple transition-colors">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-6 text-brand-accent">Menu Rápido</h4>
                        <ul className="space-y-3 text-gray-300">
                            <li><Link href="#hero" className="hover:text-brand-pink transition-colors">Início</Link></li>
                            <li><Link href="#about" className="hover:text-brand-pink transition-colors">Sobre</Link></li>
                            <li><Link href="#services" className="hover:text-brand-pink transition-colors">Serviços</Link></li>
                            <li><Link href="#contact" className="hover:text-brand-pink transition-colors">Contato</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-1 md:col-span-2">
                        <h4 className="font-bold text-lg mb-6 text-brand-accent">Entre em Contato</h4>
                        <div className="space-y-4 text-gray-300">
                            <div className="flex items-start gap-4">
                                <MapPin className="text-brand-purple mt-1" size={20} />
                                <p>
                                    Multibela Salão &amp; Estética<br />
                                    Rua Ernesto Alves, 1820 - Santa Cruz do Sul
                                </p>
                            </div>
                            <div className="flex items-center gap-4">
                                <Mail className="text-brand-purple" size={20} />
                                <a href="mailto:contato@neclaircouto.com.br" className="hover:text-white transition-colors">contato@neclaircouto.com.br</a>
                            </div>
                            <div className="flex items-center gap-4">
                                <Phone className="text-brand-purple" size={20} />
                                <a href="https://wa.me/5551996715427" target="_blank" className="hover:text-white transition-colors">(51) 99671-5427</a>
                            </div>
                            <a
                                href="https://wa.me/5551996715427?text=Ol%C3%A1%20Neclair%2C%20vim%20pelo%20site%20e%20gostaria%20de%20entrar%20em%20contato%3F"
                                target="_blank"
                                className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm font-bold transition-colors"
                            >
                                Chamar no WhatsApp
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 text-center text-gray-400 text-sm">
                    <p>&copy; {new Date().getFullYear()} Neclair Couto. Todos os direitos reservados.</p>
                </div>
            </div>
        </footer>
    );
};

import { Star, Baby, Gem } from "lucide-react";

const services = [
    {
        icon: <Baby size={40} />,
        title: "Perfuração Humanizada (Bebês)",
        description: "Método silencioso, sem pistola, com técnicas de relaxamento para um furo perfeito e sem traumas.",
        price: "Consultar",
        whatsapp: "https://wa.me/5551996715427?text=Ol%C3%A1%20Neclair%2C%20queria%20saber%20mais%20sobre%20o%20seu%20servi%C3%A7o%20de%20Perfura%C3%A7%C3%A3o%20Humanizada%20(Beb%C3%AAs)%3F",
    },
    {
        icon: <Star size={40} />,
        title: "Body Piercing",
        description: "Aplicação de piercings em diversas regiões (Orelha, Nariz, Umbigo, etc) com cateter ou agulha americana (body safe).",
        price: "A partir de R$ 80",
        whatsapp: "https://wa.me/5551996715427?text=Ol%C3%A1%20Neclair%2C%20queria%20saber%20mais%20sobre%20o%20seu%20servi%C3%A7o%20de%20Body%20Piercing%3F",
    },
    {
        icon: <Gem size={40} />,
        title: "Joias para Body Piercing",
        description: "Coleção exclusiva de joias em Titânio Grau Implante (ASTM F-136), Ouro 18k e Aço Cirúrgico. Laudos de garantia incluso.",
        price: "Variado",
        whatsapp: "https://wa.me/5551996715427?text=Ol%C3%A1%20Neclair%2C%20queria%20saber%20mais%20sobre%20o%20seu%20servi%C3%A7o%20de%20Joias%20para%20Body%20Piercing%3F",
    },
];

export const Services = () => {
    return (
        <section id="services" className="py-20 bg-brand-pink/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-purple font-bold tracking-widest uppercase text-sm">O que ofereço?</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mt-2 mb-4">Nossos Serviços</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Procedimentos realizados com total segurança, materiais descartáveis e joias certificadas.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-transparent hover:border-brand-accent group">
                            <div className="w-16 h-16 bg-brand-pink rounded-2xl flex items-center justify-center text-brand-purple mb-6 group-hover:bg-brand-purple group-hover:text-white transition-colors">
                                {service.icon}
                            </div>
                            <h3 className="text-xl font-bold text-brand-dark mb-4 group-hover:text-brand-purple transition-colors">{service.title}</h3>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                {service.description}
                            </p>
                            <a href={service.whatsapp} target="_blank" className="font-bold text-brand-purple hover:text-brand-dark text-sm border-b border-brand-purple pb-1 inline-block">
                                SABER MAIS
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

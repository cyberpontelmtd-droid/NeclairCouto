import { Heart, ShieldCheck, Sparkles } from "lucide-react";

export const About = () => {
    return (
        <section id="about" className="py-20 bg-white">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">Sobre Mim</h2>
                    <div className="w-24 h-1 bg-brand-purple mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    <div className="bg-brand-pink/30 p-8 rounded-2xl text-center hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-brand-purple">
                            <ShieldCheck size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-brand-dark">Biossegurança</h3>
                        <p className="text-gray-600">
                            Todos os procedimentos seguem rigorosos padrões de higiene e esterilização, garantindo sua saúde e segurança total.
                        </p>
                    </div>

                    <div className="bg-white border border-brand-pink p-8 rounded-2xl text-center shadow-lg transform md:-translate-y-4">
                        <div className="w-16 h-16 bg-brand-purple text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Heart size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-brand-dark">Atendimento Humanizado</h3>
                        <p className="text-gray-600">
                            Especialmente para bebês, utilizo técnicas que minimizam o desconforto, respeitando o tempo e o bem-estar da criança.
                        </p>
                    </div>

                    <div className="bg-brand-pink/30 p-8 rounded-2xl text-center hover:shadow-md transition-shadow">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-brand-purple">
                            <Sparkles size={32} />
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-brand-dark">Joias de Alta Qualidade</h3>
                        <p className="text-gray-600">
                            Trabalho apenas com materiais biocompatíveis como Titânio e Ouro, evitando alergias e garantindo cicatrização perfeita.
                        </p>
                    </div>
                </div>

                <div className="mt-16 bg-brand-purple/5 p-8 md:p-12 rounded-3xl flex flex-col md:flex-row items-center gap-8 border border-brand-purple/10">
                    <div className="flex-1">
                        <h3 className="text-2xl font-serif font-bold text-brand-purple mb-4">Neclair Couto</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                            Com anos de experiência e paixão pela arte do body piercing, dedico meu trabalho a realçar a beleza de cada cliente de forma única. Minha especialização em furação humanizada nasceu do desejo de proporcionar às mães e aos bebês um momento de tranquilidade e segurança, transformando o primeiro brinco em uma memória doce, não traumática.
                        </p>
                        <p className="text-gray-700 font-medium italic">
                            "Minha missão é trazer brilho com responsabilidade e muito amor."
                        </p>
                    </div>
                    {/* Placeholder for bio image if they send one later */}
                    {/* <div className="w-full md:w-1/3 h-64 bg-gray-200 rounded-xl"></div> */}
                </div>
            </div>
        </section>
    );
};

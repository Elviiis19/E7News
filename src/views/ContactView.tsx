import React from "react";
import { Instagram, MessageCircle, Mail, MapPin } from "lucide-react";

export default function ContactView() {
  const whatsappNumber = "5569981039664"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá,%20acesssei%20o%20portal%20E7%20News%20e%20gostaria%20de%20falar%20com%20vocês.`;

  return (
    <div className="w-full bg-white font-sans min-h-screen">
      <div className="w-full bg-zinc-950 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900 via-zinc-950 to-zinc-950"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="text-[#cc0000] font-black uppercase tracking-widest text-xs md:text-sm mb-4 block">Fale com a Redação</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
              Contato
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 font-medium max-w-2xl mx-auto leading-relaxed">
              Tem alguma denúncia, sugestão de pauta ou dúvida? Entre em contato conosco pelos nossos canais oficiais.
            </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Informações de Contato */}
          <div className="flex flex-col gap-10">
             <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 mb-6 border-b-2 border-red-700 inline-block pb-2">
                  Canais de Atendimento
                </h2>
                <div className="flex flex-col gap-6 mt-4">
                  
                  <a 
                    href={whatsappLink}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100 hover:border-green-200 hover:bg-green-50 transition-colors group"
                  >
                    <div className="bg-[#25D366] text-white p-3 rounded-full mt-1 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">WhatsApp Redação</span>
                      <strong className="text-xl text-zinc-900 group-hover:text-green-700 transition-colors block mb-1">
                        (69) 98103-9664
                      </strong>
                      <span className="text-sm font-medium text-zinc-500">
                        Chat de atendimento rápido. Envie sua mensagem, fotos ou vídeos.
                      </span>
                    </div>
                  </a>

                  <a 
                    href="https://instagram.com/sitee7news" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100 hover:border-pink-200 hover:bg-pink-50 transition-colors group"
                  >
                    <div className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white p-3 rounded-full mt-1 group-hover:scale-110 transition-transform">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Instagram Oficial</span>
                      <strong className="text-xl text-zinc-900 group-hover:text-[#dc2743] transition-colors block mb-1">
                        @sitee7news
                      </strong>
                      <span className="text-sm font-medium text-zinc-500">
                        Acompanhe nossos stories e mande seu direct.
                      </span>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100">
                    <div className="bg-zinc-900 text-white p-3 rounded-full mt-1">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">Localização</span>
                      <strong className="text-xl text-zinc-900 block mb-1">
                        Monte Negro - RO
                      </strong>
                      <span className="text-sm font-medium text-zinc-500">
                        Sede de cobertura presencial e administrativa.
                      </span>
                    </div>
                  </div>

                </div>
             </div>
          </div>

          {/* Formulário de Contato */}
          <div className="bg-zinc-50 p-8 rounded-2xl border border-zinc-100 shadow-sm">
             <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 mb-6">Envie uma Mensagem</h3>
             <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); alert("Sua mensagem foi enviada com sucesso! Em breve retornaremos."); }}>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-bold text-zinc-700">Seu Nome completo</label>
                  <input type="text" id="name" required className="p-3 bg-white border border-zinc-200 rounded outline-none focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] transition-colors" placeholder="Ex: João da Silva"/>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-bold text-zinc-700">E-mail</label>
                  <input type="email" id="email" required className="p-3 bg-white border border-zinc-200 rounded outline-none focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] transition-colors" placeholder="seu.email@exemplo.com"/>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-sm font-bold text-zinc-700">Assunto</label>
                  <select id="subject" className="p-3 bg-white border border-zinc-200 rounded outline-none focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] transition-colors">
                     <option value="sugestao">Sugestão de Pauta</option>
                     <option value="denuncia">Denúncia</option>
                     <option value="publicidade">Publicidade / Parcerias</option>
                     <option value="outro">Outro assunto</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-bold text-zinc-700">Mensagem</label>
                  <textarea id="message" rows={5} required className="p-3 bg-white border border-zinc-200 rounded outline-none focus:border-[#cc0000] focus:ring-1 focus:ring-[#cc0000] transition-colors resize-y" placeholder="Escreva aqui detalhadamente..."></textarea>
                </div>

                <button type="submit" className="mt-2 bg-[#cc0000] text-white font-black uppercase tracking-widest text-sm py-4 rounded hover:bg-red-800 transition-colors flex justify-center items-center gap-2">
                  <Mail className="w-5 h-5" /> Enviar Mensagem
                </button>
             </form>
          </div>

        </div>
      </div>
    </div>
  );
}

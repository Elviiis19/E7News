import React, { useState, useEffect } from "react";
import { Instagram, MessageCircle, Mail, MapPin } from "lucide-react";

export default function ContactView() {
  const whatsappNumber = "5569981039664"; 
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Olá,%20acesssei%20o%20portal%20E7%20News%20e%20gostaria%20de%20falar%20com%20vocês.`;

  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [captchaAnswer, setCaptchaAnswer] = useState("");
  const [expectedAnswer, setExpectedAnswer] = useState(0);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Sugestão de Pauta");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    generateCaptcha();
    document.title = "Fale Conosco";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Entre em contato com o E7 News. Envie sugestões de pautas ou denúncias diretamente para a nossa redação.");
  }, []);

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 10) + 1;
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setExpectedAnswer(n1 + n2);
    setCaptchaAnswer("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaAnswer) !== expectedAnswer) {
      alert("Resposta de segurança incorreta. Tente novamente para provar que você não é um robô.");
      generateCaptcha();
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          message: `[${subject}]\n${message}`
        })
      });
      
      if (response.ok) {
        alert("Sua mensagem foi enviada com sucesso! Em breve retornaremos.");
        setName("");
        setEmail("");
        setSubject("Sugestão de Pauta");
        setMessage("");
      } else {
        alert("Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.");
      }
    } catch (error) {
      console.error(error);
      alert("Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.");
    } finally {
      setIsSubmitting(false);
      generateCaptcha();
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#09090b] font-sans min-h-screen transition-colors">
      <div className="w-full bg-zinc-950 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900 via-zinc-950 to-zinc-950"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="text-[#cc0000] dark:text-red-500 font-black uppercase tracking-widest text-xs md:text-sm mb-4 block">Fale com a Redação</span>
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
                <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 border-b-2 border-red-700 dark:border-red-500 inline-block pb-2 transition-colors">
                  Canais de Atendimento
                </h2>
                <div className="flex flex-col gap-6 mt-4">
                  
                  <a 
                    href={whatsappLink}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-green-200 dark:hover:border-green-800 hover:bg-green-50 dark:hover:bg-green-950/30 transition-colors group"
                  >
                    <div className="bg-[#25D366] text-white p-3 rounded-full mt-1 group-hover:scale-110 transition-transform">
                      <MessageCircle className="w-6 h-6 fill-current" />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1 transition-colors">WhatsApp Redação</span>
                      <strong className="text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-green-700 dark:group-hover:text-green-500 transition-colors block mb-1">
                        (69) 98103-9664
                      </strong>
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors">
                        Chat de atendimento rápido. Envie sua mensagem, fotos ou vídeos.
                      </span>
                    </div>
                  </a>

                  <a 
                    href="https://instagram.com/sitee7news" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 hover:border-pink-200 dark:hover:border-pink-800 hover:bg-pink-50 dark:hover:bg-pink-950/30 transition-colors group"
                  >
                    <div className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white p-3 rounded-full mt-1 group-hover:scale-110 transition-transform">
                      <Instagram className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1 transition-colors">Instagram Oficial</span>
                      <strong className="text-xl text-zinc-900 dark:text-zinc-100 group-hover:text-[#dc2743] dark:group-hover:text-pink-500 transition-colors block mb-1">
                        @sitee7news
                      </strong>
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors">
                        Acompanhe nossos stories e mande seu direct.
                      </span>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 transition-colors">
                    <div className="bg-zinc-900 dark:bg-zinc-800 text-white p-3 rounded-full mt-1">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="block text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-1 transition-colors">Localização</span>
                      <strong className="text-xl text-zinc-900 dark:text-zinc-100 block mb-1 transition-colors">
                        Monte Negro - RO
                      </strong>
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 transition-colors">
                        Sede de cobertura presencial e administrativa.
                      </span>
                    </div>
                  </div>

                </div>
             </div>
          </div>

          {/* Formulário de Contato */}
          <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl border border-zinc-100 dark:border-zinc-800 shadow-sm transition-colors">
             <h3 className="text-xl font-black uppercase tracking-tight text-zinc-900 dark:text-zinc-100 mb-6 transition-colors">Envie uma Mensagem</h3>
             <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Seu Nome completo</label>
                  <input type="text" id="name" required value={name} onChange={e => setName(e.target.value)} className="p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded outline-none focus:border-[#cc0000] dark:focus:border-red-500 focus:ring-1 focus:ring-[#cc0000] dark:focus:ring-red-500 transition-colors" placeholder="Ex: João da Silva"/>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">E-mail</label>
                  <input type="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} className="p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded outline-none focus:border-[#cc0000] dark:focus:border-red-500 focus:ring-1 focus:ring-[#cc0000] dark:focus:ring-red-500 transition-colors" placeholder="seu.email@exemplo.com"/>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Assunto</label>
                  <select id="subject" value={subject} onChange={e => setSubject(e.target.value)} className="p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded outline-none focus:border-[#cc0000] dark:focus:border-red-500 focus:ring-1 focus:ring-[#cc0000] dark:focus:ring-red-500 transition-colors">
                     <option value="Sugestão de Pauta">Sugestão de Pauta</option>
                     <option value="Denúncia">Denúncia</option>
                     <option value="Publicidade / Parcerias">Publicidade / Parcerias</option>
                     <option value="Outro assunto">Outro assunto</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Mensagem</label>
                  <textarea id="message" rows={5} required value={message} onChange={e => setMessage(e.target.value)} className="p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded outline-none focus:border-[#cc0000] dark:focus:border-red-500 focus:ring-1 focus:ring-[#cc0000] dark:focus:ring-red-500 transition-colors resize-y" placeholder="Escreva aqui detalhadamente..."></textarea>
                </div>

                {/* Anti-spam Check */}
                <div className="flex flex-col gap-1.5 p-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded transition-colors">
                  <label htmlFor="captcha" className="text-sm font-bold text-zinc-700 dark:text-zinc-300">
                    Verificação de Segurança: Quanto é {num1} + {num2}?
                  </label>
                  <input 
                    type="number" 
                    id="captcha" 
                    required 
                    value={captchaAnswer}
                    onChange={(e) => setCaptchaAnswer(e.target.value)}
                    className="p-3 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded outline-none focus:border-[#cc0000] dark:focus:border-red-500 focus:ring-1 focus:ring-[#cc0000] dark:focus:ring-red-500 transition-colors" 
                    placeholder="Sua resposta..."
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="mt-2 bg-[#cc0000] dark:bg-red-700 text-white font-black uppercase tracking-widest text-sm py-4 rounded hover:bg-red-800 dark:hover:bg-red-600 transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Mail className="w-5 h-5" /> {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                </button>
             </form>
          </div>

        </div>
      </div>
    </div>
  );
}

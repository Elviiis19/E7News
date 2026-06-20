import React from "react";
import { SystemSettings } from "../types";
import { Share2, MapPin, Feather, CheckCircle } from "lucide-react";

interface AboutViewProps {
  settings: SystemSettings;
  onNavigateBack?: () => void;
}

export default function AboutView({ settings, onNavigateBack }: AboutViewProps) {
  return (
    <div className="w-full bg-white font-sans min-h-screen">
      {/* Header Visual */}
      <div className="w-full bg-zinc-950 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900 via-zinc-950 to-zinc-950"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="text-[#cc0000] font-black uppercase tracking-widest text-xs md:text-sm mb-4 block">E7 NEWS • MONTE NEGRO / RO</span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
              Quem Somos
            </h1>
            <p className="text-lg md:text-xl text-zinc-300 font-medium max-w-2xl mx-auto leading-relaxed">
              Jornalismo independente, sério e com foco absoluto na verdade. A sua principal fonte de informações sobre Monte Negro e região.
            </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <article className="prose-editorial max-w-none prose-lg">
          
          <h2 className="flex items-center gap-3">
             <MapPin className="w-6 h-6 text-[#cc0000]" /> 
             Informação com Credibilidade e Foco em Rondônia
          </h2>
          <p>
            O <strong>E7 News</strong> é um portal de notícias dedicado a levar informação com transparência, agilidade e total imparcialidade. Nosso foco principal são os acontecimentos que moldam o município de <strong>Monte Negro</strong>, o Vale do Jamari e toda a região do estado de <strong>Rondônia (RO)</strong>.
          </p>
          <p>
            Em um cenário moldado pela velocidade da internet e, por vezes, pela desinformação, nosso compromisso central é com o <strong>jornalismo sério</strong> – pautado na verificação rigorosa dos fatos, na investigação aprofundada e na prestação de serviço ativa à nossa comunidade. Fundado em <strong>junho de 2026</strong>, consolidamos as melhores práticas em tecnologia e SEO para democratizar a informação.
          </p>

          <h2 className="flex items-center gap-3 mt-16">
            <Feather className="w-6 h-6 text-[#cc0000]" />
            O Fundador e Jornalista Responsável
          </h2>
          <p>
            O portal E7 News é orgulhosamente dirigido, editado e liderado por <strong>Elvis Dias de Carvalho</strong> (Registro Profissional DRT N° 1466/RO). Nascido em Ouro Preto do Oeste – RO, em 8 de junho de 1992, Elvis é um profissional com sólida trajetória na comunicação rondoniense e com profundas raízes na comunidade de Monte Negro.
          </p>
          <p>
            Sua atuação no jornalismo digital teve início em fevereiro de 2011 com a fundação do pioneiro portal <em>Enfoco Notícias</em>, um projeto inovador para a época, que se manteve online e em plena atividade informativa por mais de uma década. Essa jornada pavimentou sua credibilidade e consolidou vasta experiência na cobertura de fatos locais, investigações jornalísticas e desenvolvimentos regionais.
          </p>

          <h3>Especialista em Comunicação Institucional e Redes Sociais</h3>
          <p>
            Especialista no comportamento das novas mídias e no marketing digital, Elvis possui profundo conhecimento em comunicação pública e institucional.
          </p>

          <p>
            Hoje, por meio do portal <strong>E7 News</strong>, Elvis e sua equipe de redação aplicam toda a experiência técnica, visão estratégica e responsabilidade ética para garantir que a população conte com um conteúdo diariamente atualizado, respeitoso e de alta qualidade.
          </p>

          <div className="bg-zinc-50 border-l-4 border-[#cc0000] p-8 md:p-10 my-16 rounded-r-2xl shadow-sm">
            <span className="text-[#cc0000] font-black uppercase tracking-widest text-xs mb-3 block">
              Nossa Missão Institucional
            </span>
            <p className="text-xl md:text-2xl leading-relaxed text-zinc-900 font-bold m-0">
              "Fornecer um panorama claro, rápido e imparcial dos acontecimentos que impactam a vida em Monte Negro, fortalecendo o debate público, fomentando o desenvolvimento econômico da região e promovendo a cidadania através da informação segura e confiável."
            </p>
          </div>

          <h2>Nossos Valores Editoriais</h2>
          <ul className="list-none pl-0 space-y-4 mt-6">
             <li className="flex items-start gap-3">
               <CheckCircle className="w-6 h-6 text-[#cc0000] flex-shrink-0 mt-0.5" />
               <span><strong>Compromisso com a Verdade:</strong> Checagem dupla de fontes, combate assíduo a fakenews e responsabilidade perante a sociedade.</span>
             </li>
             <li className="flex items-start gap-3">
               <CheckCircle className="w-6 h-6 text-[#cc0000] flex-shrink-0 mt-0.5" />
               <span><strong>Foco no Munícipe:</strong> As necessidades, as histórias e os direitos da população de Monte Negro em primeiro plano.</span>
             </li>
             <li className="flex items-start gap-3">
               <CheckCircle className="w-6 h-6 text-[#cc0000] flex-shrink-0 mt-0.5" />
               <span><strong>Inovação Digital:</strong> Adoção irrestrita de tecnologias de ponta, velocidade de acesso Mobile e excelência em SEO para distribuição (2026).</span>
             </li>
          </ul>

        </article>

        {/* Share Section */}
        <div className="mt-16 pt-8 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-6">
           <div>
              <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">Siga o E7 News</p>
              <p className="text-zinc-800 font-medium mt-1">Acompanhe nossas páginas oficiais e fique por dentro instantaneamente.</p>
           </div>
           <div className="flex items-center gap-3">
              <button className="flex items-center justify-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded hover:bg-[#cc0000] transition-colors font-bold text-sm">
                <Share2 className="w-4 h-4" />
                Compartilhar a Página
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { Scale } from "lucide-react";

export default function TermsView() {
  React.useEffect(() => {
    document.title = "Termos de Uso";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Leia com atenção os Termos de Uso e as regras de utilização do E7 News.");
  }, []);

  return (
    <div className="w-full bg-white dark:bg-[#09090b] font-sans min-h-screen pb-20 transition-colors">
      <div className="w-full bg-zinc-950 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900 via-zinc-950 to-zinc-950"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Termos de Uso
            </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="prose-editorial max-w-none prose-lg text-zinc-700 dark:!text-zinc-300 dark:prose-p:!text-zinc-300 dark:prose-h2:!text-zinc-100 dark:prose-h3:!text-zinc-100 dark:prose-strong:!text-white dark:prose-li:!text-zinc-300 transition-colors">
          <div className="flex items-center gap-3 mb-8 text-[#cc0000] dark:text-red-500 transition-colors">
            <Scale className="w-8 h-8" />
            <h2 className="!mt-0 !mb-0 text-2xl font-black text-zinc-900 dark:text-zinc-100 transition-colors">Condições de Imparcialidade e Acesso</h2>
          </div>
          
          <p>
            Bem-vindo ao portal <strong>E7 News</strong>. Ao acessar e utilizar o nosso site, você concorda em cumprir e estar vinculado aos seguintes termos de uso e condições, de acordo com as leis vigentes no Brasil.
          </p>

          <h3>1. Natureza do Conteúdo</h3>
          <p>
            O E7 News produz e publica informações jornalísticas regionais com independência e foco nos acontecimentos de Monte Negro e estado de Rondônia. O conteúdo opinativo (quando houver) refletirá estritamente a posição da editoria do autor, diferenciando-se claramente de matérias puramente factuais.
          </p>

          <h3>2. Direitos de Propriedade Intelectual</h3>
          <p>
            Todo o conteúdo publicado, incluindo textos, fotografias próprias, gráficos e layout institucional, é de propriedade exclusiva do portal E7 News e/ou seus fundadores. Fica proibida a reprodução total ou parcial, a cópia ou a distribuição não-autorizada sem os devidos créditos e sem autorização expressa. A citação com hiperlink para nossa matéria original é sempre permitida.
          </p>

          <h3>3. Uso Aceitável do Usuário</h3>
          <p>Ao navegar pelo site ou comentar em nossas postagens, o usuário compromete-se a:</p>
          <ul>
            <li>Não utilizar linguagem caluniosa, difamatória, racista ou discriminatória;</li>
            <li>Não publicar spams, correntes ou links maliciosos;</li>
            <li>Não tentar fraudar os sistemas de interações;</li>
          </ul>

          <h3>4. Exatidão Editorial e Direito de Resposta</h3>
          <p>
            O E7 News preza pelo jornalismo fidedigno. Em caso de constatação de falhas informativas documentáveis, nossos leitores têm o direito de solicitar a checagem que, se pertinente, resultará na imediata errata e correção. Entendemos o direito de resposta como pilar da democracia, caso partes citadas demandem espaço justo de justificação com comprovações.
          </p>

          <h3>5. Confiabilidade dos Serviços Onlines</h3>
          <p>
            Não nos responsabilizamos pela indisponibilidade temporária do portal devido a manutenções essenciais de estrutura tecnológica. O E7 News atesta empregar os melhores esforços para manter a estabilidade 24 horas.
          </p>
        </article>
      </div>
    </div>
  );
}

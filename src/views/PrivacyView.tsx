import React from "react";
import { ShieldCheck, Calendar } from "lucide-react";

export default function PrivacyView() {
  React.useEffect(() => {
    document.title = "Política de Privacidade";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Conheça nossas diretrizes sobre o uso e a proteção dos seus dados pessoais no E7 News.");
  }, []);

  return (
    <div className="w-full bg-white dark:bg-[#09090b] font-sans min-h-screen pb-20 transition-colors">
      <div className="w-full bg-zinc-950 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900 via-zinc-950 to-zinc-950"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Política de Privacidade
            </h1>
            <p className="text-zinc-400 font-medium flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Última atualização: 19 de Junho de 2026
            </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="prose-editorial max-w-none prose-lg text-zinc-700 dark:!text-zinc-300 dark:prose-p:!text-zinc-300 dark:prose-h2:!text-zinc-100 dark:prose-h3:!text-zinc-100 dark:prose-strong:!text-white dark:prose-li:!text-zinc-300 transition-colors">
          <div className="flex items-center gap-3 mb-8 text-[#cc0000] dark:text-red-500">
            <ShieldCheck className="w-8 h-8" />
            <h2 className="!mt-0 !mb-0 text-2xl font-black text-zinc-900 dark:text-zinc-100">Nosso Compromisso com Seus Dados</h2>
          </div>
          
          <p>
            O portal <strong>E7 News</strong> valoriza a sua privacidade e se compromete a proteger os dados pessoais de seus usuários. Esta política de privacidade delineia as práticas de coleta, uso e proteção das informações quando você acessa nosso site.
          </p>

          <h3>1. Coleta de Informações</h3>
          <p>
            Coletamos informações que você nos fornece diretamente, como ao entrar em contato conosco através de nossos canais, bem como dados gerados automaticamente durante a sua navegação (como endereço IP, tipo de navegador, tempo de acesso e páginas visitadas) através do uso de cookies e tecnologias semelhantes para fins de analítica e melhoria de experiência.
          </p>

          <h3>2. Uso das Informações</h3>
          <p>
            As informações coletadas são utilizadas para:
          </p>
          <ul>
            <li>Fornecer, operar e manter nosso portal;</li>
            <li>Melhorar, personalizar e expandir nossa plataforma;</li>
            <li>Compreender e analisar como os usuários utilizam o site;</li>
            <li>Desenvolver novos produtos, serviços e funcionalidades;</li>
            <li>Garantir a segurança e prevenir fraudes.</li>
          </ul>

          <h3>3. Cookies e Tecnologias de Rastreamento</h3>
          <p>
            Utilizamos cookies para melhorar a experiência de navegação. Você pode configurar seu navegador para recusar todos os cookies ou indicar quando um cookie está sendo enviado. No entanto, se você não aceitar cookies, talvez não consiga usar algumas funcionalidades do nosso serviço.
          </p>

          <h3>4. Compartilhamento de Dados</h3>
          <p>
            O E7 News não vende, aluga ou compartilha suas informações pessoais com terceiros para fins comerciais sem o seu consentimento explícito, exceto conforme necessário para cumprir obrigações legais, regulatórias ou ordens judiciais.
          </p>

          <h3>5. Links para Sites de Terceiros</h3>
          <p>
            Nosso portal pode conter links para sites externos. Não somos responsáveis pelas práticas de privacidade desses sites. Encorajamos os usuários a lerem as declarações de privacidade de qualquer site que colete informações pessoais.
          </p>

          <h3>6. Segurança</h3>
          <p>
            Adotamos medidas de segurança técnicas e organizacionais adequadas para proteger seus dados pessoais contra acesso, alteração, divulgação ou destruição não autorizada.
          </p>

          <h3>7. Alterações nesta Política</h3>
          <p>
            Esta Política de Privacidade pode ser atualizada periodicamente. Recomendamos a visita frequente a esta página para que você tenha conhecimento sobre as modificações realizadas.
          </p>

          <div className="bg-zinc-50 dark:bg-zinc-900 border-l-4 border-[#cc0000] dark:border-red-500 p-6 mt-10 rounded-r-lg transition-colors">
            <h4 className="!mt-0 text-xl font-bold text-zinc-900 dark:text-zinc-100">Dúvidas?</h4>
            <p className="!mb-0">
              Se você tiver dúvidas sobre esta Política de Privacidade, entre em contato conosco através da nossa <a href="/contato" onClick={(e) => e.preventDefault()} className="text-[#cc0000] dark:text-red-500 hover:underline">página de contato</a>.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

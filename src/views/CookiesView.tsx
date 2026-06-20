import React from "react";
import { Cookie } from "lucide-react";

export default function CookiesView() {
  React.useEffect(() => {
    document.title = "Política de Cookies";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", "Conheça como utilizamos cookies para personalizar e melhorar a sua experiência no E7 News.");
  }, []);

  return (
    <div className="w-full bg-white dark:bg-[#09090b] font-sans min-h-screen pb-20 transition-colors">
      <div className="w-full bg-zinc-950 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900 via-zinc-950 to-zinc-950"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Política de Cookies
            </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <article className="prose-editorial max-w-none prose-lg text-zinc-700 dark:!text-zinc-300 dark:prose-p:!text-zinc-300 dark:prose-h2:!text-zinc-100 dark:prose-h3:!text-zinc-100 dark:prose-strong:!text-white dark:prose-li:!text-zinc-300 transition-colors">
          <div className="flex items-center gap-3 mb-8 text-[#cc0000] dark:text-red-500 transition-colors">
            <Cookie className="w-8 h-8" />
            <h2 className="!mt-0 !mb-0 text-2xl font-black text-zinc-900 dark:text-zinc-100 transition-colors">Uso de Tecnologias de Informação Local</h2>
          </div>
          
          <p>
            Para garantir o compromisso de transparência exigido pela Lei Geral de Proteção de Dados Pessoais (LGPD), esta Política de Cookies descreve o modo em que o portal E7 News trata e utiliza pequenos arquivos salvos em seu dispositivo.
          </p>

          <h3>1. O que são cookies?</h3>
          <p>
            Cookies são pequenos arquivos de texto, formados por letras e números, instalados no navegador do seu dispositivo (computador, smartphone ou tablet). Eles armazenam o histórico e os rastros de conexão, permitindo, por exemplo, o acesso ágil em futuras visitas à plataforma.
          </p>

          <h3>2. Por que os utilizamos?</h3>
          <p>O portal E7 News os utiliza para as seguintes finalidades:</p>
          <ul>
            <li><strong>Cookies Estritamente Necessários:</strong> Fundamentais para a segurança do portal e para que os recursos operem sem interrupções. Sem estes, a página poderia apresentar instabilidades.</li>
            <li><strong>Cookies de Desempenho e Analíticos:</strong> Ferramentas como serviços analíticos nos ajudam a descobrir as preferências de leitura dos nossos usuários. Coletamos dados estatísticos anonimizados (cidade natal, quais matérias mais lidas) para continuar produzindo um jornalismo do interesse da população de Monte Negro e região.</li>
            <li><strong>Cookies de Funcionalidade:</strong> Armazenar predefinições (exemplo: aceite ou recusa do disclaimer de cookies para que não apareça novamente).</li>
          </ul>

          <h3>3. Posso apagar os cookies?</h3>
          <p>
            Sim. A qualquer momento você pode eliminar dados guardados, restringir ou desativar os cookies no painel de configurações do seu navegador web. Contudo, desabilitá-los por completo poderá reduzir as facilidades de acesso.
          </p>

          <h3>4. Contato</h3>
          <p>
            Para sanar dúvidas sobre armazenamento técnico dos componentes ou qualquer tema de segurança de sua navegação conforme as determinações brasileiras (LGPD), nos contate através das opções sinalizadas na página Fale Conosco.
          </p>
        </article>
      </div>
    </div>
  );
}

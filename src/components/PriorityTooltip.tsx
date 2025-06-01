
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PriorityTooltipProps {
  priority: number;
  children: React.ReactNode;
}

const PRIORITY_DESCRIPTIONS = {
  1: "Concedida aos militares e servidores civis do COMAER, extensivo aos seus dependentes, destinados à internação em estabelecimento hospitalar ou que dele tenham tido alta, bem como ao acompanhante de enfermo - um familiar, um médico e/ou enfermeiro ± quando sua presença for absolutamente necessária. A referida prioridade será concedida mediante a apresentação de documento comprobatório emitido por Órgão de Saúde da Aeronáutica.",
  2: "Concedida aos militares e servidores civis do COMAER que necessitem viajar a serviço, dentro da ordem hierárquica e da equivalência prevista em norma específica, mediante apresentação de documento comprobatório de viagem a serviço.",
  3: "Concedida aos militares e servidores civis do COMAER, extensivo aos seus dependentes, bem como a um acompanhante, quando for o caso, para consulta ou tratamento médico em Organização ou Estabelecimento de Saúde situado em outra localidade, desde que haja documento comprobatório, emitido por Órgão de Saúde da Aeronáutica.",
  4: "Destinada aos Comandantes das Organizações Militares responsáveis pela administração do PCAN local, para ser concedida em atendimento de casos especiais, até o limite de vinte por cento da disponibilidade das vagas CAN no trecho considerado.",
  5: "Concedida aos militares do COMAER, da ativa, e aos seus dependentes, quando por eles acompanhados, dentro da ordem hierárquica, nos casos previstos no RISAER e atendendo à seguinte ordem: a) luto; b) núpcias; c) férias; e d) dispensa do serviço.",
  6: "Concedida a militares do COMAER, da ativa e veteranos, e aos respectivos dependentes que os acompanhem, respeitada a precedência hierárquica prevista no Estatuto dos Militares.",
  7: "Concedida aos dependentes de militares do COMAER, bem como aos seus pensionistas, desde que comprovado o recebimento da pensão, e respeitada a precedência hierárquica do solicitante, prevista no Estatuto dos Militares, que estejam viajando sem o acompanhamento do referido militar. Entram nesta prioridade os servidores civis do COMAER e seus dependentes que os estejam acompanhando, observada a precedência dos diversos níveis funcionais.",
  8: "Concedida aos militares dos Comandos da Marinha e do Exército, respeitada a precedência hierárquica prevista no Estatuto dos Militares, em objeto de serviço, mediante solicitação do Comandante de sua OM.",
  9: "Concedida aos militares das Forças Auxiliares, respeitada a precedência hierárquica, em objeto de serviço, dentro de sua área de jurisdição, mediante solicitação do Comandante de sua OM.",
  10: "Concedida aos militares dos Comandos da Marinha e do Exército, bem como aos seus dependentes, desde que acompanhados daqueles, respeitada a precedência hierárquica prevista no Estatuto dos Militares.",
  11: "Concedida aos militares das Forças Auxiliares, estendidas também aos seus dependentes, desde que acompanhados daqueles, respeitada a precedência hierárquica. Serão incluídas, ainda, nesta prioridade as polícias civil, federal, ferroviária, rodoviária e agentes semelhantes.",
  12: "Concedida aos dependentes de servidores civis do COMAER, que estejam viajando desacompanhados do servidor, observada a precedência dos diversos níveis funcionais.",
  13: "Concedida aos demais cidadãos brasileiros."
};

const PriorityTooltip = ({ priority, children }: PriorityTooltipProps) => {
  const description = PRIORITY_DESCRIPTIONS[priority as keyof typeof PRIORITY_DESCRIPTIONS];

  if (!description) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          className="max-w-md p-3 text-sm z-50" 
          side="top"
          sideOffset={5}
          avoidCollisions={true}
          collisionPadding={10}
        >
          <div className="font-semibold mb-2">PRIORIDADE {priority}</div>
          <div className="whitespace-normal break-words">{description}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PriorityTooltip;

import { CampoFiltro } from "../filtro-data-table/filtro-data-table/filtro-data-table.component";

export function pegarLabelFiltroAplicado(campo: any, camposFiltro: CampoFiltro[]): string {
  const campoAplicado = camposFiltro.find(f => f.value == campo);
  return campoAplicado?.label ?? '';
}

export function formatarOperadoresFiltroAplicado(operador: any): string {
  let operadorFormatado = operador;

   switch (operadorFormatado) {
    case 'IGUAL': return '=';
    case 'DIFERENTE': return '!=';
    case 'CONTEM': return '~';
    case 'NAO_CONTEM': return '!~';
    case 'COMECA_COM': return '%>';
    case 'TERMINA_COM': return '<%';
    case 'MAIOR_QUE': return '>';
    case 'MENOR_QUE': return '<';
    case 'MAIOR_IGUAL': return '>=';
    case 'MENOR_IGUAL': return '<=';
  }

  return operadorFormatado;
}

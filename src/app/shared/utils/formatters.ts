export function formatBoolean(value: boolean): string {
  return value ? 'Sim' : 'Não';
}

export function formatDate(dataIso: string): string {
  if (!dataIso) return '';
  const [ano, mes, dia] = dataIso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function formatCelular(valor: string): string {
  if (!valor) return '';

  const numeros = valor.replace(/\D/g, '');

  if (numeros.length !== 11 && numeros.length !== 10) return valor;

  const ddd = numeros.slice(0, 2);
  const parte1 = numeros.length === 11 ? numeros.slice(2, 7) : numeros.slice(2, 6);
  const parte2 = numeros.length === 11 ? numeros.slice(7) : numeros.slice(6);

  return `(${ddd}) ${parte1}-${parte2}`;
}

export function formatCpfCnpj(valor: string): string {
  if (!valor) return '';
  const numeros = valor.replace(/\D/g, '');

  if (numeros.length === 11) {
    return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

  if (numeros.length === 14) {
    return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }

  return valor;
}

export function formatCep(valor: string): string {
  if (!valor) return '';

  const numeros = valor.replace(/\D/g, '');

  if (numeros.length === 8) {
    return numeros.replace(/(\d{5})(\d{3})/, '$1-$2');
  }

  return valor;
}

export function formatDateTime(value: string): string {
  if (!value || value === '0001-01-01T00:00:00.000Z') return '';

  const date = new Date(value);
  const pad = (n: number) => n.toString().padStart(2, '0');

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function removerMascara(valor: string): string {
  return valor.replace(/\D/g, '');
}

export function formatGenericValue(valor: any, tipo: string): string {
  if (tipo === 'boolean') {
    return formatBoolean(valor === true || valor === 'true');
  }

  if (tipo === 'date') {
    return formatDate(valor);
  }

  return valor;
}

export function formatarComMascara(valor: string, mascara: string): string {
  if (!valor) return '';

  let resultado = '';
  let index = 0;

  for (const m of mascara) {
    if (m === '0') {
      if (index < valor.length) {
        resultado += valor[index++];
      } else {
        break;
      }
    } else {
      resultado += m;
    }
  }

  return resultado;
}

export function converterObejetoParaRequisicao(campos: string): any {
  const regex = /(\w+)\s*=\s*([^,}]+)/g;
  const result: any = {};
  let match;

  const camposIgnorados = ['id', 'createdAt', 'updatedAt'];

  while ((match = regex.exec(campos)) !== null) {
    const keyOriginal = match[1];
    const key = keyOriginal.charAt(0).toLowerCase() + keyOriginal.slice(1);

    if (camposIgnorados.includes(key)) continue;

    let value: any = match[2].trim();

    if (value === 'True' || value === 'true') {
      value = true;
    } else if (value === 'False' || value === 'false') {
      value = false;
    } else if (/\d{2}\/\d{2}\/\d{4}( \d{2}:\d{2}:\d{2})?/.test(value)) {
      const parts = value.split(/\/| |:/);
      const [day, month, year] = parts;
      value = `${year}-${month}-${day}`;
    } else if (key === 'cep') {
      // Tratamento específico para o CEP
      value = value.replace(/-/g, ''); // Remove o hífen
    } else if (/^\d+$/.test(value)) {
      value = value.startsWith('0') ? value : Number(value);
    }

    result[key] = value;
  }

  return result;
}


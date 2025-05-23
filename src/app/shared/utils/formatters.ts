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

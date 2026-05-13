export const cpfMask = (value: string) =>
  value.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')

export const phoneMask = (value: string) =>
  value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4,5})(\d{4})$/, '$1-$2')

export const cepMask = (value: string) =>
  value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2')

export const onlyNumbers = (value: string) => value.replace(/\D/g, '')

export function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, '')
  if (numbers.length !== 11) return false
  if (/^(\d)\1{10}$/.test(numbers)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(numbers[i]) * (10 - i)
  let digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  if (digit !== parseInt(numbers[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(numbers[i]) * (11 - i)
  digit = 11 - (sum % 11)
  if (digit > 9) digit = 0
  return digit === parseInt(numbers[10])
}

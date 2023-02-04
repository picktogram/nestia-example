export function generateRandomNumber(min: number, max: number, isNumberString: true): string;
export function generateRandomNumber(min: number, max: number, isNumberString: false): number;
export function generateRandomNumber(min: number, max: number, isNumberString = false): number | string {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return isNumberString ? String(randomNumber) : randomNumber;
}

import React, { useState } from 'react';

interface RutInputProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

const RutInput: React.FC<RutInputProps> = ({ value, onChange }) => {
  const [error, setError] = useState<string>('');

  const formatRut = (value: string): string => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 1) return cleaned;
    
    let result = cleaned.slice(-1);
    if (cleaned.length > 1) {
      result = `-${result}`;
      let body = cleaned.slice(0, -1);
      while (body.length > 3) {
        result = `.${body.slice(-3)}${result}`;
        body = body.slice(0, -3);
      }
      result = body + result;
    }
    return result;
  };

  const validateRut = (rut: string): boolean => {
    // Remove dots and validate format
    const cleanRut = rut.replace(/\./g, '');
    if (!/^[0-9]+-[0-9kK]$/.test(cleanRut)) return false;

    const [numStr, dv] = cleanRut.split('-');
    const num = parseInt(numStr, 10);
    
    // Validate number range
    if (num < 1000000 || num > 99999999) return false;
    
    const dvExpected = calculateDV(num);
    return dvExpected.toLowerCase() === dv.toLowerCase();
  };

  const calculateDV = (num: number): string => {
    const sequence = [2, 3, 4, 5, 6, 7];
    let sum = 0;
    let index = 0;
    
    // Convert number to string and reverse it
    const digits = String(num).split('').reverse();
    
    // Calculate sum
    for (let digit of digits) {
      sum += parseInt(digit) * sequence[index];
      index = (index + 1) % sequence.length;
    }
    
    // Calculate DV
    const dv = 11 - (sum % 11);
    
    if (dv === 11) return '0';
    if (dv === 10) return 'k';
    return String(dv);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\dkK-]/g, '');
    const formatted = formatRut(rawValue);
    
    if (formatted.length >= 10) {
      const isValid = validateRut(formatted);
      setError(isValid ? '' : 'RUT inválido');
      onChange(formatted, isValid);
    } else {
      setError('');
      onChange(formatted, false);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="rut">
        RUT
      </label>
      <input
        id="rut"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="12.345.678-9"
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          error ? 'border-red-500' : ''
        }`}
        maxLength={12}
      />
      {error && <p className="text-red-500 text-xs italic">{error}</p>}
    </div>
  );
};

export default RutInput;
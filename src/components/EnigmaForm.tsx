'use client';

import { useState, useEffect } from 'react';
import { EnigmaData, EnigmaFormData } from '@/types/enigma';

interface EnigmaFormProps {
  enigmaId: string;
  enigmaData: EnigmaData;
}

export default function EnigmaForm({ enigmaId, enigmaData }: EnigmaFormProps) {
  const [formData, setFormData] = useState<EnigmaFormData>({});
  const [isAllCorrect, setIsAllCorrect] = useState(false);

  useEffect(() => {
    // Check if all passwords are correct
    const correctCount = enigmaData.passwords.reduce((count, password, index) => {
      return formData[index.toString()] === password ? count + 1 : count;
    }, 0);
    setIsAllCorrect(correctCount === enigmaData.passwords.length);
  }, [formData, enigmaData.passwords]);

  const handleInputChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [index.toString()]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission is handled by state changes
  };

  const getInputClass = (index: number): string => {
    const value = formData[index.toString()] || '';
    const password = enigmaData.passwords[index];

    if (value === '') return '';
    return value === password ? 'input-good' : 'input-bad';
  };

  return (
    <>
      <p className="enigma-title">{enigmaId}</p>
      <form onSubmit={handleSubmit}>
        {enigmaData.passwords.map((_, index) => {
          const value = formData[index.toString()] || '';
          return (
            <div key={index} className="field">
              <label htmlFor={`input-${index}`}>{index + 1}</label>
              <input
                id={`input-${index}`}
                name={index.toString()}
                type="text"
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className={getInputClass(index)}
              />
            </div>
          );
        })}
        <input type="submit" value="Envoyer" />
      </form>
      {isAllCorrect && (
        <p className="reward">{enigmaData.reward}</p>
      )}
    </>
  );
}
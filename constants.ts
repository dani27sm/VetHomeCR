
import { Species } from './types';

export const DOG_BREEDS = [
  "Labrador Retriever", "Pastor Alemán", "Golden Retriever", "French Bulldog", 
  "Beagle", "Poodle", "Rottweiler", "Yorkshire Terrier", "Boxer", "Chihuahua",
  "Dachshund", "Siberian Husky", "Zaguatito (Mezcla)", "Border Collie", "Shih Tzu"
];

export const CAT_BREEDS = [
  "Persa", "Maine Coon", "Siamés", "Bengala", "Abisinio", "Ragdoll", 
  "Sphynx", "British Shorthair", "Común Europeo", "Azul Ruso", "Munchkin", "Zaguate (Mezcla)"
];

export const MOCK_CABYS = [
  { id: '1', code: '0121100000000', name: 'Consulta General Veterinaria', price: 25000, taxRate: 0.04, type: 'service' },
  { id: '2', code: '0121100000100', name: 'Vacuna Nobivac DHPPi', price: 15000, taxRate: 0.01, type: 'product' },
  { id: '3', code: '0121100000200', name: 'Vacuna Rabia', price: 12000, taxRate: 0.01, type: 'product' },
  { id: '4', code: '0121100000300', name: 'Desparasitación Interna', price: 8000, taxRate: 0.13, type: 'service' },
  { id: '5', code: '0121100000400', name: 'Limpieza Dental Especializada', price: 45000, taxRate: 0.04, type: 'service' }
];



export interface DatosSalud {
  edad: number;
  peso: number;
  altura: number;
  condiciones: { cardiaca: boolean; diabetica: boolean; articular: boolean };
  impedimento: string;
  actividad: string;
  imc: number;
  dias: { nombre: string; seleccionado: boolean }[];
}

export interface clienteData{
  id:number,
  nombre:string,
  apellido:string,
}


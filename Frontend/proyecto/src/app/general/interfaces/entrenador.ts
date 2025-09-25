export interface Ejercicio {
  id: number;
  nombre: string;
  descripcion: string;
  completado?: boolean
}

export interface Rutina {
  ejercicio: Ejercicio,
  series: number,
  repeticiones: number,
}

export interface ejercicioDiario {
  idRutina?: number,
  nombreRutina: string,
  rutinas: Rutina[]
}

export interface RutinaPreescrita {
  id: number;
  nombre: string;
  fecha_creacion: string;
}

export interface asignacion {
  idUsuario: number,
  idPreescrita: number,
  fechaInicio?: Date,
  fechaFin?: Date
};
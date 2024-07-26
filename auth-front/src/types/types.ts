export interface AuthResponse {
    body: {
        user: User;
        accessToken: string;
        refreshToken: string;
    };

}

export interface AuthResponseError {
    error: string;
    body: {
        error: string;
    }
}

export interface User {
    _id: string;
    id: string;
    name: string;
    username: string;
    role: string;
}

export interface AccessTokenResponse {
    statusCode: number;
    body: {
        accessToken: string;
    };
    error?: string;
}

export interface PruebasRealizadas {
    compartimento: 'C1' | 'C2' | 'C3';
    color?: boolean;
    olor?: boolean;
    sabor?: boolean;
    alcohol?: boolean;
    acidez?: string;
    densidad?: string;
    temperatura?: string;
    mastitis?: string;
    otros?: string;
}

export interface Tanquero {
    _id: string;
    fecha: Date;
    numero: string;
    centroAcopio: string;
    cantidadRecibo: number;
    cantidadRegla: number;
    diferencia: number;
    totalLitros: number;
    compartimento: string;
    muestraTipo: string;
    estado: 'nuevo' | 'aprovado';
    pruebasRealizadas: PruebasRealizadas[];
    observaciones?: string;
    reserva?: string;
}
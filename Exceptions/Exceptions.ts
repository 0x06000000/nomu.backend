export class NotFoundException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'NotFoundException';
    }
}   

export class UnauthorizedException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UnauthorizedException';
    }
}

export class ForbiddenException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ForbiddenException'; 
    }
}

export class BadRequestException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BadRequestException';
    }
}

export class ConflictException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConflictException';
    }
}

export class ValidationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationException';
    }
}

export class InternalServerErrorException extends Error {
    constructor(message: string = '서버 내부 오류가 발생했습니다.') {
        super(message);
        this.name = 'InternalServerErrorException';
    }
}

import { Prisma } from "@/src/generated/prisma";

export type FilterOptions<T> = {
    search?: string;
    fields?: (keyof T)[];
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDirection?: 'desc' | 'asc';
}

export function buildPagination<T extends Record<string, any>>(
    filter: FilterOptions<T>,
): {
    skip?: number;
    take?: number;
    orderBy?: {
        [key: string]: string;
    };
} {
    const result: any = {
    };

    if (filter.skip !== undefined) {
        result.skip = filter.skip;
    }

    if (filter.take !== undefined) {
        result.take = filter.take;
    }

    if (filter.orderBy) {
        result.orderBy = {
            [filter.orderBy]: filter.orderDirection || 'asc'
        };
    }

    return result;
}

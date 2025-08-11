import { createPrismaClient } from "@/lib/prisma";
import { ISiteAttendanceRepository, SiteAttendanceWithRelations } from "@/Repositories/Interfaces/ISiteAttendanceRepository";
import { PrismaClient, SiteAttendance } from "@/src/generated/prisma";
import { D1Database } from "@cloudflare/workers-types";

export class SiteAttendanceRepository implements ISiteAttendanceRepository {
    private prisma: PrismaClient;
    constructor(db: D1Database) {
        this.prisma = createPrismaClient(db);
    }

    async addMany(talentPoolId: number, siteAttendances: { siteId: number, date: Date, startTime: Date, endTime: Date, amount: number }[]): Promise<SiteAttendanceWithRelations[]> {
        const createdSiteAttendances = await this.prisma.siteAttendance.createMany({
            data: siteAttendances.map(attendance => ({
                talentPoolId,
                siteId: attendance.siteId,
                date: attendance.date,
                startTime: attendance.startTime, 
                endTime: attendance.endTime,
                amount: attendance.amount
            }))
        });

        // createMany는 relations를 포함하지 않으므로 별도로 조회
        const result = await this.prisma.siteAttendance.findMany({
            where: {
                talentPoolId,
                id: {
                    gte: createdSiteAttendances.count // 방금 생성된 레코드들
                }
            },
            include: {
                site: true,
                talentPool: true
            }
        });

        return result;
    }

    async processBatch(talentPoolId: number, operations: {
        upsert?: { id?: number, siteId: number, date: Date, startTime: Date, endTime: Date, amount: number }[],
        delete?: number[]
    }): Promise<SiteAttendanceWithRelations[]> {
        try {
            const updatedRecords: SiteAttendanceWithRelations[] = [];
            const rollbackOperations: (() => Promise<void>)[] = [];

            // 삭제 작업 수행
            if (operations.delete?.length) {
                for (const id of operations.delete) {
                    try {
                        const recordToDelete = await this.prisma.siteAttendance.findUnique({
                            where: { id },
                            include: { site: true, talentPool: true }
                        });
                        if (!recordToDelete) continue;

                        await this.prisma.siteAttendance.delete({
                            where: { id }
                        });
                        
                        rollbackOperations.push(async () => {
                            await this.prisma.siteAttendance.create({
                                data: {
                                    talentPoolId: recordToDelete.talentPoolId,
                                    siteId: recordToDelete.siteId,
                                    date: recordToDelete.date,
                                    startTime: recordToDelete.startTime,
                                    endTime: recordToDelete.endTime,
                                    amount: recordToDelete.amount
                                }
                            });
                        });
                    } catch (error) {
                        // 롤백 실행
                        for (const rollback of rollbackOperations.reverse()) {
                            await rollback();
                        }
                        throw error;
                    }
                }
            }

            // upsert 작업 수행 
            if (operations.upsert?.length) {
                for (const attendance of operations.upsert) {
                    try {
                        const upserted = await this.prisma.siteAttendance.upsert({
                            where: {
                                id: attendance.id ?? -1 // id가 없으면 create로 처리되도록
                            },
                            create: {
                                talentPoolId,
                                siteId: attendance.siteId,
                                date: attendance.date,
                                startTime: attendance.startTime,
                                endTime: attendance.endTime,
                                amount: attendance.amount
                            },
                            update: {
                                date: attendance.date,
                                startTime: attendance.startTime,
                                endTime: attendance.endTime,
                                amount: attendance.amount
                            },
                            include: {
                                site: true,
                                talentPool: true
                            }
                        });
                        updatedRecords.push(upserted);

                        if (attendance.id) {
                            // 기존 레코드 업데이트인 경우
                            const originalRecord = await this.prisma.siteAttendance.findUnique({
                                where: { id: attendance.id }
                            });
                            if (originalRecord) {
                                rollbackOperations.push(async () => {
                                    await this.prisma.siteAttendance.update({
                                        where: { id: attendance.id },
                                        data: {
                                            date: originalRecord.date,
                                            startTime: originalRecord.startTime,
                                            endTime: originalRecord.endTime,
                                            amount: originalRecord.amount
                                        }
                                    });
                                });
                            }
                        } else {
                            // 새로 생성된 레코드인 경우
                            rollbackOperations.push(async () => {
                                await this.prisma.siteAttendance.delete({ where: { id: upserted.id } });
                            });
                        }
                    } catch (error) {
                        // 롤백 실행
                        for (const rollback of rollbackOperations.reverse()) {
                            await rollback();
                        }
                        throw error;
                    }
                }
            }

            return updatedRecords;
        } catch (error) {
            throw error;
        }
    }

    async add(siteId: number, talentPoolId: number, date: Date, startTime: Date, endTime: Date, amount: number): Promise<SiteAttendanceWithRelations> {
        const siteAttendance = await this.prisma.siteAttendance.create({
            data: {
                siteId,
                talentPoolId,
                date,
                startTime,
                endTime,
                amount,
            },
            include: {
                site: true,
                talentPool: true,
            },
        });

        return siteAttendance;
    }

    async update(id: number, siteId: number, date: Date, startTime: Date, endTime: Date, amount: number): Promise<SiteAttendanceWithRelations> {
        const updatedSiteAttendance = await this.prisma.siteAttendance.update({
            where: { id },
            data: { siteId, date, startTime, endTime, amount },
            include: {
                site: true,
                talentPool: true,
            },
        });

        return updatedSiteAttendance;
    }

    async delete(id: number): Promise<void> {
        await this.prisma.siteAttendance.delete({
            where: { id },
        });
    }

    async getByTalentPoolId(talentPoolId: number): Promise<SiteAttendanceWithRelations[]> { 
        const siteAttendances = await this.prisma.siteAttendance.findMany({
            where: { talentPoolId },
            include: {
                site: true,
                talentPool: true,
            },
        });

        return siteAttendances;
    }

    async getByDayLaborerId(dayLaborerId: number): Promise<SiteAttendanceWithRelations[]> {
        const siteAttendances = await this.prisma.siteAttendance.findMany({
            where: { talentPool: { dayLaborers: { some: { id: dayLaborerId } } } },
            include: {
                site: true,
                talentPool: true,
            },
        });

        return siteAttendances;
    }

    async getByEmployeeId(employeeId: number): Promise<SiteAttendanceWithRelations[]> {
        const siteAttendances = await this.prisma.siteAttendance.findMany({
            where: { talentPool: { employees: { some: { id: employeeId } } } },
            include: {
                site: true,
                talentPool: true,
            },
        });

        return siteAttendances;
    }

    async getBySiteId(siteId: number): Promise<SiteAttendanceWithRelations[]> {
        const siteAttendances = await this.prisma.siteAttendance.findMany({
            where: { siteId },
            include: {
                site: true,
                talentPool: true,
            },
        });

        return siteAttendances;
    }

    async getById(id: number): Promise<SiteAttendanceWithRelations | null> {
        const siteAttendance = await this.prisma.siteAttendance.findUnique({
            where: { id },
            include: {
                site: true,
                talentPool: true,
            },
        });

        return siteAttendance;
    }
}   
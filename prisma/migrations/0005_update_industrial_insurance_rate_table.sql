-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CompanyIndustryCode" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "companyId" INTEGER NOT NULL,
    "industryCode" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CompanyIndustryCode_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CompanyIndustryCode_industryCode_fkey" FOREIGN KEY ("industryCode") REFERENCES "IndustrialAccidentInsurancePremiumRate" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_CompanyIndustryCode" ("companyId", "createdAt", "id", "industryCode", "updatedAt") SELECT "companyId", "createdAt", "id", "industryCode", "updatedAt" FROM "CompanyIndustryCode";
DROP TABLE "CompanyIndustryCode";
ALTER TABLE "new_CompanyIndustryCode" RENAME TO "CompanyIndustryCode";
CREATE TABLE "new_IndustrialAccidentInsurancePremiumRate" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstLevel" TEXT,
    "firstLevelCode" INTEGER,
    "secondLevel" TEXT,
    "secondLevelCode" INTEGER,
    "industryName" TEXT,
    "industryCode" INTEGER,
    "date" TEXT,
    "rate" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_IndustrialAccidentInsurancePremiumRate" ("createdAt", "date", "firstLevel", "firstLevelCode", "id", "rate", "secondLevel", "secondLevelCode", "updatedAt") SELECT "createdAt", "date", "firstLevel", "firstLevelCode", "id", "rate", "secondLevel", "secondLevelCode", "updatedAt" FROM "IndustrialAccidentInsurancePremiumRate";
DROP TABLE "IndustrialAccidentInsurancePremiumRate";
ALTER TABLE "new_IndustrialAccidentInsurancePremiumRate" RENAME TO "IndustrialAccidentInsurancePremiumRate";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

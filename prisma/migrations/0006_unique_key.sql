-- CreateIndex
CREATE UNIQUE INDEX "IndustrialAccidentInsurancePremiumRate_firstLevel_firstLevelCode_secondLevel_secondLevelCode_industryName_industryCode_date_key" ON "IndustrialAccidentInsurancePremiumRate"("firstLevel", "firstLevelCode", "secondLevel", "secondLevelCode", "industryName", "industryCode", "date");

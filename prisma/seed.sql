BEGIN TRANSACTION;

-- Seed base user for membership/ownership
INSERT INTO "User" ("email", "createdAt", "updatedAt")
VALUES ('seed.owner@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Seed a workspace
INSERT INTO "Workspace" ("name", "createdAt", "updatedAt")
VALUES ('Filter Test Workspace', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Link user to workspace as member
INSERT INTO "WorkspaceMember" ("workspaceId", "userId", "createdAt", "updatedAt")
VALUES (
  (SELECT "id" FROM "Workspace" ORDER BY "id" DESC LIMIT 1),
  (SELECT "id" FROM "User" ORDER BY "id" DESC LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Set the member as owner of the workspace (optional but useful)
INSERT INTO "WorkspaceOwner" ("workspaceId", "workspaceMemberId", "createdAt", "updatedAt")
VALUES (
  (SELECT "id" FROM "Workspace" ORDER BY "id" DESC LIMIT 1),
  (SELECT "id" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1),
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert 30 companies linked to the workspace and the member
WITH w AS (
  SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1
), m AS (
  SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1
)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 1', 'Seoul 1', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (
  SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1
), m AS (
  SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1
)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 2', 'Seoul 2', 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (
  SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1
), m AS (
  SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1
)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 3', 'Seoul 3', 7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (
  SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1
), m AS (
  SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1
)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 4', 'Seoul 4', 18, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (
  SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1
), m AS (
  SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1
)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 5', 'Seoul 5', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (
  SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1
), m AS (
  SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1
)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 6', 'Busan 1', 22, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (
  SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1
), m AS (
  SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1
)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 7', 'Busan 2', 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (
  SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1
), m AS (
  SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1
)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 8', 'Busan 3', 14, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (
  SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1
), m AS (
  SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1
)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 9', 'Busan 4', 27, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (
  SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1
), m AS (
  SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1
)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 10', 'Busan 5', 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

-- 20 more
WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 11', 'Incheon 1', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 12', 'Incheon 2', 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 13', 'Incheon 3', 16, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 14', 'Incheon 4', 21, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 15', 'Incheon 5', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 16', 'Daegu 1', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 17', 'Daegu 2', 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 18', 'Daegu 3', 19, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 19', 'Daegu 4', 13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 20', 'Daegu 5', 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 21', 'Daejeon 1', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 22', 'Daejeon 2', 17, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 23', 'Daejeon 3', 24, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 24', 'Daejeon 4', 29, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 25', 'Daejeon 5', 10, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 26', 'Gwangju 1', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 27', 'Gwangju 2', 23, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 28', 'Gwangju 3', 28, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 29', 'Gwangju 4', 15, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

WITH w AS (SELECT "id" AS "workspaceId" FROM "Workspace" ORDER BY "id" DESC LIMIT 1), m AS (SELECT "id" AS "workspaceMemberId" FROM "WorkspaceMember" ORDER BY "id" DESC LIMIT 1)
INSERT INTO "Company" ("workspaceId", "name", "location", "employeeCount", "createdAt", "updatedAt", "createdBy")
SELECT w."workspaceId", 'Company 30', 'Gwangju 5', 26, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, m."workspaceMemberId" FROM w, m;

COMMIT;



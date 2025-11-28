-- Added StudentDiscipline and DisciplineMaterial for student library
CREATE TABLE "StudentDiscipline" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StudentDiscipline_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "DisciplineMaterial" (
    "id" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER,
    "fileType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "DisciplineMaterial_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "StudentDiscipline_order_idx" ON "StudentDiscipline"("order");
CREATE INDEX "DisciplineMaterial_disciplineId_idx" ON "DisciplineMaterial"("disciplineId");

ALTER TABLE "DisciplineMaterial"
ADD CONSTRAINT "DisciplineMaterial_disciplineId_fkey"
FOREIGN KEY ("disciplineId")
REFERENCES "StudentDiscipline"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

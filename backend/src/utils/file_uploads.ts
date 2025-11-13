import fs from "fs";
import path from "path";

export const uploadFileCustom = (file: Express.Multer.File, folder: string): string => {
  if (!file) return "";

  const uploadDir = path.join(__dirname, `../../public/assets${folder}`);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${Date.now()}-${file.originalname}`;
  const filePath = path.join(uploadDir, fileName);

  fs.writeFileSync(filePath, file.buffer);

  return `assets${folder}/${fileName}`;
};

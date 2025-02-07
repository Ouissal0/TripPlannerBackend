import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import * as crypto from 'crypto';

@Injectable()
export class UploadService {
  private readonly uploadDir = join(process.cwd(), 'uploads');

  constructor() {
    // Ensure upload directory exists
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async saveImage(file: Express.Multer.File): Promise<string> {
    const fileHash = crypto.randomBytes(16).toString('hex');
    const extension = file.originalname.split('.').pop();
    const fileName = `${fileHash}.${extension}`;
    const filePath = join(this.uploadDir, fileName);
    
    await fs.writeFile(filePath, file.buffer);
    
    return fileName;
  }

  async deleteImage(fileName: string): Promise<void> {
    const filePath = join(this.uploadDir, fileName);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      // File might not exist, ignore error
    }
  }
}

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export class S3Service {
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
    this.bucketName = process.env.AWS_S3_BUCKET_NAME || 'book-my-place';
  }

  async uploadImage(
    imageBuffer: Buffer,
    fileName: string,
    contentType: string = 'image/jpeg'
  ): Promise<string> {
    const key = `images/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: imageBuffer,
      ContentType: contentType,
      Metadata: {
        uploadedAt: new Date().toISOString(),
      },
    });

    try {
      await this.s3Client.send(command);
      console.log(`Uploaded image to S3: ${key}`);
      return key;
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      throw error;
    }
  }

  async getImageUrl(imageKey: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: imageKey,
    });

    try {
      const url = await getSignedUrl(this.s3Client, command, { expiresIn });
      return url;
    } catch (error) {
      console.error('Error generating presigned URL:', error);
      throw error;
    }
  }

  getPublicImageUrl(imageKey: string): string {
    const region = process.env.AWS_REGION || 'us-east-1';
    return `https://${this.bucketName}.s3.${region}.amazonaws.com/${imageKey}`;
  }

  async deleteImage(imageKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: imageKey,
    });

    try {
      await this.s3Client.send(command);
      console.log(`Deleted image from S3: ${imageKey}`);
    } catch (error) {
      console.error('Error deleting image from S3:', error);
      throw error;
    }
  }
}

let s3Service: S3Service | null = null;

export const getS3Service = (): S3Service => {
  if (!s3Service) {
    s3Service = new S3Service();
  }
  return s3Service;
};
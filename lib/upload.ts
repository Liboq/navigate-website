import COS from 'cos-nodejs-sdk-v5';

const cos = new COS({
    SecretId: process.env.TENCENT_SECRET_ID!,
    SecretKey: process.env.TENCENT_SECRET_KEY!,
});

export async function uploadToTencentCOS(
    base64Data: string,
    filename: string
): Promise<string> {
    try {
        // 移除 base64 前缀
        const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Image, 'base64');
        const Key = `superNav/screenshots/${filename}`
        return new Promise((resolve, reject) => {
            cos.putObject({
                Bucket: process.env.TENCENT_BUCKET!,
                Region: process.env.TENCENT_REGION!,
                Key,
                Body: buffer,
                ContentType: 'image/jpeg',
            }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(`https://cdn.liboqiao.top/${Key}`);
            });
        });
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
} 
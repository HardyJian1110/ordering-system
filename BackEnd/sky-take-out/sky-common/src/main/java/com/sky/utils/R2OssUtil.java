package com.sky.utils;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import java.io.InputStream;
import java.net.URI;
import java.util.UUID;

@Data
@AllArgsConstructor
@Slf4j
public class R2OssUtil {

    private String endpoint;
    private String accessKeyId;
    private String accessKeySecret;
    private String bucketName;
    private String publicDomain;

    /**
     * 文件上传
     *
     * @param bytes           文件字节数组
     * @param originalFilename 原始文件名
     * @return 文件的访问路径
     */
    public String upload(byte[] bytes, String originalFilename) {
        // 1. 生成唯一文件名 (UUID + 原始后缀)
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String objectName = UUID.randomUUID().toString() + extension;

        // 2. 初始化 S3 客户端
        // 注意：R2 必须指定 endpointOverride 和 Region.of("auto")
        S3Client s3Client = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKeyId, accessKeySecret)))
                .region(Region.of("auto"))
                .build();

        try {
            log.info("上传文件到 Cloudflare R2: {}", objectName);

            // 3. 构建上传请求
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(objectName)
                    .build();

            // 4. 执行上传
            s3Client.putObject(putObjectRequest, RequestBody.fromBytes(bytes));

            StringBuilder stringBuilder = new StringBuilder(publicDomain);
            stringBuilder.append("/").append(objectName);
            // 5. 返回图片的访问地址
            // 注意：这里的 endpoint 通常是 https://<account_id>.r2.cloudflarestorage.com
            // 如果你开启了公开访问域名 (如 r2.dev 或自定义域名)，你应该返回那个域名拼接后的地址
            return stringBuilder.toString();
        } catch (Exception e) {
            log.error("文件上传失败: {}", e.getMessage());
            throw new RuntimeException("文件上传失败");
        } finally {
            s3Client.close();
        }
    }
}
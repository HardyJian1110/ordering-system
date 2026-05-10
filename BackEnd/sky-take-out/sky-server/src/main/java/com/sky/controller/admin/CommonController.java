package com.sky.controller.admin;

import com.sky.constant.MessageConstant;
import com.sky.result.Result;
import com.sky.utils.R2OssUtil;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.services.s3.endpoints.internal.Value;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/admin/common")
@Api(tags = "common interface")
@Slf4j
public class CommonController {

    @Autowired
    private R2OssUtil r2OssUtil;
    // file uploader
    @PostMapping("/upload")
    @ApiOperation("file uploading")
    public Result<String> upload(MultipartFile file){
        log.info("file uploading: {}",file);
        try {
            // original file name
            String originalFilename = file.getOriginalFilename();
            // Extract suffix of original file name e.g. png, jpg...
//            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
//            String objectName = UUID.randomUUID().toString() + extension;

            // file request path
            String filePath = r2OssUtil.upload(file.getBytes(), originalFilename);
            return Result.success(filePath);
        } catch (IOException e) {
            log.error("file upload failed: {}",e);
        }

        return Result.error(MessageConstant.UPLOAD_FAILED);
    }
}

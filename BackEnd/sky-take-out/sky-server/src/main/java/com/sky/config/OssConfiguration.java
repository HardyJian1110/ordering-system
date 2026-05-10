package com.sky.config;

import com.sky.properties.R2OssProperties;
import com.sky.utils.R2OssUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Conditional;
import org.springframework.context.annotation.Configuration;

// Configuration class: used to create R2OssUtil object
@Configuration
@Slf4j
public class OssConfiguration {
    @Bean
    @ConditionalOnMissingBean
    public R2OssUtil r2OssUtil(R2OssProperties r2OssProperties){
        log.info("starting create r2 oss file uploader object: {}",r2OssProperties);
        return new R2OssUtil(r2OssProperties.getEndpoint(),
                r2OssProperties.getAccessKeyId(),
                r2OssProperties.getAccessKeySecret(),
                r2OssProperties.getBucketName(),
                r2OssProperties.getPublicDomain());
    }
}

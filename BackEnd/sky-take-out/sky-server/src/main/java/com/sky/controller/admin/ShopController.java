package com.sky.controller.admin;

import com.sky.result.Result;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

@RestController("adminShopController")
@RequestMapping("/admin/shop")
@Slf4j
@Api(tags = "Shop Interfaces")
public class ShopController {
    public static final String KEY = "SHOP_STATUS";

    @Autowired
    private RedisTemplate redisTemplate;

    @ApiOperation("Set shop status")
    @PutMapping("/{status}")
    public Result setStatus(@PathVariable Integer status){
        log.info("Shop status is set to: {}", status == 1 ? "Opening" : "Closed");
        redisTemplate.opsForValue().set(KEY,status);
        return Result.success();
    }

    @ApiOperation("Get shop status")
    @GetMapping("/status")
    public Result<Integer> getStatus(){
        Integer status = (Integer) redisTemplate.opsForValue().get(KEY);
        log.info("Get shop status: {}", status == 1 ? "Opening" : "Closed");
        return Result.success(status);
    }

}

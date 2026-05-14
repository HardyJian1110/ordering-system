package com.sky.controller.admin;

import com.sky.dto.DishDTO;
import com.sky.dto.DishPageQueryDTO;
import com.sky.entity.Dish;
import com.sky.result.PageResult;
import com.sky.result.Result;
import com.sky.service.DishService;
import com.sky.vo.DishVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/admin/dish")
@Slf4j
@Api(tags = "Dish Interfaces")
public class DishController {

    @Autowired
    private DishService dishService;

    @Autowired
    private RedisTemplate redisTemplate;


    // add a dish
    @ApiOperation("Add a dish")
    @PostMapping
    public Result save(@RequestBody DishDTO dishDTO){
        log.info("Add a dish: {}", dishDTO);
        dishService.saveWithFlavor(dishDTO);

        // clear the cache of redis
        cleanCache("dish_" + dishDTO.getCategoryId());

        return Result.success();
    }

    @ApiOperation("Dish pagination query")
    @GetMapping("/page")
    public Result<PageResult> page(DishPageQueryDTO dishPageQueryDTO){
        log.info("Dish pagination query: {}", dishPageQueryDTO);
        PageResult pageResult = dishService.pageQuery(dishPageQueryDTO);
        return Result.success(pageResult);
    }

    @ApiOperation("Delete a batch of dishes")
    @DeleteMapping
    public Result delete(@RequestParam List<Long> ids){
        log.info("Delete a batch of dishes： {}", ids);
        dishService.deleteBatch(ids);

        // delete all dishes in redis
        cleanCache("dish_*");

        return Result.success();
    }

    @ApiOperation("Query dish by id")
    @GetMapping("/{id}")
    public Result<DishVO> getById(@PathVariable Long id){
        log.info("Query dish by id: {}", id);
        DishVO dishVO = dishService.getByIdAndFlavor(id);
        return Result.success(dishVO);
    }

    @ApiOperation("Enable/Disable dish(Change dish status)")
    @PostMapping("/status/{status}")
    public Result startOrStop(@PathVariable("status") Integer status, Long id ){
        dishService.startOrStop(status,id);
        // delete all dishes in redis
        cleanCache("dish_*");


        return Result.success();
    }

    @ApiOperation("Update dish")
    @PutMapping
    public Result update(@RequestBody DishDTO dishDTO){
        log.info("Update dish: {}",dishDTO);
        dishService.updateAndFlavor(dishDTO);

        // delete all dishes in redis
        cleanCache("dish_*");
        return Result.success();
    }

    @ApiOperation("Query dish by category id")
    @GetMapping("/list")
    public Result<List<Dish>> list(@RequestParam Long categoryId){
        log.info("Query dish by category id: {}", categoryId);
        List<Dish> dishes= dishService.list(categoryId);
        return Result.success(dishes);
    }

    // clear cache in redis
    private void cleanCache(String pattern){
        Set keys = redisTemplate.keys(pattern);
        redisTemplate.delete(keys);
    }

}

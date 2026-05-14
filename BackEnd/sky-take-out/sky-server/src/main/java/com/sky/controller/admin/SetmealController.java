package com.sky.controller.admin;

import com.sky.constant.MessageConstant;
import com.sky.dto.DishPageQueryDTO;
import com.sky.dto.SetmealDTO;
import com.sky.result.PageResult;
import com.sky.result.Result;
import com.sky.service.SetmealService;
import com.sky.vo.SetmealVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/setmeal")
@Slf4j
@Api(tags = "Set Meal Interfaces")
public class SetmealController {

    @Autowired
    private SetmealService setmealService;

    @ApiOperation("insert set meal")
    @PostMapping
    @CacheEvict(cacheNames = "setmealCache", key = "#setmealDTO.categoryId")
    public Result save(@RequestBody SetmealDTO setmealDTO){
        log.info("insert set meal： {}", setmealDTO);
        setmealService.saveAndDish(setmealDTO);
        return Result.success();
    }

    @ApiOperation("Set meal pagination query")
    @GetMapping("/page")
    public Result<PageResult> page(DishPageQueryDTO dishPageQueryDTO){
        log.info("Set meal pagination query: {}", dishPageQueryDTO);
        PageResult pageResult= setmealService.pageQuery(dishPageQueryDTO);
        return Result.success(pageResult);
    }

    @ApiOperation("Delete set meal")
    @DeleteMapping
    @CacheEvict(cacheNames = "setmealCache", allEntries = true)
    public Result delete(@RequestParam List<Long> ids){
        setmealService.deleteBatch(ids);
        return Result.success(MessageConstant.SETMEAL_DELETE_SUCCESSFUL);
    }

    @ApiOperation("Query set meal by id")
    @GetMapping("/{id}")
    public Result<SetmealVO> getById(@PathVariable Long id){
        SetmealVO setmealVO= setmealService.getByIdAndDish(id);
        return Result.success(setmealVO);
    }


    @PutMapping
    @ApiOperation("Update set meal")
    @CacheEvict(cacheNames = "setmealCache", allEntries = true)
    public Result update(@RequestBody SetmealDTO setmealDTO) {
        log.info("!!!!!!!!!!!!update: {}", setmealDTO);
        setmealService.update(setmealDTO);
        return Result.success();
    }

    @PostMapping("/status/{status}")
    @ApiOperation("Enable/Disable set meal")
    @CacheEvict(cacheNames = "setmealCache", allEntries = true)
    public Result startOrStop(@PathVariable Integer status, Long id) {
        setmealService.startOrStop(status, id);
        return Result.success();
    }
}

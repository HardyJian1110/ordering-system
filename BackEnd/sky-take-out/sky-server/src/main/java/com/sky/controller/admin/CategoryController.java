package com.sky.controller.admin;

import com.sky.dto.CategoryDTO;
import com.sky.dto.CategoryPageQueryDTO;
import com.sky.entity.Category;
import com.sky.result.PageResult;
import com.sky.result.Result;
import com.sky.service.CategoryService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

@RestController
@RequestMapping("/admin/category")
@Api(tags = "Category Interfaces")
@Slf4j
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @ApiOperation("Add category")
    @PostMapping
    public Result save(@RequestBody CategoryDTO categoryDTO){
        log.info("Add category: ",categoryDTO);
        categoryService.save(categoryDTO);
        return Result.success();
    }

    @ApiOperation("Category pagination query")
    @GetMapping("/page")
    public Result<PageResult> page(CategoryPageQueryDTO categoryPageQueryDTO){
        log.info("Category pagination query: ",categoryPageQueryDTO);
        PageResult pageResult= categoryService.pageQuery(categoryPageQueryDTO);
        return Result.success(pageResult);
    }

    @ApiOperation("Delete category by id")
    @DeleteMapping
    public  Result deleteById(Long id){
        log.info("Delete category by id: ",id);
        categoryService.deleteById(id);
        return Result.success();
    }

    @ApiOperation("Edit category information")
    @PutMapping
    public Result update(@RequestBody CategoryDTO categoryDTO){
        log.info("Edit category information", categoryDTO);
        categoryService.update(categoryDTO);
        return Result.success();
    }

    @ApiOperation("Enable/Disable category(Change category status)")
    @PostMapping("/status/{status}")
    public Result startOrStop(@PathVariable("status") Integer status, Long id ){
        categoryService.startOrStop(status,id);
        return Result.success();
    }

    @ApiOperation("Query category based on type")
    @GetMapping("/list")
    public Result<List<Category>> list(Integer type){
        List<Category> list= categoryService.list(type);
        return Result.success(list);
    }
}

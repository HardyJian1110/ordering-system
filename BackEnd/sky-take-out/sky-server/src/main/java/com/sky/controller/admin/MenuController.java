package com.sky.controller.admin;

import com.sky.result.Result;
import com.sky.service.MenuService;
import com.sky.vo.MenuItemVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/menu")
@Slf4j
public class MenuController {
    @Autowired
    private MenuService menuService;

    @GetMapping
    public Result<List<MenuItemVO>> list() {
        List<MenuItemVO> tree = menuService.getMenuTree();
        return Result.success(tree);
    }
}

package com.sky.vo;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_EMPTY) // 如果children为空则不展示在JSON中
public class MenuItemVO {
    private String label;
    private String icon;
    private String key; // 对应前端的path
    private List<MenuItemVO> children;
}
package com.sky.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Menu {
    private Long id;
    private String label;
    private String icon;
    private String path;
    private Long parentId;
    private String sortOrder;
}

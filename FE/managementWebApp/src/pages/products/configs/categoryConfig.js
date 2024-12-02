const commonFields = {
  widthInfo: {
    name: "width",
    type: "select",
    label: "Chiều rộng",
    options: [
      { value: 100, label: "100cm" },
      { value: 125, label: "125cm " },
    ],
  },

  colorInfo: {
    name: "color",
    type: "select",
    label: "Màu sắc",
    options: [
      { value: "atraxit", label: "Xám than" },
      { value: "black", label: "Đen" },
      { value: "white", label: "Trắng" },
    ],
  },

  heightInfo: {
    name: "height",
    type: "select",
    label: "Chiều cao",
    options: [
      { value: 180, label: "180cm" },
      { value: 210, label: "210cm" },
    ],
  },

  heightInfo2: {
    name: "height",
    type: "select",
    label: "Chiều cao",
    options: [
      { value: 140, label: "140cm" },
      { value: 160, label: "160cm" },
      { value: 170, label: "170cm" },
      { value: 180, label: "180cm" },
    ],
  },
};

const categoryConfig = [
  {
    id: 1,
    label: "Kệ treo tường",
    fields: [
      commonFields.colorInfo,
      commonFields.heightInfo,
      commonFields.widthInfo,
    ],
  },
  {
    id: 2,
    label: "Kệ đơn",
    fields: [
      commonFields.colorInfo,
      commonFields.heightInfo2,
      commonFields.widthInfo,
    ],
  },
  {
    id: 3,
    label: "Kệ đôi",
    fields: [
      commonFields.colorInfo,
      commonFields.heightInfo2,
      commonFields.widthInfo,
    ],
  },
  {
    id: 4,
    label: "Kệ thuốc lá",
    fields: [commonFields.colorInfo, commonFields.widthInfo],
  },
  {
    id: 5,
    label: "Kệ trái cây",
    fields: [],
  },
  {
    id: 6,
    label: "Quầy bán hàng",
    fields: [
      commonFields.colorInfo,
      commonFields.widthInfo,
      {
        name: "wooden sidewall",
        type: "select",
        label: "Bên hông bằng gỗ",
        options: [
          { value: "make a choice", label: "Đưa ra lựa chọn" },
          {
            value: "wooden site wall in oak brown",
            label: "Tường bên gỗ bàng màu nâu sồi",
          },
          {
            value: "wooden site wall in atraxit",
            label: "Tường bên gỗ bàng màu atraxit",
          },
        ],
      },
    ],
  },
  {
    id: 7,
    label: "Kệ bánh mì",
    fields: [],
  },
  {
    id: 8,
    label: "Khu vực bán hàng",
    subCategories: [
      {
        id: 13,
        label: "Quầy thu ngân 1.7m",
        fields: [],
      },
      {
        id: 14,
        label: "Quầy thu ngân 2.5m",
        fields: [],
      },
      {
        id: 15,
        label: "Quầy thu ngân 2.9m",
        fields: [],
      },
      {
        id: 16,
        label: "Giỏ hàng nhựa",
        fields: [
          {
            name: "colorShopping",
            type: "select",
            label: "Màu giỏ hàng",
            options: [
              { value: "red", label: "đỏ" },
              { value: "black", label: "đen" },
            ],
          },
        ],
      },
      {
        id: 17,
        label: "Xe đẩy mua sắm",
        fields: [],
      },
      {
        id: 18,
        label: "Quầy trưng bày",
        fields: [
          commonFields.colorInfo,
          commonFields.widthInfo,
          {
            name: "wooden sidewall",
            type: "select",
            label: "Bên hông bằng gỗ",
            options: [
              { value: "make a choice", label: "Đưa ra lựa chọn" },
              {
                value: "wooden site wall in oak brown",
                label: "Tường bên gỗ bàng màu nâu sồi",
              },
              {
                value: "wooden site wall in atraxit",
                label: "Tường bên gỗ bàng màu atraxit",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 9,
    label: "Tủ lạnh",
    subCategories: [
      {
        id: 19,
        label: "Tủ lạnh cửa kính trong suốt",
        fields: [],
      },
      {
        id: 20,
        label: "Tủ lạnh cửa nguyên khối",
        fields: [],
      },
    ],
  },
  {
    id: 10,
    label: "Tủ mát trưng bày",
    subCategories: [
      {
        id: 21,
        label: "Tủ mát đứng",
        fields: [],
      },
      {
        id: 22,
        label: "Tủ mát nằm",
        fields: [],
      },
      {
        id: 23,
        label: "Phụ kiện kính tủ mát",
        fields: [],
      },
      {
        id: 24,
        label: "Phụ kiện nắp tủ mát",
        fields: [],
      },
    ],
  },
  {
    id: 11,
    label: "Đồ nội thất",
    subCategories: [
      {
        id: 25,
        label: "Bàn làm bếp",
        fields: [{ name: "width", label: "Chiều rộng", type: "text" }],
      },
      {
        id: 26,
        label: "Tủ bếp",
        fields: [{ name: "width", label: "Chiều rộng", type: "text" }],
      },
      {
        id: 27,
        label: "Bồn rửa chén",
        fields: [{ name: "width", label: "Chiều rộng", type: "text" }],
      },
      {
        id: 28,
        label: "Tủ trưng bày bếp",
      },
      {
        id: 29,
        label: "Máy hút mùi",
        fields: [{ name: "width", label: "Chiều rộng", type: "text" }],
      },
      {
        id: 30,
        label: "Tủ bếp treo tường",
        fields: [{ name: "width", label: "Chiều rộng", type: "text" }],
      },
      {
        id: 31,
        label: "Kệ treo tường bếp",
        fields: [
          { name: "width", label: "Chiều rộng", type: "text" },
          {
            name: "consoles included",
            label: "Bảng đièu khiển",
            type: "select",
            options: [
              { value: "yes", label: "Có" },
              { value: "no", label: "Không" },
            ],
          },
        ],
      },
      {
        id: 32,
        label: "Bồn rửa tay",
        fields: [],
      },
      {
        id: 33,
        label: "Máy sấy tay",
        fields: [],
      },
      {
        id: 34,
        label: "Đồ đựng thực phẩm",
        fields: [{ name: "height", label: "Chiều cao", type: "text" }],
      },
      {
        id: 35,
        label: "Giỏ mua hàng",
        fields: [
          {
            name: "colorShopping",
            type: "select",
            label: "Màu giỏ hàng",
            options: [
              { value: "red", label: "đỏ" },
              { value: "black", label: "đen" },
            ],
          },
        ],
      },
      {
        id: 36,
        label: "Xe đẩy mua sắm",
        fields: [],
      },
    ],
  },
  {
    id: 12,
    label: "Kệ bếp",
    subCategories: [
      {
        id: 37,
        label: "Kệ phụ kiện",
        fields: [commonFields.colorInfo, commonFields.widthInfo],
      },
      {
        id: 38,
        label: "Kệ đồ",
        fields: [
          commonFields.colorInfo,
          { name: "width", label: "Chiều rộng", type: "text" },
          { name: "measure", label: "Chiều dài", type: "text" },
        ],
      },
    ],
  },
];

export default categoryConfig;

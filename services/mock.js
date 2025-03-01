import mockPic from "../static/imgs/mock/20241230202355.jpg";

export const mockPurchaseList = [
  {
    supplier: {
      name: "后港",
      id: "1",
    },
    status: 1,
    goodsList: [
      {
        name: "白兰地",
        price: 100,
        category: "瓶",
        thumbnail: mockPic,
        count: 1,
      },
    ],
    totalPrice: 100,
    count: 1,
    createTime: "2019-12-12 12:12:12",
  },
  {
    supplier: {
      name: "后港",
      id: "1",
    },
    status: 1,
    goodsList: [
      {
        name: "白兰地",
        price: 100,
        category: "瓶",
        thumbnail: mockPic,
        count: 1,
      },
      {
        name: "威士忌",
        price: 90,
        category: "瓶",
        thumbnail: mockPic,
        count: 3,
      },
    ],
    totalPrice: 100,
    count: 1,
    createTime: "2019-12-12 12:12:12",
  },
  {
    supplier: {
      name: "后港",
      id: "1",
    },
    status: 1,
    goodsList: [
      {
        name: "白兰地",
        price: 100,
        category: "瓶",
        thumbnail: mockPic,
        count: 1,
      },
      {
        name: "威士忌",
        price: 90,
        category: "瓶",
        thumbnail: mockPic,
        count: 3,
      },
      {
        name: "白兰地",
        price: 100,
        category: "瓶",
        thumbnail: mockPic,
        count: 1,
      },
      {
        name: "威士忌",
        price: 90,
        category: "瓶",
        thumbnail: mockPic,
        count: 3,
      },
    ],
    totalPrice: 100,
    count: 1,
    createTime: "2019-12-12 12:12:12",
  },
];

export const mockGoodsList = [
  {
    id: "1",
    name: "白兰地",
    estimatedPrice: 100,
    thumbnail: mockPic,
    category: "瓶",
  },
  {
    id: "2",
    name: "威士忌",
    estimatedPrice: 90,
    thumbnail: mockPic,
    category: "瓶",
  },
  {
    id: "3",
    name: "啤酒",
    estimatedPrice: 10,
    thumbnail: mockPic,
    category: "瓶",
  },
  {
    id: "4",
    name: "伏特加",
    estimatedPrice: 90,
    thumbnail: mockPic,
    category: "瓶",
  },
];

export const mockStockList = [
  {
    id: "1",
    name: "白兰地",
    totalQuantity: 100,
    thumbnail: mockPic,
    usedQuantity: 10,
    price: 100,
    category: "瓶",
  },
  {
    id: "2",
    name: "威士忌",
    totalQuantity: 100,
    thumbnail: mockPic,
    usedQuantity: 10,
    price: 90,
    category: "瓶",
  },
  {
    id: "3",
    name: "啤酒",
    totalQuantity: 100,
    thumbnail: mockPic,
    usedQuantity: 10,
    price: 10,
    category: "瓶",
  },
  {
    id: "4",
    name: "伏特加",
    totalQuantity: 100,
    thumbnail: mockPic,
    usedQuantity: 10,
    price: 90,
    category: "瓶",
  },
  {
    id: "5",
    name: "白兰地",
    totalQuantity: 100,
    thumbnail: mockPic,
    usedQuantity: 10,
    price: 100,
    category: "瓶",
  },
  {
    id: "6",
    name: "威士忌",
    totalQuantity: 100,
    thumbnail: mockPic,
    usedQuantity: 10,
    price: 90,
    category: "瓶",
  },
]

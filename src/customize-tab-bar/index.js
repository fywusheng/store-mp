Component({
  data: {
    tabIndex: 1,
    list: [
      {
        id: 1,
        name: "首页",
        imgOff:
          "https://ggllstatic.hpgjzlinfo.com/static/images/footer/home.png",
        imgOn:
          "https://ggllstatic.hpgjzlinfo.com/static/images/footer/home-active.png",
        url: "/pages/index/index",
      },
      {
        id: 2,
        name: "分类",
        imgOff:
          "https://ggllstatic.hpgjzlinfo.com/static/images/footer/category.png",
        imgOn:
          "https://ggllstatic.hpgjzlinfo.com/static/images/footer/category-active.png",
        url: "/pages/index/category",
      },
      {
        id: 3,
        name: "购物车",
        imgOff:
          "https://ggllstatic.hpgjzlinfo.com/static/images/footer/cart.png",
        imgOn:
          "https://ggllstatic.hpgjzlinfo.com/static/images/footer/cart-active.png",
        url: "/pages/index/cart",
      },
      {
        id: 4,
        name: "我的",
        imgOff:
          "https://ggllstatic.hpgjzlinfo.com/static/images/footer/me.png",
        imgOn:
          "https://ggllstatic.hpgjzlinfo.com/static/images/footer/me-active.png",
        url: "/pages/index/mine",
      },
    ],
  },
  methods: {
    tap(e) {
      const data = e.target.dataset;
      my.switchTab({url: data.value.url});
    },
  },
});

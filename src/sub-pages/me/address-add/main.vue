<template>
  <div class="address-add" :class="{ isIphoneHair }">
    <div class="form-group">
      <div class="title">收货人:</div>
      <input
        class="form-control"
        v-model="dataForm.deliveryName"
        placeholder="姓名"
        placeholder-style="color:#999999"
      />
      <!-- <image class="icon-mail" src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-mail.png" mode="" /> -->
    </div>
    <div class="form-group">
      <div class="title">手机号:</div>
      <input
        class="form-control"
        type="number"
        v-model="dataForm.deliveryPhone"
        placeholder="手机号"
        placeholder-style="color:#999999"
      />
    </div>
    <div class="form-group">
      <div class="title">省/市/区:</div>
      <view class="area" @click="showArea">
        <div class="form-control" v-if="detailName">{{ detailName }}</div>
        <div class="form-control default" v-else>请选择</div>
      </view>

      <image
        class="icon-right"
        mode="scaleToFill"
        src="https://ggllstatic.hpgjzlinfo.com/static/images/common/icon-right.png"
      />
    </div>
    <div class="form-group">
      <div class="title">详细地址:</div>
      <input
        class="form-control"
        v-model="dataForm.address"
        placeholder="请输入"
        placeholder-style="color:#999999"
      />
    </div>
    <div class="btn-bottom-fixed" :class="{ isIphoneHair }" @click="save">
      确认添加
    </div>
  </div>
</template>

<script>
import get from "lodash/get";
import findIndex from "lodash/findIndex";
export default {
  data() {
    return {
      isIphoneHair: App.isIphoneHair,
      dataForm: {
        address: "",
        deliveryName: "",
        deliveryPhone: "",
      },
      regionIndex: [],
      regionList: [],
      type: "",
      detailName: "",
    };
  },
  components: {},
  methods: {
    // 支付宝展示区域
    showArea() {
      const areaList = this.REGION_LIST.map((org) => this.mapTree(org));
      this.multiLevelSelect({
        title: "请选择省市区",
        list: areaList,
        success: (res) => {
          if (res.success) {
            const arg = res["result"].reduce((pre, cur, i) => {
              pre.push(cur.name);
              return pre;
            }, []);
            this.dataForm.province = res.result[0].code;
            this.dataForm.city = res.result[1].code;
            this.dataForm.area = res.result[2].code;
            this.detailName = arg.join("");
          }
        },
      });
    },
    // 封装 my.multiLevelSelect
    // - 对于传入的数据，只向底层接口传递 name 和 subList
    // - 对于选中的结果，替换成对应的完整数据条目再回调
    multiLevelSelect({ title, list, success, fail, complete }) {
      const clean = ({ name, subList }) => {
        return { name, subList: subList && subList.map(clean) };
      };
      const lookup = (array, index, pool) => {
        if (array && index < array.length) {
          array[index] = pool.filter((x) => x.name === array[index].name)[0];
          lookup(array, index + 1, array[index].subList);
          delete array[index].subList; // 方便回调中的 my.alert 演示。真实代码请删除此行，避免副作用
        }
      };
      const wrap = (func) =>
        func &&
        ((res) => {
          res.success && lookup(res.result, 0, list);
          func(res);
        });
      return my.multiLevelSelect({
        title,
        list: list.map(clean),
        success: wrap(success),
        fail,
        complete: wrap(complete),
      });
    },
    mapTree(org) {
      const haveChildren =
        Array.isArray(org.children) && org.children.length > 0;
      return {
        // 分别将我们查询出来的值做出改变他的key
        name: org.name,
        code: org.code,
        // data: { ...org },
        // 判断它是否存在子集，若果存在就进行再次进行遍历操作，知道不存在子集便对其他的元素进行操作
        subList: haveChildren ? org.children.map((i) => this.mapTree(i)) : [],
      };
    },

    bindRegionChange() {
      const province = get(this.regionList, [0, this.regionIndex[0], "name"]);
      const city = get(this.regionList, [1, this.regionIndex[1], "name"]);
      const area = get(this.regionList, [2, this.regionIndex[2], "name"]);
      this.detailName = province + city + area;
    },
    bindRegionColumnChange(e) {
      const { column, value } = e.mp.detail;
      if (column === 0) {
        this.regionIndex = [value, 0, 0];
        const cityList = [];
        this.REGION_LIST[value].children.forEach((city) => {
          cityList.push({
            name: city.name,
            code: city.code,
          });
        });
        this.regionList.splice(1, 1, cityList);
        const areaList = [];
        this.REGION_LIST[this.regionIndex[0]].children[
          this.regionIndex[1]
        ].children.forEach((area) => {
          areaList.push({
            name: area.name,
            code: area.code,
          });
        });
        this.regionList.splice(2, 1, areaList);
      } else if (column === 1) {
        this.regionIndex[1] = value;
        this.regionIndex[2] = 0;
        const areaList = [];
        this.REGION_LIST[this.regionIndex[0]].children[
          this.regionIndex[1]
        ].children.forEach((area) => {
          areaList.push({
            name: area.name,
            code: area.code,
          });
        });
        this.regionList.splice(2, 1, areaList);
      } else {
        this.regionIndex[2] = value;
      }
    },
    async save() {
      if (
        !this.dataForm.deliveryName ||
        !this.dataForm.deliveryName.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, "")
      ) {
        this.$uni.showToast("请输入收货人姓名");
        return false;
      }
      if (this.dataForm.deliveryName.length > 12) {
        this.$uni.showToast("收货人姓名过长");
        return false;
      }
      if (!this.dataForm.deliveryPhone) {
        this.$uni.showToast("请输入收货人手机号码");
        return false;
      }
      if (!/^[0-9]?\d{11}$/.test(this.dataForm.deliveryPhone)) {
        this.$uni.showToast("请输入正确的手机号");
        return false;
      }
      if (!this.regionIndex.length) {
        this.$uni.showToast("请选择省市区");
        return false;
      }
      // this.dataForm.province = _.get(this.regionList, [0, this.regionIndex[0], 'code'])
      // this.dataForm.city = _.get(this.regionList, [1, this.regionIndex[1], 'code'])
      // this.dataForm.area = _.get(this.regionList, [2, this.regionIndex[2], 'code'])

      if (!this.dataForm.address) {
        this.$uni.showToast("请输入详细地址");
        return false;
      }
      if (this.dataForm.address.length > 64) {
        this.$uni.showToast("详细地址过长");
        return false;
      }
      console.info(this.dataForm);
      uni.showLoading("正在提交...");
      const result = await Axios.post(
        this.dataForm.id ? "/address/update" : "/address/add",
        this.dataForm,
        {
          headers: {
            "content-type": "application/json;charset=utf-8",
          },
        }
      );
      uni.hideLoading();
      if (result.code == 200) {
        this.$uni.showToast(result.msg || "保存成功");
        Store.commit(VUEX.CHECKOUT.SET_ADDRESS, result.data.id);
        Store.dispatch("getCheckoutData", true);
        uni.navigateBack({ delta: 2 });
        // this.type == 1 && Store.commit(VUEX.CHECKOUT.SET_ADDRESS, result.data.id)
        // uni.navigateBack({ delta: this.type == 3 ? 2 : 1 })
      } else {
        this.$uni.showToast(result.msg || "保存失败");
      }
    },
    getRegionList() {
      return new Promise((resolve, reject) => {
        Axios.get("/area/list.tree").then((res) => {
          resolve(res.data);
        });
      });
    },
  },
  async mounted() {
    if (!Store.getters.isLogin) {
      await Store.dispatch("login");
    }
    this.REGION_LIST = await this.getRegionList();
    this.dataForm = {};
    this.type = this.$scope.options.type;
    this.regionList = [];
    this.detailName = "";
    this.regionIndex = [0, 0, 0];
    const provinceList = [];
    this.REGION_LIST.forEach((province) => {
      provinceList.push({
        name: province.name,
        code: province.code,
      });
    });
    this.regionList.push(provinceList);
    if (this.$scope.options.address) {
      uni.setNavigationBarTitle({
        title: "编辑收货地址",
      });
      this.dataForm = JSON.parse(this.$scope.options.address);
      this.regionIndex[0] = findIndex(this.regionList[0], [
        "code",
        `${this.dataForm.province}`,
      ]);
      const cityList = [];
      this.REGION_LIST[this.regionIndex[0]].children.forEach((city) => {
        cityList.push({
          name: city.name,
          code: city.code,
        });
      });
      this.regionList.push(cityList);
      this.regionIndex[1] = findIndex(this.regionList[1], [
        "code",
        `${this.dataForm.city}`,
      ]);
      const areaList = [];
      this.REGION_LIST[this.regionIndex[0]].children[
        this.regionIndex[1]
      ].children.forEach((area) => {
        areaList.push({
          name: area.name,
          code: area.code,
        });
      });
      this.regionList.push(areaList);
      this.regionIndex[2] = findIndex(this.regionList[2], [
        "code",
        `${this.dataForm.area}`,
      ]);
      this.detailName =
        this.dataForm.provinceName +
        this.dataForm.cityName +
        this.dataForm.areaName;
    } else {
      uni.setNavigationBarTitle({
        title: "新增收货地址",
      });
      const cityList = [];
      this.REGION_LIST[this.regionIndex[0]].children.forEach((city) => {
        cityList.push({
          name: city.name,
          code: city.code,
        });
      });
      this.regionList.push(cityList);
      const areaList = [];
      this.REGION_LIST[this.regionIndex[0]].children[
        this.regionIndex[1]
      ].children.forEach((area) => {
        areaList.push({
          name: area.name,
          code: area.code,
        });
      });
      this.regionList.push(areaList);
    }
    console.info(this.regionList);
  },
};
</script>

<style lang="scss">
.address-add {
  padding-top: 32rpx;
  background: #f5f5f5;
  min-height: 100vh;
  &.isIphoneHair {
    padding-bottom: rpx(80);
  }
  .form-group {
    position: relative;
    padding-left: rpx(270);
    border-bottom: rpx(1) solid #ebedf0;
    background: #ffffff;

    .form-control {
      height: rpx(90);
      line-height: rpx(90);
      font-size: rpx(36);
      &.default {
        color: #999999;
      }
    }

    .icon-right {
      @include middle-center-y();
      right: rpx(30);
      width: rpx(15);
      height: rpx(27);
    }

    .icon-mail {
      @include middle-center-y();
      right: rpx(30);
      width: rpx(56);
      height: rpx(64);
    }

    .title {
      @include middle-center-y();
      left: 0;
      width: rpx(270);
      font-size: rpx(36);
      text-align: left;
      margin-left: 32rpx;
    }
  }
}
</style>

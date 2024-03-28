<!-- author by liushuag -->
<!-- date：2.15 -->
<template>
	<view class="main_content">
		<!-- 门店管理-统计报表-->
		<view class="content">
			<view class="title_text">订单报表导出</view>
			<view class="search flex_r_h">
				<view class="date flex_r_h">
					下单时间：
					<view class="select_lang" @click="selectDate">
						<image mode="widthFix" src="/static/img/date-icon-h.png" class="icon"></image>
						<input placeholder="开始时间-结束时间" v-model="dateSelect" class="input_select" :disabled="true" />
						<image mode="widthFix" src="http://192.168.1.187:10088/static/store-mp/select_icon.png"
							class="icon_s"></image>
					</view>
				</view>
			</view>
			<view class="info_content flex_r_h">
				<view class="row flex_r_h" @click="exportOrderInfo(40)">
					<image src="http://192.168.1.187:10088/static/store-mp/dc-icon.png" mode="widthFix"
						class="icon"></image>
					<view class="desc">
						<view>导出已完成</view>
						<view>订单列表</view>
					</view>
				</view>
				<view class="row flex_r_h" @click="exportOrderInfo(100)">
					<image src="http://192.168.1.187:10088/static/store-mp/dcq-icon.png" mode="widthFix"
						class="icon"></image>
					<view class="desc">
						<view>导出已退款</view>
						<view>订单列表</view>
					</view>
				</view>
				<view class="row flex_r_h" @click="exportOrderDetail(40)">
					<image src="http://192.168.1.187:10088/static/store-mp/mx-icon.png" mode="widthFix"
						class="icon"></image>
					<view class="desc">
						<view>导出已完成</view>
						<view>订单明细</view>
					</view>
				</view>
				<view class="row flex_r_h" @click="exportOrderDetail(100)">
					<image src="http://192.168.1.187:10088/static/store-mp/dct-icon.png" mode="widthFix"
						class="icon"></image>
					<view class="desc">
						<view>导出已退款</view>
						<view>订单明细</view>
					</view>
				</view>
			</view>
		</view>
		<view class="content zindexd">
			<view class="title_text">销售报表导出</view>
			<!-- 年份选择 -->
			<view class="search flex_r_h">
				<view class="date flex_r_h">
					统计时间：
					<view class="select_lang flex_r_h">
						<view class="date-select">
							<image mode="widthFix" src="/static/img/date-icon-h.png" class="icon"></image>
							  <uni-data-select
							    v-model="xsYear"
							    placeholder ="选择年份"
								:localdata="yearArray"
								:clear="false"
								@change="changeYear"
							  ></uni-data-select>
						</view>
						<view class="date-select ">
							<uni-data-select
								v-model="xsMonth"
								placeholder ="选择月份"
								:localdata="monthArray"
								:clear="false"
							></uni-data-select>
						</view>
					</view>
				</view>
			</view>
			<view class="che_content zindexg">
				<radio-group class="flex_r_h" @change="changeSaleRadio">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in tjItems" :key="item.value">
						<radio :value="item.value" />{{item.name}}
					</label>
				</radio-group>
			</view>
			<view class="btn" @click="exportSaleExcel">导出</view>
		</view>
		<view class="content zindexd">
			<view class="title_text">对账报表导出</view>
			<view class="search flex_r_h">
				<view class="date flex_r_h">
					对账时间：
					<view class="select_lang flex_r_h">
						<view class="date-select">
							<image mode="widthFix" src="/static/img/date-icon-h.png" class="icon"></image>
							  <uni-data-select
							    v-model="dzYear"
							    placeholder ="选择年份"
								:localdata="yearArray"
								:clear="false"
								@change="changeYear"
							  ></uni-data-select>
						</view>
						<view class="date-select">
							<uni-data-select
								v-model="dzMonth"
								placeholder ="选择月份"
								:localdata="monthArray"
								:clear="false"
							></uni-data-select>
						</view>
					</view>
				</view>
			</view>
			<view class="che_content zindexg">
				<radio-group  class="flex_r_h"  @change="changeRebateRadio">
					<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in dzItems" :key="item.value">
						<radio :value="item.value" />{{item.name}}
					</label>
				</radio-group>
			</view>
			<view class="btn" @click="exportReconciliation">导出</view>
		</view>
		<!-- 日期选择框 -->
		<uni-calendar ref="calendar" class="uni-calendar--hook" :clear-date="true" :insert="false" :range="true"
			@confirm="confirmDate" />
	</view>
</template>
<script>
	import api from '@/apis/index.js';
	export default {
		data() {
			return {
				tjItems:[
					{
						value:1,
						name:'按天统计'
					},
					{
						value:2,
						name:'按周统计'
					},
					{
						value:3,
						name:'按月统计'
					},
				],
				tjIndex:0,
				dzIndex:"",
				dzItems:[
					{
						value:"",
						name:'全员'
					},
					{
						value:"商品购买",
						name:'商品购买'
					},
					{
						value:"积分兑换",
						name:'积分兑换'
					},
				],
				selectDateType:'3',
				dateSelect: '',
				// 下单参数
				queryParam: {
					startTime: '',
					endTime: ''
				},
				xsYear: '',
				xsMonth:'',
				dzYear: '',
				dzMonth:'',
				yearArray: [], //可选年份数组
				monthArray: [
					{
						value:0,
						text:'全部',
						disable:false
					},
					{
						value:1,
						text:'1月',
						disable:true
					},
					{
						value:2,
						text:'2月',
						disable:true
					},
					{
						value:3,
						text:'3月',
						disable:true
					},
					{
						value:4,
						text:'4月',
						disable:true,
					},
					{
						value:5,
						text:'5月',
						disable:true
					},
					{
						value:6,
						text:'6月',
						disable:true
					},
					{
						value:7,
						text:'7月',
						disable:true
					},
					{
						value:8,
						text:'8月',
						disable:true
					},
					{
						value:9,
						text:'9月',
						disable:true
					},
					{
						value:10,
						text:'10月',
						disable:true
					},
					{
						value:11,
						text:'11月',
						disable:true
					},
					{
						value:12,
						text:'12月',
						disable:true
					}
				],//可选月份数组销售
			};
		},
		created() {
			this.getYear()
		},
		mounted() {},
		onLoad(e) {},
		methods: {
			getYear(){
				const dayjs = require('dayjs'); // 引入dayjs库
				// 获取当前年份
				const currentYear = dayjs().year();
				// 使用循环和add方法获取接下来的5个年份
				const nextFiveYears = [];
				for (let i = 0; i < 5; i++) {
				  nextFiveYears.push({
					  value:dayjs().year(currentYear - i).format('YYYY'),text:dayjs().year(currentYear - i).format('YYYY')+'年'
				  }); // 格式化为 'YYYY' 形式
				}
				this.yearArray = nextFiveYears
				console.log("年份",nextFiveYears)
			},
			/**
			 * 打开时间
			 */
			selectDate() {
				this.$refs.calendar.open()
			},
			confirmDate(obj) {
				if (obj.range.data.length == 0) {
					this.$uni.showToast('请选择下单时间');
					return;
				}
				this.queryParam.startTime = obj.range.data[0]
				this.queryParam.endTime = obj.range.data[obj.range.data.length - 1]
				this.dateSelect = obj.range.data[0] + '~' + obj.range.data[obj.range.data.length - 1]
				console.log(obj, this.queryParam)
			},
			changeYear(e){
				console.log(e)
				this.selectOrderMonthByYea(e)
			},
			/**
			 * 根据年份查月份
			 */
			selectOrderMonthByYea(e){
				api.selectOrderMonthByYea({
					data: {
						year:e
					},
					success: (data) => {
						this.monthArray.forEach(item => {
						    if (data.includes(item.value)) {
						        item.disable = false;
						    }
						});
						// console.log("数据", this.monthArray)
					},
					fail: (err) => {
						this.$uni.showToast(err.message);
					}
				})
			},
			// 
			changeSaleRadio(e){
				this.tjIndex = e.detail.value
			},
			changeRebateRadio(e){
				this.dzIndex = e.detail.value
			},
			/**
			 * 导出完成/退款列表
			 */
			async exportOrderInfo(status) {
				let params = {
					// storeNo: "1",
					storeNo:uni.getStorageSync('storeNo'),
					startTime: this.queryParam.startTime,
					endTime: this.queryParam.endTime,
					status: status,
				}
				if(this.queryParam.startTime=='' || this.queryParam.endTime==''){
					this.$uni.showToast('请选择下单时间');
					return;
				}
				try {
					api.exportOrderInfo({
						data: {
							...params
						},
						success: (data) => {
							console.log("数据", data)
							const fileManagerObj = uni.getFileSystemManager() // 获取全局的文件管理器
							console.log(fileManagerObj);
							// 文件存储到本地的路径
							const filePath = `${wx.env.USER_DATA_PATH}/${new Date().getTime()}.xlsx`
							fileManagerObj.writeFile({
								data: data, // 拿到的arraybuffer数据
								filePath: filePath,
								encoding: 'binary',
								success: (res) => {
									console.log("写出成功", res) // 成功了的话这里会打印 writeFile:ok
									console.log("文件路径", filePath)
									this.viewDoc(filePath)
								}
							})
						},
						fail: (err) => {
							this.$uni.showToast(err.message);
						}
					})
				} catch (error) {
					console.log(error);
				}
			},

			/**
			 * 导出完成/退款明细
			 */
			exportOrderDetail(status) {
				let params = {
					// storeNo: "1",
					storeNo:uni.getStorageSync('storeNo'),
					startTime: this.queryParam.startTime,
					endTime: this.queryParam.endTime,
					status: status,
				}
				if(this.queryParam.startTime=='' || this.queryParam.endTime==''){
					this.$uni.showToast('请选择下单时间');
					return;
				}
				try {
					api.exportOrderDetail({
						data: {
							...params
						},
						success: (data) => {
							console.log("数据", data)
							const fileManagerObj = uni.getFileSystemManager() // 获取全局的文件管理器
							console.log(fileManagerObj);
							// 文件存储到本地的路径
							const filePath = `${wx.env.USER_DATA_PATH}/${new Date().getTime()}.xlsx`
							fileManagerObj.writeFile({
								data: data, // 拿到的arraybuffer数据
								filePath: filePath,
								encoding: 'binary',
								success: (res) => {
									console.log("写出成功", res) // 成功了的话这里会打印 writeFile:ok
									console.log("文件路径", filePath)
									this.viewDoc(filePath)
								}
							})

						},
						fail: (err) => {
							this.$uni.showToast(err.message);
						}
					})
				} catch (error) {
					console.log(error);
				}
			},
			// 导出销售报表
			exportSaleExcel(status) {
				let params = {
					// storeNo: "1",
					storeNo:uni.getStorageSync('storeNo'),
					exportTimeType: this.tjIndex,
					year: this.xsYear,
					month: this.xsMonth,
				}
				if(this.xsYear==''|| this.xsMonth ==''){
					this.$uni.showToast('请选择统计时间');
					return;
				}
				try {
					api.exportSaleExcel({
						data: {
							...params
						},
						success: (data) => {
							console.log("数据", data)
							const fileManagerObj = uni.getFileSystemManager() // 获取全局的文件管理器
							console.log(fileManagerObj);
							// 文件存储到本地的路径
							const filePath = `${wx.env.USER_DATA_PATH}/${new Date().getTime()}.xlsx`
							fileManagerObj.writeFile({
								data: data, // 拿到的arraybuffer数据
								filePath: filePath,
								encoding: 'binary',
								success: (res) => {
									console.log("写出成功", res) // 成功了的话这里会打印 writeFile:ok
									console.log("文件路径", filePath)
									this.viewDoc(filePath)
								}
							})

						},
						fail: (err) => {
							this.$uni.showToast(err.message);
						}
					})
				} catch (error) {
					console.log(error);
				}
			},
			// 导出对账报表
			exportReconciliation(status) {
				let params = {
					// storeNo: "1",
					storeNo:uni.getStorageSync('storeNo'),
					sceneType: this.dzIndex,
					year: this.dzYear,
					month: this.dzMonth,
				}
				if(this.dzYear==''|| this.dzMonth ==''){
					this.$uni.showToast('请选择统计时间');
					return;
				}
				try {
					api.exportReconciliation({
						data: {
							...params
						},
						success: (data) => {
							console.log("数据", data)
							const fileManagerObj = uni.getFileSystemManager() // 获取全局的文件管理器
							console.log(fileManagerObj);
							// 文件存储到本地的路径
							const filePath = `${wx.env.USER_DATA_PATH}/${new Date().getTime()}.xlsx`
							fileManagerObj.writeFile({
								data: data, // 拿到的arraybuffer数据
								filePath: filePath,
								encoding: 'binary',
								success: (res) => {
									console.log("写出成功", res) // 成功了的话这里会打印 writeFile:ok
									console.log("文件路径", filePath)
									this.viewDoc(filePath)
								}
							})

						},
						fail: (err) => {
							this.$uni.showToast(err.message);
						}
					})
				} catch (error) {
					console.log(error);
				}
			},
			// 打开文件
			viewDoc(filePath) {
				uni.openDocument({
					// 直接打开
					filePath: filePath, // 这里填上面写入本地的文件路径
					fileType: 'xlsx',
					showMenu: true, // 右上角是否有可以转发分享的功能，配不配随意
					success: (res) => {
						console.log('打开文档成功')
					}
				})
			},

		},
		onShow() {},

	};
</script>
<style>
	page {
		display: flex;
		flex-direction: column;
		height: 100%;
		/* #ifdef H5 */
		background-color: #fff;
		/* #endif */
	}
</style>
<style lang="scss">
	.flex_r_h {
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}

	.flex_c_h {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.main_content {
		height: 480rpx;
		background: linear-gradient(180deg, #FE5A08 0%, rgba(254, 89, 6, 0) 100%);
		padding: 24rpx 32rpx;
		.title_text {
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
			border-bottom: 1rpx solid #F5F7FA;
			padding-bottom: 24rpx;
		}

		.title_text::before {
			width: 6rpx;
			height: 24rpx;
			background: #FF5500;
			content: '';
			display: inline-block;
			margin-right: 12rpx;
		}

		.search {
			margin: 30rpx 0;
			justify-content: space-between;

			.date {
				font-size: 24rpx;
				color: #333333;

				.date_content {
					width: 360rpx;
					height: 56rpx;
					background: #F5F7FA;
					border-radius: 28rpx;
					z-index: -1;
				}

				.select_lang {
					width: 480rpx;
					background: #F5F7FA;
					border-radius: 28rpx;
					position: relative;
					padding: 0 24rpx;
					z-index: 0;
					height: 56rpx;
					line-height: 56rpx;

					.icon {
						width: 35rpx;
						position: absolute;
						top: 11rpx;
						left: 18rpx;
					}

					.input_select {
						width: 100%;
						font-size: 24rpx;
						padding: 0 24rpx;
						margin-left: 12rpx;
						height: 56rpx;
						line-height: 56rpx;
					}

					.icon_s {
						width: 20rpx;
						position: absolute;
						top: 19rpx;
						right: 18rpx
					}
					.date-select{
						width: 240rpx;
						position: relative;
						padding-left: 48rpx;
						.icon{
							left: -5rpx;
						}
					}
				}
			}

		}

		.zindexd{
			position: relative;
			z-index: 0;
		}
		.zindexg{
			position: relative;
			z-index: -1;
		}
		.content {
			background: #FFFFFF;
			border-radius: 16rpx;
			padding: 24rpx;
			margin-top: 24rpx;
		
			.che_content {
				margin-top: 30rpx;
				checkbox-group {
					justify-content: space-between;
					flex-wrap: wrap;
				}

				label {
					width: 210rpx;
					display: block;
					padding: 24rpx 0;

					checkbox {
						margin-right: 16rpx;
					}
				}
			}

			.info_content {
				justify-content: space-between;
				flex-wrap: wrap;

				.row {
					justify-content: space-between;
					background: #FFFFFF;
					box-shadow: 0rpx 2rpx 24rpx 0rpx rgba(48, 49, 51, 0.15);
					border-radius: 16rpx;
					padding: 26rpx 32rpx;
					margin: 12rpx 0;

					.icon {
						width: 72rpx;
					}

					.desc {
						font-size: 28rpx;
						color: #333333;
						font-weight: 500;
						margin-left: 32rpx;
					}
				}
			}
		}

		.btn {
			height: 80rpx;
			line-height: 80rpx;
			background: linear-gradient(95deg, #FA7532 0%, #FF5500 100%);
			border-radius: 44rpx;
			text-align: center;
			font-size: 32rpx;
			color: #FFFFFF;
			margin-top: 32rpx;
		}
	}
</style>
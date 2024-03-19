<!-- author by liushuag -->
<!-- date：2.15 -->
<template>
	<view class="main_content">
		<!-- 门店管理-新增角色-->
		<view class="role_content">
			<view class="title_text">角色信息</view>
			<view class="form">
				<view class="row flex_r_h">
					<view class="label">
						<text>*</text>
						角色名称
					</view>
					<view class="right_input">
						<input placeholder="请输入角色名称" placeholder-class="place_h" v-model="name" />
						<view class="error_tip" v-if="valiteFlag && name == ''">请输入角色名称</view>
					</view>
				</view>
				<view class="row">
					<view class="label">
						角色说明
					</view>
					<view class="right_input">
						<textarea placeholder="您可在此填写角色说明" placeholder-class="place_h" v-model="summary"/>
					</view>
				</view>
			</view>
		</view>
		<view class="qx_content">
			<view class="title_text">权限信息</view>
			<view class="content">
				<checkbox-group class="flex_r_h" @change="handlerSelectPer" >
					<label v-for="(item,index) in pemissionList" :key="index">
						<checkbox :value="item.id"  :name="item.id" :checked="item.checked"/>{{item.pemissonName}}
					</label>
				</checkbox-group>
				<view class="error_tip" v-if="valiteFlag && rolePemissonId.length == 0">请选择权限信息</view>
			</view>
		</view>
		<view class="footer_btn flex_r_h">
			<view class="reset_btn" @click="resetInfo">重置</view>
			<view class="commit_btn" @click="commitValite">提交</view>
		</view>
		<!-- 新建编辑提示 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog type="info" cancelText="关闭" confirmText="确认" title=" " :content="type==='add'?'是否新建该角色？':'是否修改该角色？' " @confirm="querySaveRole"></uni-popup-dialog>
		</uni-popup>
	</view>
	
</template>
<script>
	import api from '@/apis/index.js';
	export default {
		data() {
			return {
				show:false,
				type:'add',
				name:'',//角色名称
				rolePemissonId:[],//角色权限
				summary:'',//角色描述
				valiteFlag:false,
				pemissionList:[],
				roleId:''
				
			};
		},
		created() {

		},
		mounted() {
			
		},
		onLoad(option) {
			console.log("参数", option)
			this.getPermissonList()
			this.type = option?.type
			this.roleId = option?.roleId
			if(this.type === 'edit' ){
				this.getRoleDetails(this.roleId)
			}
		},
		methods: {
			// 获取角色详情
			getRoleDetails(id){
				api.getRoleDetails({
				  data: {
				   id:id
				  },
				  success: (data) => {
					  const { name , summary ,rolePemissonId} = data;
					  this.name = name;
					  this.summary = summary;
					  const newArray = this.pemissionList.map(item => ({
					    ...item,
					    checked: rolePemissonId.split(",").includes(item.id)
					  }));
					  this.pemissionList = newArray
					  // console.log(newArray,rolePemissonId.split(","));
					  // console.log("权限",this.pemissionList)
				  },
				  fail: (err) => {
				    this.$uni.showToast(err.message);
				  },
				})
			},
			/**
			 * 获取权限列表
			 * @param {Object} 
			 */
			getPermissonList(){
				api.getPermissonList({
				  data: {},
				  success: (data) => {
					  this.pemissionList = data
				  },
				  fail: (err) => {
					this.$uni.showToast(err.message);
				  },
				})
			},
			/**
			 * 选择权限信息
			 */
			handlerSelectPer(e){
				this.rolePemissonId = e.detail.value;
				console.log(this.rolePemissonId)
			},
			/**
			 * 提交校验必填字段
			 * @param summary 角色描述
			 * @param name 角色名称
			 * @param rolePemissonId 角色权限
			 */
			commitValite(){
				this.valiteFlag = true
				if(this.name === '' || this.rolePemissonId === '') return ;
				this.$refs.alertDialog.open()
			},
			/**
			 * 新增编辑角色
			 */
			querySaveRole() {
				let params = {
					name:this.name,
					summary:this.summary,
					rolePemissonId:this.rolePemissonId.toString()
				}
				if(this.type=='edit') params= {...params,id:this.roleId}
				api.saveRole({
				  data: {...params},
				  success: (data) => {
					  if(this.type === 'add'){
					  	this.$uni.showToast("该角色新建成功！");
						this.resetInfo()
					  }else{
					  	this.$uni.showToast("该角色编辑成功！");
						this.getRoleDetails(this.roleId)
					  }
					  
				  },
				  fail: (err) => {
					this.$uni.showToast(err.message);
				  },
				})
			},
			/**
			 *重置信息
			 */
			resetInfo(){
				this.name ='';
				this.summary = '';
				this.rolePemissonId = [];
				this.valiteFlag = false;
				this.show = false;
				// 重置权限信息
				const newArray = this.pemissionList.map(item => ({
				  ...item,
				  checked: false
				}));
				this.pemissionList = newArray
			}
			

		},
		onShow() {

		},
		destroyed() {},
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
	.error_tip {
		color: #FF5500;
		margin-top: 24rpx;
		text-align: right;
	}
	.slot-content{
		padding: 34rpx;
		text-align: center;
	}
	.main_content {
		.role_content {
			background: #fff;
			margin-bottom: 16rpx;
			padding: 32rpx 30rpx;
		}

		.qx_content {
			background: #fff;
			padding: 32rpx 30rpx;

			.content {
				margin-top: 30rpx;

				checkbox-group {
					justify-content: space-between;
					flex-wrap: wrap;
				}

				label {
					width: 224rpx;
					display: block;
					padding: 24rpx 0;

					checkbox {
						margin-right: 16rpx;
					}
				}
			}
		}

		.title_text {
			font-size: 32rpx;
			font-weight: 500;
			color: #333333;
		}

		.title_text::before {
			width: 6rpx;
			height: 24rpx;
			background: #FF5500;
			content: '';
			display: inline-block;
			margin-right: 12rpx;
		}

		.form {
			margin-top: 30rpx;

			.row {
				align-items: flex-start;
				justify-content: space-between;
				padding: 24rpx 0;
				border-bottom: 1rpx solid #eee;
			}

			.label {
				font-size: 28rpx;
				color: #333333;
				width: 130rpx;

				text {
					color: #FF3B30;
				}
			}

			.right_input {
				text-align: right;
				flex: 1;

				input {
					color: #333;
				}

				.place_h {
					color: #CCCCCC;
				}

				

				textarea {
					width: 100%;
					text-align: left;
					margin-top: 28rpx;
					color: #333;
				}
			}
		}

		.footer_btn {
			margin-top: 80rpx;
			padding: 0 40rpx;
			justify-content: space-between;

			view {
				width: 300rpx;
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				border-radius: 200rpx;
				font-size: 32rpx;

			}

			.reset_btn {
				color: #FF5500;
				border: 1rpx solid #FF5500;
				background: #FFFFFF;
			}

			.commit_btn {
				background: linear-gradient(95deg, #FA7532 0%, #FF5500 100%);
				color: #fff;
			}
		}
	}
</style>
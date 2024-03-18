<!-- author by liushuag -->
<!-- date：2.15 -->
<template>
	<view class="main_content">
		<!-- 门店管理-店员管理 -->
		<view class="main">
			<view class="top_tab flex_r_h">
				<view  :class="tabActive==item.id?'active':''" v-for="(item,index) in tabList" :key="index" @click="handlerTab(item.id)">{{item.label}}</view>
			</view>
			<view class="section">
				<!-- 角色搜索 -->
				<view class="search flex_r_h" v-if="tabActive == 1">
					<view class="input">
						<input placeholder="输入角色名称" v-model="keyword"/>
					</view>
					<view class="btn" @click="handlerSearch">查询</view>
				</view>
				<!-- 账号搜索 -->
				<view class="search warp_search" v-if="tabActive == 2">
						<view class="flex_r_h search_item">
							<view class="input">
								<input placeholder="输入用户账号" v-model="accountParmas.accountPhone"/>
							</view>
							<view class="input">
								<input placeholder="输入姓名" v-model="accountParmas.name"/>
							</view>
						</view>
						
						<view class="flex_r_h search_item">
							<view class="select">
								<uni-data-select
									v-model="accountParmas.roleId"
									:localdata="roleList"
									placeholder="请选择角色类型"
									:clear="false"
								  ></uni-data-select>
								
								<!-- <input placeholder="请选择角色类型" v-model="roleType" class="input_select" :disabled="true"/>
								<image mode="widthFix"  src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/select_icon.png" class="icon"></image> -->
							</view>
							<view class="select" @click="showSelect(1)">
								<uni-data-select
									v-model="accountParmas.status"
									:localdata="statusList"
									placeholder="请选择账号状态"
									:clear="false"
								  ></uni-data-select>
								<!-- <input placeholder="请选择账号状态" v-model="userStatus" class="input_select" :disabled="true"/>
								<image mode="widthFix"  src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/select_icon.png" class="icon"></image> -->
							</view>
							<view class="btn" @click="handlerSearch">查询</view>
						</view>
					
				</view>
				<view class="title flex_r_h">
					<view class="title_text">{{tabActive==1?'店员列表':'账号列表'}}</view>
					<view class="add_btn flex_r_h" v-if="tabActive == 1" @click="handleDetails('add')">
						<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/add_icon.png" mode="widthFix"></image>
						<text>新建角色</text>
					</view>
					<view class="add_btn flex_r_h" v-if="tabActive == 2" @click="handleDetails('add')">
						<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/add_icon.png" mode="widthFix"></image>
						<text>新建账号</text>
					</view>
				</view>
				<!-- 角色管理 -->
				<view class="dy_list" v-if="tabActive == 1">
					<view class="item" v-for="(item,index) in list" :key="index">
						<view class="row flex_r_h" >
							<view class="left flex_r_h">
								<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/yg-icon.png" mode="widthFix" class="icon"></image>
								<view class="label">角色名称</view>:
							</view>
							<view class="right">
								<text class="desc">{{item.name}}</text>
							</view>
						</view>
						<view class="row flex_r_h">
							<view class="left flex_r_h">
								<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/icon_zhsm.png" mode="widthFix" class="icon"></image>
								<view class="label">角色说明</view>:
							</view>
							<view class="right">
								<text class="desc">{{item.summary}}</text>
							</view>
						</view>
						<view class="row flex_r_h">
							<view class="left flex_r_h">
								<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/icon_qx.png" mode="widthFix" class="icon"></image>
								<view class="label">权限</view>:
							</view>
							<view class="right flex_r_h">
								<text class="tag" v-for="(per,perIndex) in item.permissArray" :key="perIndex">{{per}}</text>
							</view>
						</view>
						<view class="footer_btn flex_r_h">
							<view class="edit_btn" @click="handleDetails('edit',item.id)">编辑</view>
							<view class="delete_btn" @click="deleteRole(item.id,1)">删除</view>
						</view>
					</view>
				</view>
				<!-- 账号管理 -->
				<view class="dy_list" v-if="tabActive == 2 ">
					<view class="item" v-for="(item,index) in userlist" :key="index">
						<view class="row flex_r_h">
							<view class="left flex_r_h">
								<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/icon_xm.png" mode="widthFix" class="icon"></image>
								<view class="label">姓名</view>:
							</view>
							<view class="right">
								<text class="desc">{{item.name}}</text>
							</view>
						</view>
						<view class="row flex_r_h">
							<view class="left flex_r_h">
								<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/icon_phone.png" mode="widthFix" class="icon"></image>
								<view class="label">登录账号</view>:
							</view>
							<view class="right">
								<text class="desc">{{item.accountPhone}}</text>
							</view>
						</view>
						<view class="row flex_r_h">
							<view class="left flex_r_h">
								<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/icon_zhsm.png" mode="widthFix" class="icon"></image>
								<view class="label">账号说明</view>:
							</view>
							<view class="right">
								<text class="desc">{{item.summary}}</text>
							</view>
						</view>
						<view class="row flex_r_h">
							<view class="left flex_r_h">
								<image src="https://ggllstatic.hpgjzlinfo.com/static/store-mp/yg-icon.png" mode="widthFix" class="icon"></image>
								<view class="label">角色名称</view>:
							</view>
							<view class="right">
								<text class="desc">{{item.roleName}}</text>
							</view>
						</view>
						<view class="footer_btn flex_r_h zhgl_btn">
							<view class="edit_btn" @click="handleDetails('edit',item.id)">编辑</view>
							<view class="delete_btn" @click="enableAccount(1,item.id,item.status)">{{item.status == 0 ? '启用':'停用'}}</view>
							<view class="delete_btn"  v-if="item.status!=2" @click="deleteRole(item.id,2)">删除</view>
						</view>
					</view>	
				</view>
			</view>
			<view class="loading">
				<uni-load-more :status="status"  :content-text="loadText" ></uni-load-more>
			</view>
		</view>
		<!-- 删除提示 -->
		<uni-popup ref="alertDialog" type="dialog">
			<uni-popup-dialog :type="msgType" cancelText="关闭" confirmText="确认" title=" " :content="deleteText" @confirm="confirmDelete"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>
<script>
	import api from '@/apis/index.js';
	export default {
	  data() {
	    return {
			selectRoleShow:false,//角色选择
			selectShow:false,//账号状态选择
			tabActive:1,
			// tab
			tabList:[
				{
					id:1,
					label:'角色管理'
				},
				{
					id:2,
					label:'账号管理'
				},
			],
			// 状态字典
			statusList:[
				{
					value:'0',
					text:'未启用'
				},
				{
					value:'1',
					text:'启用'
				},
				{
					value:'2',
					text:'删除'
				},
			],
			// 搜索词
			keyword: '',
			// 查询账号参数
			accountParmas:{
				name:'',
				status:'',
				roleId:'',
				accountPhone:''
			},
			// 数据列表
			status: 'more',
			iconType: 'flower',
			loadText: {
				contentdown: '轻轻上拉',
				contentrefresh: '努力加载中',
				contentnomore: '我是有底线的'
			},
			list: [],//角色列表
			roleList:[],//不分页角色列表
			userlist:[],//账号列表
			pageNum: 1,
			pageSize: 10,
			show:false, //控制确认删除提示
			deleteText:'',
			mode: 'date',
			roleId:'', //角色id
			accountId:''//账号id
	    };
	  },
	  created() {
				
	  },
	 mounted(){
		// this.queryRoleList();
		this.queryRoleListNopage()
	 },
	  onLoad(e) {
	  },
	  // 下拉刷新
	  onPullDownRefresh() {
	  },
	  onShareAppMessage() {
	  
	  },
	  methods: {
		  dialogToggle(type) {
				this.msgType = type
				this.$refs.alertDialog.open()
			},
		/**
		 * 切换顶部tab
		 */
		handlerTab(id){
			this.tabActive = id;
			this.pageNum = 1;
			this.keyword = '';
			if(id === 1){
				this.queryRoleList()
			}else{
				this.queryUserAccountList()
			}
		},
	    /**
	     * 获取角色列表分页queryRoleList
		 * 不分页 queryRoleListNopage
	     */
	    queryRoleList() {
			this.status = 'loading';
	        let params = {
				queryObject:{
					name:this.keyword,
					status:1
				},
				pageNum:this.pageNum,
				pageSize:this.pageSize
					
		    }
			uni.showLoading()
			try {
				api.getRoleList({
				  data: {
				   ...params
				  },
				  success: (data) => {
				    uni.hideLoading()
					const roleList = data.list || [];
					if(this.pageNum == 1) this.list = [];
					  const newArray = roleList.map(role => {
						return { ...role, permissArray: role.permissName.split('、') };
					  });
					if (roleList.length) {
						this.list = this.list.concat(newArray);
						this.status = data.totalPages > data.pageNum ? "more" : "noMore";
					}else{
						 this.status = "noMore"; 
					}
					  if (this.list.length == 0) {
						this.status = "noMore";
					  }
				  },
				  fail: (err) => {
				    this.$uni.showToast(err.message);
				    uni.stopPullDownRefresh()
				    uni.hideLoading()
				  }
				})
			}catch (error) {
				this.status = "noMore";
				console.log(error);
			}
	        
		},
		queryRoleListNopage() {
		    let params = {
				queryObject:{
					name:''
				},
				pageNum:1,
				pageSize:10000
		    }
			api.getRoleList({
			  data: {
			   ...params
			  },
			  success: (data) => {
				  const { list , totalCount,totalPages  } = data;
				  const newArray = list.map(role => {
				  	return { ...role, value: role.id,text:role.name };
				  });
				  this.roleList = newArray
			  },
			  fail: (err) => {
			    uni.showToast(err.message)
			    uni.stopPullDownRefresh()
			    uni.hideLoading()
			  },
			})
		},
		/**
		 * 查询
		 */
		handlerSearch(){
			console.log(this.keyword)
			this.pageNum = 1
			if(this.tabActive === 1){
				this.list =[]
				this.queryRoleList()
			}else{
				this.userlist = []
				this.queryUserAccountList()
			}
		},
		/**
		 * 删除/确认删除
		 */
		deleteRole(id,type){
			if(type === 1){
				this.deleteText = '是否删除该角色？';
				this.roleId = id ;
			}else if(type == 2){
				this.deleteText = '是否删除该账号？';
				this.accountId = id;
			}
			this.msgType = type
			this.$refs.alertDialog.open()
		},
		confirmDelete(e){
			if(this.tabActive === 1){
				this.deleteRoleFunction(this.roleId)
			}else{
				this.enableAccount(2,this.accountId)
			}
		},
		//删除角色
		deleteRoleFunction(roleId) {
			let params = {
				roleId:roleId,
				status:2
			}
			api.saveRole({
			  data: {
			   ...params
			  },
			  success: (data) => {
				  this.$uni.showToast("该角色已删除！");
				  this.pageNum = 1 ;
				  this.queryRoleList() ;
			  },
			  fail: (err) => {
				 this.$uni.showToast(err.message);
			  },
			})
		},
		// 启用停用删除账号 type1 停用启用 2 删除
		enableAccount(type,id,status){
			let params = {
				id:id
			}
			if(type==1){
				params = {...params,status:status==0?1:0}
			}else{
				params = {...params,status:type}
			}
			api.saveUser({
			  data: {
			   ...params
			  },
			  success: (data) => {
				  // 0停用 1启用 2删除
				  if(type === 2){
				  	this.$uni.showToast("该账号已删除！");
				  }else{
				  	if(status === 0){
				  		this.$uni.showToast("该账号已停用！");
				  	}else{
				  		this.$uni.showToast("该账号已启用！");
				  	}
				  }
				  this.queryUserAccountList()
			  },
			  fail: (err) => {
				 this.$uni.showToast(err.message);
			  },
			})
		},
		/**
		 * 新建角色/角色详情
		 * 新建账号/账号详情
		 * @tabActive 1 角色 2 账号
		 */
		handleDetails(type,id){
			if(this.tabActive == 1){
				uni.navigateTo({
					url: '/pages/store-management/account_role/add_role?type='+type+'&roleId='+id
				})
			}else{
				uni.navigateTo({
					url: '/pages/store-management/account_role/add_zh?type='+type +'&accountId='+id
				})
			}
		},
		/**
		 * 获取用户账号列表
		 * @params name姓名 
		 * @params accountPhone手机号
		 * @params status状态
		 * @params roleId角色类型
		 */
		queryUserAccountList() {
			this.status = 'loading';
			uni.showLoading()
		    let params = {
				queryObject:{
					...this.accountParmas,
				},
				pageNum:this.pageNum,
				pageSize:this.pageSize
		    }
			try {
				api.getUserAccountList({
				  data: {
				   ...params
				  },
				  success: (data) => {
					const acList = data.list || [];
					if(this.pageNum == 1) this.userlist = [];
					if (acList.length) {
					  this.userlist = this.userlist.concat(acList);
					  this.status = data.totalPages > data.pageNum ? "more" : "noMore";
					}else{
					 this.status = "noMore"; 
					}
					if (this.userlist.length == 0) {
					  this.status = "noMore";
					}
					uni.hideLoading()
				  },
				  fail: (err) => {
				    uni.showToast(err.message)
				    uni.stopPullDownRefresh()
				    uni.hideLoading()
				  },
				})
			}catch (error) {
				this.status = "noMore";
				console.log(error);
			}
		},
		// 选择角色或状态显示模态
		showSelect(type){
			if(type==1){
				this.selectShow = true
			}else{
				this.selectRoleShow = true
			}
		},
	 },
	 // 上拉加载
	 onReachBottom() {
		 console.log('上拉',this.status , this.pageNum)
		if(this.status === 'noMore') return ;
		this.pageNum ++;
		if(this.tabActive == 1){
			this.queryRoleList()
		}else{
			this.queryUserAccountList()
		}
	 },
	 //下拉刷新
	 onPullDownRefresh() {
		 this.pageNum = 1
		if(this.tabActive == 1){
			this.queryRoleList()
		}else{
			this.queryUserAccountList()
		}
		setTimeout(function () {
			uni.stopPullDownRefresh();
		}, 200);
	},
	onShow() {
		uni.startPullDownRefresh();
	},
	destroyed() {
	},
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
	.flex_r_h{
		display: flex;
		align-items: center;
		justify-content: flex-start;
	}
	.flex_c_h{
		display: flex;
		align-items: center;
		justify-content:center;
		flex-direction: column;
	}
	.main_content{
		height: 480rpx;
		background: linear-gradient(180deg, #FE5A08 0%, rgba(254,89,6,0) 100%);
		padding: 24rpx 32rpx;
		.main{
			.top_tab{
				background: #EDEDED;
				border-radius: 16rpx 16rpx 0rpx 0rpx;
				view{
					width: 352rpx;
					height: 88rpx;
					line-height: 88rpx;
					font-size: 32rpx;
					color: #333333;
					text-align: center;
				}
				.active{
					font-weight: 500;
					color: #FF5500;
					background: linear-gradient(180deg, #FFEFE7 0%, #FFFFFF 100%);
					border-radius: 16rpx 16rpx 0rpx 0rpx;
					border: 2rpx solid #FFFFFF;
				}
				.active::after{
					content: '';
					display: block;
					width: 40rpx;
					height: 4rpx;
					background: #FF5500;
					border-radius: 3rpx;
					margin: auto;
				}
			}
			.section{
				background: #FFFFFF;
				padding: 48rpx 32rpx;
				.search{
					justify-content: space-between;
					.input{
						width: 464rpx;
						height: 56rpx;
						line-height: 56rpx;
						font-size: 24rpx;
						background: #F5F7FA;
						border-radius: 28rpx;
						padding: 0 24rpx;
						input{
							width: 100%;
							height: 56rpx;
							line-height: 56rpx;
						}
					}
					.btn{
						width: 136rpx;
						height: 56rpx;
						line-height: 56rpx;
						text-align: center;
						font-size: 28rpx;
						background: linear-gradient(95deg, #FA7532 0%, #FF5500 100%);
						border-radius: 28rpx;
						color: #FFFFFF;
						margin-left:24rpx;
					}
				}
				.warp_search{
					flex-wrap: wrap;
					.search_item{
						justify-content: space-between;
					}
					.input{
						width: 300rpx;
					}
					.select{
						width: 220rpx;
						height: 56rpx;
						background: #F5F7FA;
						border-radius: 28rpx;
						position: relative;
						padding-right: 10rpx;
						margin-top: 32rpx;
						.icon{
							width: 20rpx;
							position: absolute;
							top: 19rpx;
							right: 8rpx;
						}
						.input_select {
							width: 100%;
							height: 56rpx;
							line-height: 56rpx;
							font-size: 22rpx;
							background: #F5F7FA;
						}
					}
					// :nth-child(2){
					// 	margin-left:24rpx;
					// }		
					.btn{
						margin-top: 32rpx;
						margin-left:0;
					}
					
				}
				
				.title{
					justify-content: space-between;
					margin-top: 60rpx;
					.title_text{
						font-size: 32rpx;
						font-weight: 500;
						color: #333333;
					}
					.title_text::before{
						width: 6rpx;
						height: 24rpx;
						background: #FF5500;
						content: '';
						display: inline-block;
						margin-right: 12rpx;
					}
					.add_btn{
						justify-content: center;
						width: 184rpx;
						height: 56rpx;
						background: #FFFFFF;
						border-radius: 28rpx;
						border: 1rpx solid #FF5500;
						image{
							width: 32rpx;
						}
						text{
							font-size: 24rpx;
							color: #FF5500;
						}
					}
				}
				.dy_list{
					padding: 32rpx 16rpx;
					margin-top: 16rpx;
					.item{
						border-bottom: 1rpx solid #EDEDED;
						margin-bottom: 32rpx;
						.row{
							margin-bottom: 24rpx;
							align-items: flex-start;
						}
						.left{
							.icon{
								width: 24rpx;
							}
							.label{
								width: 120rpx;
								text-align-last: justify;
								margin: 0 16rpx 0 32rpx;
								font-size: 28rpx;
								font-weight: 500;
								color: #333333;
							}
						}
						.right{
							margin-left: 16rpx;
							flex-wrap: wrap;
							.desc{
								font-size: 28rpx;
								font-weight: 400;
								color: #333333;
							}
							.tag{
								width: 104rpx;
								height: 42rpx;
								line-height: 42rpx;
								background: #FFEEE6;
								border-radius: 4rpx;
								border: 1rpx solid #FF5500;
								color: #FF5500;
								text-align: center;
								font-size: 20rpx;
								margin-right: 16rpx;
								margin-bottom: 16rpx;
							}
						}
						.footer_btn{
							justify-content: space-between;
							margin: 48rpx 0;
							view{
								width: 276rpx;
								height: 68rpx;
								line-height: 68rpx;
								border-radius: 36rpx;
								text-align: center;
								border: 2rpx solid #DFDFDF;
							}
							.edit_btn{
								border: 2rpx solid #FF5500;
								color: #FF5500;
							}
							.delete_btn{
								
							}
						}
						.zhgl_btn{
							view{
								width: 150rpx;
							}
						}
					}
				}
			}
		}
	}
	.slot-content{
		padding: 34rpx;
		text-align: center;
	}
	.loading{
		padding: 34rpx;
		width: auto;
	}
</style>

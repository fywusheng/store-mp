<template>
	<view class="showData" ref="echartsWrapper" :class="[isLine?'isLine':'']">
		<view v-if="isShow" :class="isLineFeed?'showData-field-line':'showData-field-input'" @click="open">
			<view class="showData-field-label"
				:style="{minWidth:isLineFeed?'':labelWidths,width:isLineFeed?'':labelWidths,color:labelColor}"
				v-if="label"><span v-if="required" style="color: red">*</span>{{label}}</view>
			<!-- 多选 -->
			<view :class="direction=='left'?'textleft':'textR'" :style="{width: inpeWidth}"
				class="inputs checkbox showDatas" v-if="checkbox && !clickable">
				<view :style="{color: value?valueColor?valueColor:'':'#999',width: inpeWidthLfet}"
					:class="isoverflow?'showData-field-pu':''">
					<view v-if="ListXz.length>0">
						<view v-if="!isJoin">
							<view v-for="(item,index) in ListXz" :key="index">{{KeyType?item[showName]:item}}</view>
						</view>
						<view v-else>
							{{KeyType?ListXz.map(el=>{return el[showName]}).join(','):ListXz.map(el=>{return el}).join(',')}}
						</view>
					</view>
					<view :style="{color: placeholderColor }" v-else>{{placeholder}}</view>
				</view>
				<view v-if="arrow" class="arrows">
					<image src="./arrow.png" style="width: 30rpx;height: 30rpx;"></image>
				</view>
			</view>
			<!-- 单选 -->
			<view :style="{width: inpeWidth}" :class="direction=='left'?'textleft':'textR'" class="inputs showDatas"
				v-if="!checkbox && !clickable">
				<view :style="{color: ListXz.length>0?valueColor?valueColor:'':placeholderColor,width: inpeWidthLfet}"
					:class="isoverflow?'showData-field-pu':''">
					{{ListXz.length>0?(KeyType?ListXz[0][showName]:ListXz[0]):placeholder}}
				</view>
				<view v-if="arrow" class="arrows">
					<image src="./arrow.png" style="width: 30rpx;height: 30rpx;"></image>
				</view>
			</view>
			<!-- 可以点击 -->
			<view :style="{width: inpeWidth}" :class="direction=='left'?'textleft':'textR'" class="inputs showDatas"
				v-if="clickable">
				<view :style="{color: value?valueColor?valueColor:'':placeholderColor,width: inpeWidthLfet}"
					:class="isoverflow?'showData-field-pu':''">{{value?value:placeholder}}</view>
				<view v-if="arrow" class="arrows">
					<image src="./arrow.png" style="width: 30rpx;height: 30rpx;"></image>
				</view>
			</view>
		</view>
		<slot />

		<view class="bottomPopup" v-if="showPicker">
			<transition name="slide-up" appear>
				<view class="popup-content">
					<view class="pop-header" v-if="isHeader">
						<span class="pop-header-left" @click="onCancel">{{cancelText}}</span>
						<span class="pop-header-title">{{title}}</span>
						<span class="pop-header-right" :style="{color}" @click="onConfirm">{{confirmText}}</span>
					</view>
					<view class="pop-header" v-if="!isHeader">
						<slot name="popHeader" />
					</view>
					<view v-if="isSearch">
						<view style="background-color: #fff;padding: 15rpx 25rpx;">
							<view
								style="border-radius: 10rpx;padding: 0 25rpx;;display: flex;justify-content: center;background-color: #f5f5f5;line-height: 65rpx;height: 65rpx;">
								<view style="display: flex;justify-content: center;flex: 1;">
									<input style="line-height: 65rpx;height: 65rpx;flex: 1;" v-model.trim="key"
										:placeholder="headerPlaceholder" />
								</view>
								<view @click="onSearch" :style="{color}"
									style="width: 80rpx;text-align: center;margin-left: 25rpx;">
									搜索
								</view>
							</view>
						</view>
					</view>
					<view v-if="isLoading && popList.length==0" class="pop-main loading">
						<loading></loading>
					</view>
					<view v-else>
						<view class="pop-main">
							<view v-if="popList.length>0">
								<checkbox-group v-if="checkbox" @change="checkboxChange">
									<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in popList"
										:key="KeyType?item[keys]:item">
										<view>{{KeyType?item[showName]:item}}</view>
										<view>
											<checkbox :color="color" :value="KeyType?item[keys]:item"
												:checked="getChecked(KeyType?item[keys]:item)" />
										</view>
									</label>
								</checkbox-group>
								<radio-group v-else @change="radioChange">
									<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in popList"
										:key="KeyType?item[keys]:item">
										<view>{{KeyType?item[showName]:item}}</view>
										<view>
											<radio :color="color" :value="KeyType?item[keys]:item"
												:checked="(KeyType?item[keys]:item) == resultRadio" />
										</view>
									</label>
								</radio-group>
							</view>

							<view v-else class="noData">
								暂无可选数据
							</view>
						</view>
					</view>

				</view>
			</transition>
		</view>
	</view>
</template>

<script>
	import loading from './loading.vue'
	export default {
		name: 'showData',
		components: {
			loading
		},
		props: {
			list: {
				type: Array,
				default () {
					return []
				},
			},
			value: {
				type: [String, Array, Number],
				default: '',
			},
			valName: {
				type: String,
				default: '',
			},
			keys: {
				//需要识别的code标识
				type: String,
				default: 'code',
			},
			showName: {
				//需要展示标识
				type: String,
				default: 'name',
			},
			direction: {
				type: String,
				default: 'left',
			},
			clickable: {
				type: [Boolean, String],
				default: false,
			},
			isShow: {
				type: [Boolean, String],
				default: true,
			},
			isJoin: {
				type: [Boolean, String],
				default: false,
			},
			label: {
				type: String,
				default: '',
			},
			color: {
				type: String,
				default: '#00aaff',
			},
			labelColor: {
				type: String,
				default: '#646566',
			},
			placeholder: {
				type: String,
				default: '请选择',
			},
			placeholderColor: {
				type: String,
				default: '#999',
			},
			labelWidth: {
				type: String,
				default: '90px',
			},
			valueColor: {
				type: String,
				default: '',
			},
			required: {
				type: [Boolean, String],
				default: false,
			},
			isLineFeed: {
				type: [Boolean, String],
				default: true,
			},
			isLine: {
				//是否换显示线
				type: [Boolean, String],
				default: true,
			},
			isoverflow: {
				//是否超出隐藏
				type: [Boolean, String],
				default: true,
			},
			checkbox: {
				//是多选
				type: [Boolean, String],
				default: false,
			},
			disabled: {
				type: [Boolean, String],
				default: false,
			},
			arrow: {
				type: [Boolean, String],
				default: true,
			},
			title: {
				type: String,
				default: '请选择',
			},
			cancelText: {
				type: String,
				default: '取消',
			},
			confirmText: {
				type: String,
				default: '确定',
			},
			headerPlaceholder: {
				type: String,
				default: '请输入关键字进行搜索',
			},
			isSearch: {
				type: [Boolean, String],
				default: false,
			},
			isHeader: {
				type: [Boolean, String],
				default: true,
			},
			isSearchFun: {
				type: [Boolean, String],
				default: false,
			},
			alls: {
				type: [Boolean, String],
				default: false,
			},
			isLoading: {
				type: [Boolean, String],
				default: false,
			},
		},
		watch: {
			list() {
				this.loading = false
				this.popList = JSON.parse(JSON.stringify(this.list))
				this.setList()
			},
			value() {
				this.popList = JSON.parse(JSON.stringify(this.list))
				this.setList()
			},
		},
		// 数据说明
		/* list    传进来的数据
		 * popList 可以选择的数据
		 * result  当前选中的数据 ，key 数组
		 * ListJz  确定选择的数据 ，key 数组
		 * ListXz  确定选择的数据 ，全数组
		 *
		 */
		data() {
			return {
				loading: false,
				finished: false,
				popList: [],
				ListJz: [],
				ListXz: [],
				primary: "#f39800",
				result: [],
				KeyType: false,
				valueType: false,
				valueTypeObject: false,
				showPicker: false,
				eWidth: 0,
				inpeWidth: '',
				inpeWidthLfet: '',
				labelWidths: '90px',
				key: '',
				resultRadio: ''
			}
		},
		created() {
			this.loading = false
			this.popList = JSON.parse(JSON.stringify(this.list))
			this.setList()
		},
		mounted() {},
		methods: {
			getChecked(code) {
				return this.result.some(el => {
					return el == code
				})
			},
			checkboxChange(evt) {
				this.result = evt.detail.value
				console.log(this.result)
			},
			radioChange(evt) {
				this.result = [evt.detail.value]
				this.resultRadio = evt.detail.value
			},
			onSearch() {
				if (this.isSearchFun) {
					this.$emit('onSearch', this.key)
				} else {
					if (this.key) {
						this.popList = this.list.filter((el) => {
							return (this.KeyType ? el[this.showName] : el).indexOf(this.key) != -1
						})
					} else {
						this.popList = JSON.parse(JSON.stringify(this.list))
					}
				}
			},
			open() {
				if (!this.checkbox) {
					if (typeof this.value == 'string' || typeof this.value == 'number') {
						this.resultRadio = this.value
					} else {
						this.resultRadio = this.value[0]
					}
				} else {
					this.result = this.value
				}
				if (!this.disabled && !this.clickable) {
					this.showPicker = true
				}
				this.$emit('onOpen')
			},
			close() {
				this.showPicker = false
			},
			setList() {
				if (this.popList.length == 0) {
					if (this.disabled) {
						if (this.value) {
							if (this.checkbox) {
								this.ListXz = this.value
							} else {
								this.ListXz = [this.value]
							}
						} else {
							this.ListXz = []
						}
					}
					return
				}
				if (this.popList.length > 0) {
					if (typeof this.popList[0] == 'object') {
						this.KeyType = true
					} else {
						this.KeyType = false
					}
				}
				if (typeof this.value == 'string' || typeof this.value == 'number') {
					this.valueType = false
				} else {
					this.valueType = true
				}
				if (typeof this.value == 'string' || typeof this.value == 'number') {
					this.result = this.value ? [JSON.parse(JSON.stringify(this.value))] : []
				} else {
					let popList = this.value || []
					this.result = popList.map((el) => {
						let a = el
						if (typeof a == 'object') {
							a = el[this.keys]
						}
						return a
					})
				}
				this.ListJz = JSON.parse(JSON.stringify(this.result))
				this.ListXz = []
				this.popList.forEach((el, index) => {
					let type = this.result.some((a) => {
						let elc = this.KeyType ? el[this.keys] : el
						return elc == a
					})
					if (type) {
						this.ListXz.push(JSON.parse(JSON.stringify(el)))
					}
				})
			},
			opened() {
				this.normal = false
			},
			closed() {
				this.showPicker = false
				if (this.normal) {
					this.ListJz = JSON.parse(JSON.stringify(this.result))
				} else {
					this.result = JSON.parse(JSON.stringify(this.ListJz))
				}
			},
			onCancel() {
				this.normal = false
				this.showPicker = false
				this.$emit('cancel')
			},
			onConfirm() {
				if (this.required && this.result.length < 1) {
					this.$toast('您还未选择')
					return
				}
				this.ListXz = []
				this.popList.forEach((el, index) => {
					let type = this.result.some((a) => {
						let elc = this.KeyType ? el[this.keys] : el
						return elc == a
					})
					if (type) {
						this.ListXz.push(el)
					}
				})
				this.normal = true
				let firm = null
				if (this.valueType) {
					//返回数组  valueType
					firm = this.result
				} else {
					if (this.result.length > 0) {
						firm = this.result[0]
					} else {
						firm = ''
					}
				}
				this.showPicker = false
				this.$emit('input', this.alls ? this.ListXz : firm)
				this.$emit('toConfirm', this.ListXz)

				let nameData = this.ListXz.length > 0 ? this.ListXz[0] : ''
				let valName = (typeof nameData == 'object') ? nameData[this.showName] : nameData
				this.$emit('update:valName', valName)
			},
			dissatisfactionToggle(index) {
				if (!this.checkbox) {
					this.result = []
				}
				this.$refs.dissatisfactionCheckboxes[index].toggle()
			},
		},
		mounted() {
			this.eWidth = this.$refs.echartsWrapper.clientWidth
			if (this.isLineFeed) {
				this.labelWidths = this.eWidth + 'px'
			} else {
				this.labelWidths = this.labelWidth
			}
			this.inpeWidth = this.label ?
				this.isLineFeed ?
				this.eWidth + 'px' :
				'calc(' + (this.eWidth - 12 + 'px') + ' - ' + this.labelWidth + ')' :
				this.eWidth + 'px'
			this.inpeWidthLfet = this.label ?
				this.isLineFeed ?
				this.eWidth + 'px' :
				'calc(' + (this.eWidth - 12 - 20 + 'px') + ' - ' + this.labelWidth + ')' :
				this.eWidth - 20 + 'px'
		},
	}
</script>
<style scoped lang="scss">
	.bottomPopup {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		z-index: 999;
		background-color: rgba(0, 0, 0, 0.5);

		.popup-content {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			// top: 0;
			background-color: #ffffff;
		}

		.slide-up-enter-active,
		.slide-up-leave-active {
			transition: all .3s ease;
		}

		.slide-up-enter,
		.slide-up-leave-to {
			transform: translateY(100%);
		}

		.uni-list-cell {
			padding: 12rpx 20rpx;
			border-bottom: 1px solid #f5f5f5;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.uni-list-cell:active {
			background-color: #f5f5f5;
		}
	}

	.loading {
		text-align: center;
		line-height: 80px;
	}

	.textR {
		text-align: right;
	}

	.noData {
		text-align: center;
		line-height: 40vh;
		color: #999;
	}

	.inputs {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.arrows {
			width: 20px;
			font-size: 16px;
			margin-left: 4px;
			line-height: 25px;
			text-align: right;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #969799;
		}
	}

	.checkbox {
		line-height: 25px;
		// padding: 5px 0px;
	}

	.showData:active {
		background-color: #f9f9f9;
	}

	.showData {
		width: 100%;
		position: relative;

		.showData-field-input {
			line-height: 25px;
			display: flex;
			justify-content: space-between;
			align-items: flex-start;
			width: 100%;
			padding: 10px 0;

			.showData-field-label {
				margin-right: 12px;
				color: #969799;
			}

			.showData-field-pu::-webkit-scrollbar {
				display: none;
				/* Chrome Safari */
			}

			.showData-field-pu {
				padding-right: 5px;
				color: #323233;
				font-size: 14px;
				overflow-y: hidden;
				overflow-x: auto;
				scrollbar-width: none;
				/* firefox */
				-ms-overflow-style: none;
				/* IE 10+ */
				white-space: nowrap;
			}
		}

		.showData-field-line {
			padding: 10px 0;
			line-height: 25px;
			width: 100%;

			.showData-field-label {
				margin-right: 12px;
				color: #969799;
			}

			.showData-field-pu::-webkit-scrollbar {
				display: none;
				/* Chrome Safari */
			}

			.showData-field-pu {
				padding-right: 5px;
				color: #323233;
				font-size: 14px;
				overflow-y: hidden;
				overflow-x: auto;
				scrollbar-width: none;
				/* firefox */
				-ms-overflow-style: none;
				/* IE 10+ */
				white-space: nowrap;
			}
		}

		.color96 {
			color: #969799;
		}
	}

	.isLine::after {
		position: absolute;
		content: ' ';
		left: 0;
		right: 0;
		bottom: 0;
		border-bottom: 1px solid #ebedf0;
		-webkit-transform: scaleY(0.5);
		transform: scaleY(0.5);
		width: 100%;
	}

	.pop {
		&-header {
			height: 44px;
			border-bottom: 1px solid #ebedf0;
			background-color: #f7f8fa;
			align-items: center;
			display: flex;
			justify-content: center;
			font-size: 26rpx;

			&-left {
				width: 44px;
				text-align: center;
				color: #666;
			}

			&-right {
				width: 44px;
				text-align: center;
			}

			&-title {
				flex: 4;
				text-align: center;
				color: 32rpx;
				padding: 0 5px;
			}
		}

		&-main {
			overflow-x: hidden;
			overflow-y: auto;
			-webkit-overflow-scrolling: touch;
			scroll-behavior: smooth;
			height: 40vh;
		}
	}
</style>
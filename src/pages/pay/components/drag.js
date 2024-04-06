export default {
    data() {
        return {
            activeItem: null,
            isDrag: false,
            viewHeight: 0,
            dragTargetY: 0,
            itemHeight: 120,
            canScrollY: true,
            dataList: [],
            sortList: [],
            sortIndexList: [],
        }
    },
    watch: {
      list: {
        immediate: true,
        deep: true,
        handler (list) {
          this.setList(list)
        }
      }
    },
    methods: {
        touchstart(e){
            this.dragTargetY = e.touches[0].pageY;
        },
        longtap(item){
            this.activeItem = item;
            this.isDrag = true;
            item.isActive = true;
        },
        touchmove(e){
            if(!this.isDrag){
                return
            }
            if(this.isDrag){
                this.canScrollY = false
            }else{
                this.canScrollY = true
            }
            let newY = e.touches[0].pageY;
            let d = newY - this.dragTargetY;
            this.activeItem.top += d;
            
            let prevIndex = this.sortIndexList[this.activeItem.index] - 1;
            let nextIndex = this.sortIndexList[this.activeItem.index] + 1;
            if (prevIndex >= 0 && d < 0){
                let item = this.getItemByIndex(prevIndex);
                if (this.activeItem.top < item.top){
                    this.swapArray(item);
                }
            }else if (nextIndex < this.list.length && d > 0) {
                let item = this.getItemByIndex(nextIndex);
                if (this.activeItem.top > item.top){
                    this.swapArray(item);
                }
            }
            this.dragTargetY = newY;
        },
        touchend(item){
            this.canScrollY = true
            if(!this.isDrag){
                return
            }
            this.isDrag = false;
            item.isActive = false;
            this.activeItem.top = this.sortIndexList[this.activeItem.index] * this.rowHeight;
            let sortList = [];
            Array(this.dataList.length).fill(0).forEach((v,index)=>{
                let tempObj = this.deepClone(this.getItemByIndex(index));
                delete tempObj.isActive;
                delete tempObj.top;
                delete tempObj.index;
                sortList.push(tempObj);
            });
            this.$emit('change', sortList);
            this.sortList = sortList
        },
        getItemByIndex(index){
            for (let i = 0;i < this.sortIndexList.length;i++){
                if (this.sortIndexList[i] === index){
                    return this.dataList[i];
                }
            }
            return null;
        },
        swapArray(item) {//列表中两个元素交换位置
            let index = this.sortIndexList[this.activeItem.index];
            this.sortIndexList[this.activeItem.index] = this.sortIndexList[item.index];
            this.sortIndexList[item.index] = index;
            item.top = index * this.rowHeight;
            this.count = 0;
        },
        setList(list){
            this.sortList =  list.concat([]) 
            this.dataList = list.map((item, index) => {
              this.sortIndexList.push(index);
              return {
                ...item,
                isActive: false,
                top: index * this.rowHeight,
                index: index
              }
            })
            this.viewHeight = this.itemHeight * this.dataList.length
        },
        deepClone(obj){
            let result={},oClass=this.isClass(obj);
            console.log(oClass)
            for(let key in obj){
                let copy=obj[key];
                if(this.isClass(copy)=="Object"){
                    result[key]=arguments.callee(copy);
                }else if(this.isClass(copy)=="Array"){
                    result[key]=arguments.callee(copy);
                }else{
                    result[key]=obj[key];
                }
            }
            return result;
        },
        isClass(o){
            if(o===null) return "Null";
            if(o===undefined) return "Undefined";
            return Object.prototype.toString.call(o).slice(8,-1);
        }
    },
    mounted() {
    },
    computed:{
        rowHeight(){
            const res = uni.getSystemInfoSync();
            let screenWidth = res.screenWidth;
            if (this.itemHeight){
                return this.itemHeight*screenWidth/750;
            }else{
                return 0;
            }
        }
    }
}
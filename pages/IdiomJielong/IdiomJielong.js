// pages/IdiomJielong/IdiomJielong.js
import idiomsData from "../../data/idiom.js";
Page({
  data: {//页面数据
    idiomInputed:[{firstChar:"",nowidiom:"",flag:false}],
    idiomsMap:null,//成语数据 哈希表
    score:0,//得分
  },
  onLoad: function (options) {//页面加载时
    this.getIdioms();//获取数据
  },
  getIdioms:function(){//初始化成语数据
    let map = new Map();//使用哈希表存储 查询时间复杂度 O(1)
    let n = idiomsData.length;
    for(let i = 0;i<n;i++){
      let node = idiomsData[i];
      map.set(node.word,node);
    }
    this.setData({
      idiomsMap:map
    })
  },
  isIdioms:function(word){//判断是否为成语
    let res = {
      flag:false,
      details:null,
    }
    if(this.data.idiomsMap){
      res.flag = this.data.idiomsMap.has(word);
      res.details = this.data.idiomsMap.get(word);
    }
    return res
  },
  CheckandChangeState:function(e){//输入完成后 判断
    let dic = e.target.id;
    let word = e.detail.value;
    if(dic > 0 && word == this.data.idiomInputed[dic-1].nowidiom){//输入与上次相同
      this.showToptips("#topTipsNoSame");
      return;
    }
    if(dic > 0 && word[0] != this.data.idiomInputed[dic].firstChar){//首个字不相同
      this.showToptips("#topTipsFirstChar");
      return;
    }
    let res = this.isIdioms(word);
    this.data.idiomInputed[dic].flag = res.flag;
    if(res.flag){//查询成功
      this.data.score++;
      wx.setStorageSync('maxScore', Math.max(this.data.score,wx.getStorageSync('maxScore') || 0));
      this.data.idiomInputed[dic].nowidiom = res.details.word
      let node = {
        firstChar:word[word.length - 1],
        nowidiom:"",
        flag:false
      }
      this.data.idiomInputed.push(node);
    }else{//查询失败
      this.showToptips("#topTipsNoIdiom");
    }
    this.setData({
      idiomInputed:this.data.idiomInputed,
      score:this.data.score
    })
  },
  showToptips:function(id){//顶部提示栏动画效果
    let dur = 300;//动画时间
    let stopTime = 2000;//警告显示时间
    this.animate(id, [
      { translateY: "0rem" },
      { translateY: "3rem" },
      ], dur, function () {
        let that = this;
        setTimeout(() => {
          that.animate(id,[
            { translateY: "3rem" },
            { translateY: "0rem" },
          ], dur, function () {
            that.clearAnimation(id)
          }.bind(that))
        }, stopTime);
    }.bind(this))
  },
  giveUp:function(){//点击放弃后
    let url = '../../pages/IdiomMain/IdiomMain?nowScore=' + this.data.score;
    wx.navigateTo({
      url: url,
    })
  },

})
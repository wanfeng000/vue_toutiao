"use strict";(self["webpackChunkvue_toutiao"]=self["webpackChunkvue_toutiao"]||[]).push([[268],{268:function(t,e,s){s.r(e),s.d(e,{default:function(){return h}});var o=function(){var t=this,e=t._self._c;return e("div",{staticClass:"container"},[e("van-nav-bar",{attrs:{fixed:"","left-arrow":"",title:"小思同学"},on:{"click-left":function(e){return t.$router.back()}}}),e("div",{staticClass:"chat-list"},t._l(t.list,(function(s,o){return e("div",{key:o},["xs"===s.name?e("div",{staticClass:"chat-item left"},[e("van-image",{attrs:{fit:"cover",round:"",src:"https://img.yzcdn.cn/vant/cat.jpeg"}}),e("div",{staticClass:"chat-pao"},[t._v(t._s(s.msg))])],1):e("div",{staticClass:"chat-item right"},[e("div",{staticClass:"chat-pao"},[t._v(t._s(s.msg))]),e("van-image",{attrs:{fit:"cover",round:"",src:t.userAvatar}})],1)])})),0),e("div",{staticClass:"reply-container van-hairline--top"},[e("van-field",{attrs:{placeholder:"说点什么..."},scopedSlots:t._u([{key:"button",fn:function(){return[e("span",{staticStyle:{"font-size":"12px",color:"#999"},on:{click:function(e){return t.send()}}},[t._v("提交")])]},proxy:!0}]),model:{value:t.word,callback:function(e){t.word="string"===typeof e?e.trim():e},expression:"word"}})],1)],1)},n=[],i=s(294),a=s(924);let c=null;var r={name:"Chat",data(){return{word:"",list:[]}},created(){c=(0,a.io)("ws://www.liulongbin.top:9999"),c.on("connect",(()=>console.log("connect: websocket 连接成功！"))),c.on("disconnect",(()=>console.log("disconnect: websocket 连接关闭！"))),c.on("message",(t=>this.list.push({name:"xs",msg:t})))},beforeDestroy(){c.close(),c=null},methods:{send(){this.word&&(c.emit("send",this.word),this.list.push({name:"me",msg:this.word}),this.word="")},scrollToBottom(){const t=document.querySelectorAll(".chat-item"),e=t[t.length-1];e.scrollIntoView({behavior:"smooth",block:"end"})}},watch:{list(){this.$nextTick((()=>{this.scrollToBottom()}))}},computed:{...(0,i.mapGetters)(["userAvatar"])}},l=r,u=s(1),d=(0,u.Z)(l,o,n,!1,null,"971f4048",null),h=d.exports}}]);
//# sourceMappingURL=268.1e632dee.js.map
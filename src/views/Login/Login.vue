<template>
  <div class="login-container">
    <van-nav-bar title="黑马头条 - 登录" fixed />

    <!-- 登录的表单 -->
    <van-form @submit="login">
      <van-field v-model="form.mobile" type="tel" label="手机号码" placeholder="请输入手机号码" required :rules="rules.mobile">
      </van-field>
      <van-field v-model="form.code" type="password" label="登录密码" placeholder="请输入登录密码" required :rules="rules.code">
      </van-field>
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { loginAPI } from '@/api/userAPI'
// 1. 按需导入辅助方法
import { mapMutations } from 'vuex'
export default {
  name: 'Login',
  data () {
    return {
      // 登录表单的数据，最终要双向绑定到 form 这个数据对象上
      form: {
        // 用户的手机号
        mobile: '',
        // 登录的密码
        code: '246810'
      },
      // 表单的校验规则对象
      rules: {
        // 手机号的校验规则
        // 只有同时满足以下两个验证规则，才能验证通过
        mobile: [
          // 必填项的校验规则
          { required: true, message: '请填写您的手机号', trigger: 'onBlur' },
          // 11 位手机号的校验规则
          { pattern: /^1\d{10}$/, message: '请填写正确的手机号', trigger: 'onBlur' }
        ],
        // 密码的校验规则
        code: [{ required: true, message: '请填写您的密码', trigger: 'onBlur' }]
      }
    }
  },
  methods: {
    // 2. 映射 mutations 中的方法
    ...mapMutations(['updateTokenInfo']),

    async login () {
      // 只有当表单数据校验通过之后，才会调用此 login 函数
      const { data: res } = await loginAPI(this.form)
      console.log(res)

      // 判断是否登录成功了
      if (res.message === 'OK') {
        // 1. 把登录成功的结果，存储到 vuex 中
        this.updateTokenInfo(res.data)
        // 2. 要跳转到首页
        const navPath = this.$route.query.pre || '/'
        this.$router.replace(navPath)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  padding-top: 46px;
}
</style>
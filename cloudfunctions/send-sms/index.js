const cloud = require('wx-server-sdk')
const Crypto = require('crypto')
const Dayjs = require('dayjs')

cloud.init({
  env: process.env.ENV_ID
})

const db = cloud.database()

// 短信验证码集合
const SMS_COLLECTION = 'sms_codes'

// 生成6位随机数字验证码
function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

exports.main = async (event) => {
  const {
    phone
  } = event

  try {
    // 1. 频率限制检查（1分钟内不能重复发送）
    const recentRecord = await db.collection(SMS_COLLECTION)
      .where({
        phone,
        createdAt: db.command.gt(Date.now() - 60000) // 60秒内
      })
      .get()

    if (recentRecord.data.length > 0) {
      throw new Error('请求过于频繁，请稍后再试')
    }

    // 2. 生成验证码
    const code = generateCode()
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 5 * 60000) // 5分钟后过期

    // 3. 调用短信服务API（示例使用腾讯云，需替换实际参数）
    const result = await cloud.openapi.cloudbase.sendSms({
      env: cloud.getWXContext().ENV,
      content: `您的验证码是：${code}，5分钟内有效`,
      phoneNumberList: [phone],
      smsType: '普通',
      useShortName: true
    })

    console.log('短信发送结果:', result)

    // 4. 存储验证码记录
    await db.collection(SMS_COLLECTION).add({
      data: {
        phone,
        code,
        createdAt: now,
        expiresAt,
        used: false
      }
    })

    return {
      code: 200,
      message: '验证码发送成功',
      data: {
        code // 测试阶段返回验证码，正式环境应移除
      }
    }
  } catch (err) {
    console.error('短信发送失败:', err)
    return {
      code: 500,
      message: err.message || '验证码发送失败'
    }
  }
}
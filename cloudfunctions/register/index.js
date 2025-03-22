// 云函数入口
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  const { type, code, encryptedData, iv } = event
  
  // 1. 获取微信上下文
  const wxContext = cloud.getWXContext()
  
  // 2. 解密手机号
  if (type === 'phone') {
    const { phoneNumber } = await cloud.getOpenData({
      list: [encryptedData],
      iv,
      cloudID: context.CLOUDID
    })
    
    // 3. 查询用户是否存在
    const db = cloud.database()
    const user = await db.collection('users')
      .where({ openid: wxContext.OPENID })
      .get()
    
    if (user.data.length === 0) {
      // 新用户注册
      return db.collection('users').add({
        data: {
          openid: wxContext.OPENID,
          phone: phoneNumber,
          createdAt: db.serverDate()
        }
      })
    } else {
      // 老用户直接返回信息
      return user.data[0]
    }
  }
}
const request = async ({
  path,
  method = 'GET',
  data = {}
}) => {
  const {data: result} = await wx.cloud.callContainer({
    config: {
      env: 'prod-0glco3k7aad42178',
    },
    header: {
      "X-WX-SERVICE": "springboot-b6z3"
    },
    path,
    method,
    data
  })
  return result
}

export default request
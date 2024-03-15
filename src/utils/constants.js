
let apiRoot = ''
console.log('process.env', process.env)
if (process.env.BUILD_MODE === 'dev') {
  apiRoot='http://localhost:8017'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot='https://trello-api-kieq.onrender.com'
}
console.log('🚀 ~ apiRoot:', apiRoot)
export const API_ROOT = apiRoot
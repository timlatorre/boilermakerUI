import axios from 'axios'

export const requestDownload = (appFiles) => {
  console.log(appFiles)
  axios.post('/api/download/create', appFiles)
  .then(res => {
  console.log(res.data)
  window.location.replace(`/api/download/send/${res.data}`)
  }).catch(console.error)
}

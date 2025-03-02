fetch('https://api.github.com/repos/kufu/jpostcode-data/pulls')
  .then(r => r.json())
  .then(pullRequests => pullRequests.find(({title}) => title === 'bundle exec rake jpostcode:data:update_allx'))
  .then(pr => console.log(pr?.number));
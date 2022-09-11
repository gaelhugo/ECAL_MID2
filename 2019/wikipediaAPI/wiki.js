class Wiki {
  constructor() {
    fetch(
        'https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=Elon+Musk&origin=*')
        .then((data) => data.json())
        .then((json) => {
          let snippet = json.query.search[1].snippet;
          let snippet_clean = snippet.replace(/<\/?[^>]+(>|$)/g, '');
          console.log(snippet);
          console.log(snippet_clean);
        })
  }
};

new Wiki();

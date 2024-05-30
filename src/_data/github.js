const EleventyFetch = require('@11ty/eleventy-fetch');

module.exports = async function () {
  let url = 'https://api.github.com/users/rawsta/repos';

  // returning promise

  let data = await EleventyFetch(url, {
    duration: '1d',
    type: 'json'
  });

  return data;
};

/* USAGE:
{% for repository in github  %}

## [{{ repository.name }}]({{ repository.html_url }})

**{{ repository.stargazers_count }} GitHub stars**
{{ repository.description }}

{% endfor %}
*/
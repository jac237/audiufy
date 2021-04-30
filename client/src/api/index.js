const appName = 'AudiusTree';

const selectHost = async () => {
  const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
  console.log('getting Audius host');
  const host = await fetch('https://api.audius.co')
    .then((r) => r.json())
    .then((j) => j.data)
    .then((d) => sample(d))
    .catch((err) => console.log(err));
  return host;
};

const getUsersQuery = async (query) => {
  if (!query) return [];

  console.log('getting user with query:', query);
  const host = await selectHost();
  console.log('host: ', host);
  console.log(
    `url: ${host}/v1/users/search?query=${query}&app_name=${appName}`
  );

  const res = await fetch(
    `${host}/v1/users/search?query=${query}&app_name=${appName}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    }
  ).catch((err) => console.log(err));

  const json = await res.json();
  return json.data;
};

export { getUsersQuery };

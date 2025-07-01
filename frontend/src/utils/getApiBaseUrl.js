

function getApiBaseUrl() {
  const localIp = window.location.hostname;

    // return 'http://192.168.88.90:5003/'; // Solo para red 192.168.88.x

  return 'http://localhost:5003/'; // Solo para red 192.168.88.x

}

export default getApiBaseUrl;

export const fetchReq = async (
  url: string,
  body: object,
  options: RequestInit = {}
) => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json', // 指定发送的数据类型为 JSON
      },
      ...(options || {}),
      body: JSON.stringify(body || '{}'),
    });

    const data = await res.json();

    if (!res.ok || data.code !== '200') throw new Error(data.message);

    return data;
  } catch (err: any) {
    console.log(url, '报错：', err);
    throw new Error(err.message);
  }
};

/**
 * Response 对象
 */
export const res = (data: Indexes, status: number, opts?: ResponseInit) =>
  new Response(
    JSON.stringify({
      ...data,
      code: data.code || String(status),
    }),
    {
      status: status,
      ...opts,
    }
  );

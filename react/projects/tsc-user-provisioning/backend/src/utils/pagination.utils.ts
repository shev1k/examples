export const getPagination = (page: number, pageSize: number) => {
  const offset = page ? page * pageSize : 0;
  return { offset };
};

export const getPaginationFromQuery = <T extends { page?: string; pageSize?: string }>(
  query?: T,
) => {
  if (!query) return null;

  if (query.page && query.pageSize) {
    return {
      page: Number(query.page),
      pageSize: Number(query.pageSize),
    };
  }

  return null;
};

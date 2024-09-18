const pagination = (req, res, next) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : undefined;
  req.pagination = {
    page,
    limit,
  };

  next();
};

export { pagination };


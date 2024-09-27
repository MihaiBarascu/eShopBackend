const pagination = (req, res, next) => {
  const limit = req.query.limit || undefined;
  const offset = req.query.offset || undefined;

  req.pagination = {
    limit,
    offset,
  };

  next();
};

export { pagination };


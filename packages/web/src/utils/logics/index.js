export const isMenuLinkToShow = (item, payload = {}) => {
  const { priority } = payload
  let { private: private_ } = item
  const isPrivate = Boolean(private_)
  private_ = private_ && Array.isArray(private_) ? private_ : [private_]
  return !isPrivate || private_.includes(priority)
}

export const getEffectiveFetching = ({
  isFetching,
  isSuccess,
  isFetchedAfterMount,
}) => isFetching && (!isSuccess || isFetchedAfterMount)

export const getMinimumRate = (importantCustomer, reeferContainer) => {
  if (importantCustomer && reeferContainer) {
    return '0,150'
  }
  if (importantCustomer && !reeferContainer) {
    return '0,125'
  }
  if (!importantCustomer && reeferContainer) {
    return '0,200'
  }
  return '0,175'
}

export const getMaxGoodsValue = (reeferContainer, currencyGoods = 'EUR') => {
  if (reeferContainer) {
    return `150.000 ${currencyGoods}`
  } else {
    return `100.000 ${currencyGoods}`
  }
}

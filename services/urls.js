const createEndpoint = (endpoint) => {
  return `${"https://www.instantpay.in/ws/AndroidRecruitmentTest/"}${endpoint}`;
};

export const urls = {
  getToken: createEndpoint('getToken'),
  uploadImage: createEndpoint('uploadImage')
};

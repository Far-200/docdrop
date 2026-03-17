const generateOrderId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `DD-${timestamp}-${randomPart}`;
};

export default generateOrderId;

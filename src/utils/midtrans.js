const midtransClient = require('midtrans-client');

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const createTransaction = async (orderId, amount, user) => {
  const transactionParameters = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    credit_card: {
      secure: true,
    },
    customer_details: {
      email: user.email,
      first_name: user.displayName,
    },
  };

  try {
    const transaction = await snap.createTransaction(transactionParameters);
    return transaction.redirect_url;
  } catch (error) {
    throw new Error('Gagal membuat transaksi dengan Midtrans');
  }
};

module.exports = {
  createTransaction,
};

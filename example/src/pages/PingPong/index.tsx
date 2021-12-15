import React from 'react';
import { transactionServices } from 'dapp-core';

export const PingPongPage: () => JSX.Element = () => {
  const { sendTransactions } = transactionServices;

  const contractAddress =
    'erd1qqqqqqqqqqqqqpgquvt728n40ssd8n2qns9jrlqpwq2jc4rj4cysfuj3ad';

  const sendPingTransaction = () => {
    const pingTransaction = {
      value: '1',
      data: 'ping',
      receiver: contractAddress
    };

    sendTransactions({
      transactions: pingTransaction
    });
  };

  return (
    <div className='m-auto p-4'>
      <p className=''>Ping Pong</p>
      <button onClick={sendPingTransaction} className='btn btn-primary  mx-2'>
        Send ping
      </button>
    </div>
  );
};

export default PingPongPage;